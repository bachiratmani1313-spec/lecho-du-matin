#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
L'Écho du Matin — Pipeline Quotidien Automatique
=================================================
Chaque matin :
  1. Lit les flux RSS gratuits (France24, BBC, RTBF...)
  2. Crée titre + résumé propre + lien source
  3. Génère l'audio (voix française, edge-tts gratuit)
  4. Monte une vidéo (image + audio, FFmpeg gratuit)
  5. Publie la vidéo sur LA chaîne YouTube de Bachir
  6. Écrit articles.json (le site affiche LA vidéo intégrée)

100% gratuit. Aucune clé API payante.
"""

import os
import re
import sys
import json
import html
import asyncio
import subprocess
import traceback
from datetime import datetime, timezone

import requests
import feedparser
import trafilatura
import edge_tts
from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------------------------

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(REPO_ROOT, "public")
VIDEOS_DIR = os.path.join(PUBLIC_DIR, "videos")
WORK_DIR = os.path.join(REPO_ROOT, ".pipeline_work")
ARTICLES_JSON = os.path.join(PUBLIC_DIR, "articles.json")
LOG_FILE = os.path.join(PUBLIC_DIR, "pipeline-log.txt")

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(VIDEOS_DIR, exist_ok=True)
os.makedirs(WORK_DIR, exist_ok=True)

PIPELINE_VERSION = "v2026-05-20-l-youtube-priorite"

# Capture tout l'affichage dans un journal lisible depuis le site
class _Tee:
    def __init__(self):
        self._buf = []
        self._stdout = sys.__stdout__
    def write(self, s):
        self._buf.append(s)
        try:
            self._stdout.write(s)
        except Exception:
            pass
    def flush(self):
        try:
            self._stdout.flush()
        except Exception:
            pass
    def dump(self):
        return "".join(self._buf)

_LOG = _Tee()


def write_log_file():
    try:
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            f.write(f"PIPELINE {PIPELINE_VERSION}\n")
            f.write(f"Généré : {datetime.now(timezone.utc).isoformat()}\n")
            f.write("=" * 60 + "\n")
            f.write(_LOG.dump())
    except Exception:
        pass

# Voix française posée (préférence Bachir : fr-FR-HenriNeural)
TTS_VOICE = "fr-FR-HenriNeural"

# Nombre d'articles par rubrique
ARTICLES_PER_CATEGORY = 2

# Limite d'upload YouTube par jour (les N premiers articles seulement).
# YouTube bloque au-delà d'un certain nombre/jour pour une chaîne récente.
# Le site garde TOUTES les vidéos en local (rien n'est perdu visuellement).
YOUTUBE_UPLOAD_LIMIT = 3

# RUBRIQUES PRIORITAIRES pour YouTube : on concentre les 3 vidéos quotidiennes
# sur les rubriques qui parlent à notre public (effet multiplicateur de vues).
# Les autres rubriques ont seulement une vidéo locale sur le site (pas d'upload YouTube).
# Bachir : ajuste cette liste selon ce qui marche le mieux dans tes statistiques.
YOUTUBE_PRIORITY_CATEGORIES = ["maghreb", "une"]

# Flux RSS gratuits par rubrique — SOURCES 100% FRANÇAISES (pas d'anglais)
# Ordre IMPORTANT : les rubriques en haut sont traitées en premier
# → c'est ce qui détermine quelles vidéos partent sur YouTube (cf. YOUTUBE_PRIORITY_CATEGORIES)
RSS_FEEDS = {
    "maghreb": [
        # Sources francophones du Maghreb — actu locale et vie quotidienne (PRIORITÉ YouTube)
        "https://www.tsa-algerie.com/feed/",          # Algérie
        "https://fr.hespress.com/feed",                # Maroc (édition française)
        "https://www.tunisienumerique.com/feed/",      # Tunisie
        "https://www.france24.com/fr/afrique/rss",     # fallback Afrique généraliste
    ],
    "une": [
        "https://www.france24.com/fr/rss",
        "https://www.francetvinfo.fr/titres.rss",
    ],
    "geopolitique": [
        "https://www.france24.com/fr/moyen-orient/rss",
        "https://www.france24.com/fr/europe/rss",
    ],
    "finance": [
        "https://www.france24.com/fr/économie/rss",
        "https://www.francetvinfo.fr/economie.rss",
    ],
    "meteo": [
        "https://www.lemonde.fr/planete/rss_full.xml",
        "https://www.francetvinfo.fr/monde/environnement.rss",
        "https://www.francetvinfo.fr/titres.rss",
    ],
    "europe": [
        "https://www.rtbf.be/site-info/api/rss/info.xml",
        "https://www.france24.com/fr/europe/rss",
    ],
    "futur": [
        "https://www.france24.com/fr/tech/rss",
        "https://www.francetvinfo.fr/internet.rss",
    ],
}

YOUTUBE_ENABLED = True  # passe à False pour désactiver l'upload (test local)


# ---------------------------------------------------------------------------
# UTILITAIRES
# ---------------------------------------------------------------------------

def clean_text(raw: str) -> str:
    """Nettoie le HTML et les espaces d'un texte RSS."""
    if not raw:
        return ""
    txt = re.sub(r"<[^>]+>", "", raw)
    txt = html.unescape(txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt


def slugify(text: str, maxlen: int = 40) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return s[:maxlen] or "article"


# ---------------------------------------------------------------------------
# TRADUCTION 5 LANGUES (gratuite, sans clé API)
# ---------------------------------------------------------------------------

# Langues cibles (le français est l'original, pas besoin de le traduire)
TARGET_LANGS = ["en", "es", "de", "ar"]


def _translate_text(text: str, target: str) -> str:
    """Traduit un texte (avec découpage si > 4500 caractères). Secours = texte FR."""
    if not text or not text.strip():
        return text
    try:
        from deep_translator import GoogleTranslator
        translator = GoogleTranslator(source="fr", target=target)
        if len(text) <= 4500:
            return translator.translate(text) or text
        # Découpage par phrases pour respecter la limite de 5000 caractères
        chunks, current = [], ""
        for sentence in re.split(r"(?<=[.!?])\s+", text):
            if len(current) + len(sentence) + 1 > 4500:
                if current:
                    chunks.append(current)
                current = sentence
            else:
                current = (current + " " + sentence).strip()
        if current:
            chunks.append(current)
        return " ".join(translator.translate(c) or c for c in chunks)
    except Exception as e:
        print(f"    ⚠️ Traduction {target} échouée : {e}")
        return text  # secours : on garde le français plutôt que rien


def translate_article(title: str, summary: str, content: str) -> dict:
    """Renvoie {lang: {title, summary, content}} pour les 4 langues cibles."""
    translations = {}
    for lang in TARGET_LANGS:
        print(f"    🌍 Traduction → {lang}")
        translations[lang] = {
            "title": _translate_text(title, lang),
            "summary": _translate_text(summary, lang),
            "content": _translate_text(content, lang),
        }
    return translations


# ---------------------------------------------------------------------------
# 1. RÉCUPÉRATION DES ARTICLES RSS
# ---------------------------------------------------------------------------

def fetch_articles():
    """Retourne {categorie: [ {title, summary, content, link, image}, ... ]}"""
    result = {}
    for cat, feeds in RSS_FEEDS.items():
        collected = []
        for feed_url in feeds:
            if len(collected) >= ARTICLES_PER_CATEGORY:
                break
            try:
                print(f"  📡 RSS [{cat}] : {feed_url}")
                parsed = feedparser.parse(feed_url)
                for entry in parsed.entries:
                    if len(collected) >= ARTICLES_PER_CATEGORY:
                        break
                    title = clean_text(entry.get("title", ""))
                    if not title:
                        continue

                    # Résumé court (pour l'aperçu sur la carte)
                    short = clean_text(entry.get("summary", "") or entry.get("description", ""))
                    link = entry.get("link", "")

                    # 1) Texte LE PLUS COMPLET : on ouvre la page et on extrait le vrai article
                    full = ""
                    if link:
                        try:
                            downloaded = trafilatura.fetch_url(link)
                            if downloaded:
                                extracted = trafilatura.extract(
                                    downloaded,
                                    include_comments=False,
                                    include_tables=False,
                                    favor_precision=True,
                                )
                                if extracted:
                                    full = clean_text(extracted)
                        except Exception as ex:
                            print(f"    ⚠️ Extraction page échouée : {ex}")

                    # 2) Repli : content:encoded du flux RSS
                    if len(full) < 400 and "content" in entry and entry.content:
                        rss_full = clean_text(entry.content[0].get("value", ""))
                        if len(rss_full) > len(full):
                            full = rss_full
                    # 3) Repli final : la description courte
                    if len(full) < len(short):
                        full = short
                    if not full:
                        full = title

                    # Image éventuelle du flux
                    image = ""
                    if "media_content" in entry and entry.media_content:
                        image = entry.media_content[0].get("url", "")
                    elif "media_thumbnail" in entry and entry.media_thumbnail:
                        image = entry.media_thumbnail[0].get("url", "")
                    elif "links" in entry:
                        for l in entry.links:
                            if l.get("type", "").startswith("image"):
                                image = l.get("href", "")
                                break

                    # summary = aperçu court ; content = article long et nourrissant
                    summary = (short or full)[:300]
                    content = full[:3500]  # texte long (et traduisible sans exploser)
                    print(f"    📏 Contenu : {len(content)} caractères")
                    collected.append({
                        "title": title,
                        "summary": summary,
                        "content": content,
                        "link": link,
                        "image": image,
                    })
            except Exception as e:
                print(f"  ⚠️  Flux ignoré ({feed_url}) : {e}")
        result[cat] = collected
        print(f"  ✅ [{cat}] {len(collected)} article(s)")
    return result


# ---------------------------------------------------------------------------
# 2. GÉNÉRATION AUDIO (edge-tts, gratuit)
# ---------------------------------------------------------------------------

async def _tts(text: str, out_path: str):
    communicate = edge_tts.Communicate(text, TTS_VOICE)
    await communicate.save(out_path)


def generate_audio(text: str, out_path: str) -> bool:
    try:
        asyncio.run(_tts(text, out_path))
        return os.path.exists(out_path) and os.path.getsize(out_path) > 0
    except Exception as e:
        print(f"  ⚠️  Audio échoué : {e}")
        return False


# ---------------------------------------------------------------------------
# 3. GÉNÉRATION IMAGE (Pillow, carte L'Écho du Matin)
# ---------------------------------------------------------------------------

def _load_font(size: int):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()


def _wrap(draw, text, font, max_width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:6]


def generate_image(title: str, category_label: str, out_path: str) -> bool:
    try:
        W, H = 1920, 1080
        img = Image.new("RGB", (W, H), "#ffffff")
        d = ImageDraw.Draw(img)

        # Bandeau haut noir
        d.rectangle([0, 0, W, 150], fill="#000000")
        f_brand = _load_font(54)
        d.text((80, 45), "L'ÉCHO DU MATIN", font=f_brand, fill="#ffffff")
        f_sub = _load_font(26)
        d.text((W - 520, 60), "6 HEURES, VU PAR L'IA", font=f_sub, fill="#bbbbbb")

        # Rubrique
        f_cat = _load_font(34)
        d.text((80, 230), category_label.upper(), font=f_cat, fill="#888888")

        # Titre (gros, wrap)
        f_title = _load_font(78)
        lines = _wrap(d, title, f_title, W - 160)
        y = 320
        for line in lines:
            d.text((80, y), line, font=f_title, fill="#000000")
            y += 100

        # Bandeau bas
        d.rectangle([0, H - 90, W, H], fill="#000000")
        f_foot = _load_font(28)
        today = datetime.now().strftime("%d/%m/%Y")
        d.text((80, H - 65), f"DIRECTEUR : ATMANI BACHIR  ·  {today}", font=f_foot, fill="#ffffff")
        d.text((W - 360, H - 65), "lechodumatin.com", font=f_foot, fill="#ffffff")

        img.save(out_path, "PNG")
        return True
    except Exception as e:
        print(f"  ⚠️  Image échouée : {e}")
        return False


# ---------------------------------------------------------------------------
# 4. MONTAGE VIDÉO (FFmpeg, gratuit)
# ---------------------------------------------------------------------------

def make_video(image_path: str, audio_path: str, out_path: str) -> bool:
    try:
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", image_path,
            "-i", audio_path,
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            out_path,
        ]
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if r.returncode != 0:
            print(f"  ⚠️  FFmpeg : {r.stderr[-400:]}")
            return False
        return os.path.exists(out_path) and os.path.getsize(out_path) > 0
    except Exception as e:
        print(f"  ⚠️  Vidéo échouée : {e}")
        return False


