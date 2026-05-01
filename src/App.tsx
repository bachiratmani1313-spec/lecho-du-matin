import React, { useState, useEffect, useRef } from 'react';
import { Category, NewsArticle, Language } from './types';
import { fetchNews, speakArticle, decodeAudio, createWavBlob } from './services/geminiService';
import { AnnouncementsView } from './components/AdBanner';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  ChevronLeft, 
  Radio, 
  AlertCircle,
  RefreshCw,
  Key,
  Sword,
  TrendingUp,
  Cpu,
  Trophy,
  Stethoscope,
  Globe,
  Palette,
  CloudSun,
  Newspaper,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const CATEGORY_IMAGES: Record<string, string> = {
  [Category.UNES]: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  [Category.GEOPOLITIQUE]: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
  [Category.FINANCE]: "https://images.unsplash.com/photo-1611974714024-46202e33bc3b?auto=format&fit=crop&w=1200&q=80",
  [Category.METEO]: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80",
  [Category.SOCIETE]: "https://images.unsplash.com/photo-1560161407-063991206644?auto=format&fit=crop&w=1200&q=80",
  [Category.TECH]: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  [Category.ANNONCES]: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80"
};

con