# ---------------------------------------------------------------------------
# 5. UPLOAD YOUTUBE (OAuth refresh token — tokens déjà dans les secrets)
# ---------------------------------------------------------------------------

def get_youtube_client():
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build

    client_id = os.environ.get("YT_CLIENT_ID")
    client_secret = os.environ.get("YT_CLIENT_SECRET")
    refresh_token = os.environ.get("YT_REFRESH_TOKEN")

    if not all([client_id, client_secret, refresh_token]):
        print("  ⚠️  Secrets YouTube manquants — upload désactivé")
        return None

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=["https://www.googleapis.com/auth/youtube.upload"],
    )
    return build("youtube", "v3", credentials=creds, cache_discovery=False)


def upload_youtube(youtube, video_path: str, title: str, description: str) -> str:
    from googleapiclient.http import MediaFileUpload
    try:
        body = {
            "snippet": {
                "title": title[:95],
                "description": description[:4900],
                "categoryId": "25",  # News & Politics
                "tags": ["L'Écho du Matin", "actualité", "info", "journal"],
            },
            "status": {
                "privacyStatus": "public",
                "selfDeclaredMadeForKids": False,
            },
        }
        media = MediaFileUpload(video_path, chunksize=-1, resumable=True, mimetype="video/mp4")
        request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
        response = None
        while response is None:
            status, response = request.next_chunk()
        vid = response.get("id")
        print(f"  📺 Vidéo YouTube publiée : https://youtu.be/{vid}")
        return vid
    except Exception as e:
        print(f"  ⚠️  Upload YouTube échoué : {e}")
        return ""


# ---------------------------------------------------------------------------
# PIPELINE PRINCIPAL
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("🎬 L'ÉCHO DU MATIN — PIPELINE QUOTIDIEN")
    print("=" * 60)

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    print("\n📰 Étape 1/5 — Récupération des articles RSS...")
    by_cat = fetch_articles()

    youtube = None
    if YOUTUBE_ENABLED:
        print("\n🔑 Connexion YouTube...")
        try:
            youtube = get_youtube_client()
        except Exception as e:
            print(f"  ⚠️  YouTube indisponible : {e}")

    all_articles = []
    idx = 0
    youtube_uploaded = 0
    for cat, articles in by_cat.items():
        for art in articles:
            idx += 1
            try:
                print(f"\n🛠️  Article #{idx} [{cat}] : {art['title'][:60]}...")
                slug = f"{today}-{cat}-{idx}-{slugify(art['title'])}"
                audio_p = os.path.join(WORK_DIR, slug + ".mp3")
                image_p = os.path.join(WORK_DIR, slug + ".png")
                video_p = os.path.join(VIDEOS_DIR, slug + ".mp4")

                video_rel = ""
                narration = f"{art['title']}. {art['summary']}"
                youtube_id = ""

                if generate_audio(narration, audio_p) and generate_image(art["title"], cat, image_p):
                    if make_video(image_p, audio_p, video_p):
                        video_rel = "/videos/" + os.path.basename(video_p)
                        is_priority = cat in YOUTUBE_PRIORITY_CATEGORIES
                        if youtube and is_priority and youtube_uploaded < YOUTUBE_UPLOAD_LIMIT:
                            youtube_uploaded += 1
                            print(f"  📤 Upload YouTube ({youtube_uploaded}/{YOUTUBE_UPLOAD_LIMIT}) — rubrique prioritaire « {cat} »")
                            desc = (
                                f"{art['summary']}\n\n"
                                f"📰 Article complet : {art['link']}\n\n"
                                f"🌐 L'Écho du Matin — lechodumatin.com\n"
                                f"Directeur : Atmani Bachir"
                            )
                            youtube_id = upload_youtube(youtube, video_p, art["title"], desc)
                        elif youtube and not is_priority:
                            print(f"  ⏭️  Article #{idx} ({cat}) : rubrique non prioritaire — vidéo locale seulement")
                        elif youtube:
                            print(f"  ⏭️  Article #{idx} ({cat}) : quota YouTube atteint ({YOUTUBE_UPLOAD_LIMIT}/jour) — vidéo locale seulement")

                # Traduction écrite dans les 4 autres langues (FR = original)
                print(f"  🌍 Traduction de l'article #{idx}...")
                translations = translate_article(
                    art["title"], art["summary"], art["content"]
                )

                all_articles.append({
                    "date": today,
                    "category": cat,
                    "title": art["title"],
                    "summary": art["summary"],
                    "content": art["content"],
                    "link": art["link"],
                    "image": art["image"],
                    "youtubeId": youtube_id,
                    "videoFile": video_rel,
                    "translations": translations,
                })
            except Exception as e:
                print(f"  ⚠️ Article #{idx} ignoré (erreur) : {e}")
                # On garde quand même l'article (sans vidéo) pour ne rien perdre
                all_articles.append({
                    "date": today, "category": cat,
                    "title": art.get("title", ""), "summary": art.get("summary", ""),
                    "content": art.get("content", ""), "link": art.get("link", ""),
                    "image": art.get("image", ""), "youtubeId": "", "videoFile": "",
                    "translations": {},
                })

    # Écriture du fichier lu par le site
    with open(ARTICLES_JSON, "w", encoding="utf-8") as f:
        json.dump({"updated": today, "articles": all_articles}, f, ensure_ascii=False, indent=2)

    print(f"\n✅ {len(all_articles)} articles écrits dans public/articles.json")
    print("=" * 60)
    return 0


def _run_git(args):
    r = subprocess.run(["git"] + args, cwd=REPO_ROOT, capture_output=True, text=True)
    label = " ".join(args)
    print(f"  $ git {label} -> rc={r.returncode}")
    out = (r.stdout or "").strip()
    err = (r.stderr or "").strip()
    if out:
        print("    " + out[:300])
    if r.returncode != 0 and err:
        print("    ⚠️ " + err[:300])
    return r.returncode


def git_save():
    """
    Sauvegarde INCREVABLE :
    1. copie le contenu généré de côté (articles.json, vidéos, log)
    2. git reset --hard FETCH_HEAD  -> état EXACT du dernier distant (table rase)
    3. remet le contenu généré par-dessus
    4. commit + push  -> fast-forward TOUJOURS possible (zéro conflit)
    """
    import shutil
    import tempfile
    try:
        tmp = tempfile.mkdtemp()
        if os.path.exists(ARTICLES_JSON):
            shutil.copy(ARTICLES_JSON, os.path.join(tmp, "articles.json"))
        if os.path.exists(LOG_FILE):
            shutil.copy(LOG_FILE, os.path.join(tmp, "pipeline-log.txt"))
        tmp_videos = os.path.join(tmp, "videos")
        if os.path.isdir(VIDEOS_DIR):
            shutil.copytree(VIDEOS_DIR, tmp_videos)

        _run_git(["config", "user.name", "🤖 L'Écho Bot"])
        _run_git(["config", "user.email", "echo@lechodumatin.com"])

        for attempt in range(1, 5):
            print(f"\n  🔁 Sauvegarde tentative #{attempt}", flush=True)
            if _run_git(["fetch", "origin", "main"]) != 0:
                continue
            # TABLE RASE : on se cale EXACTEMENT sur le dernier distant
            _run_git(["reset", "--hard", "FETCH_HEAD"])
            # On repose le contenu généré PAR-DESSUS
            os.makedirs(VIDEOS_DIR, exist_ok=True)
            if os.path.exists(os.path.join(tmp, "articles.json")):
                shutil.copy(os.path.join(tmp, "articles.json"), ARTICLES_JSON)
            if os.path.exists(os.path.join(tmp, "pipeline-log.txt")):
                shutil.copy(os.path.join(tmp, "pipeline-log.txt"), LOG_FILE)
            if os.path.isdir(tmp_videos):
                for fn in os.listdir(tmp_videos):
                    shutil.copy(os.path.join(tmp_videos, fn),
                                os.path.join(VIDEOS_DIR, fn))
            _run_git(["add", "public/"])
            rc = _run_git(["commit", "-m",
                           f"📰 Articles + vidéos {datetime.now().strftime('%Y-%m-%d %H:%M')}"])
            if rc != 0:
                print("  ℹ️ Rien de nouveau à commiter", flush=True)
                return
            # On est PILE sur le dernier distant -> push = fast-forward garanti
            if _run_git(["push", "origin", "HEAD:main"]) == 0:
                print("  ✅ SAUVEGARDÉ sur GitHub → Vercel va redéployer", flush=True)
                return
            print("  ⚠️ Push rejeté, nouvel essai...", flush=True)
        print("  ❌ Sauvegarde impossible après 4 tentatives", flush=True)
    except Exception as e:
        print(f"  ⚠️ Sauvegarde git échouée : {e}", flush=True)


if __name__ == "__main__":
    sys.stdout = _LOG
    sys.stderr = _LOG
    print(f"🏷️  PIPELINE {PIPELINE_VERSION}")
    exit_code = 0
    try:
        exit_code = main()
    except Exception:
        traceback.print_exc()
        exit_code = 1
    finally:
        # Écrit le journal de bord (lisible sur le site) PUIS sauvegarde tout
        print("\n💾 Sauvegarde sur GitHub (journal + articles + vidéos)...")
        write_log_file()
        git_save()
    sys.exit(exit_code)
