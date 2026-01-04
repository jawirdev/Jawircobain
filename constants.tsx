
import React from 'react';
import { 
  Home, 
  MessageSquare, 
  Grid, 
  Palette, 
  Bot, 
  QrCode, 
  Trophy, 
  BarChart3,
  Calendar
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS_CONFIG = [
  { id: Tool.FORUM, label: 'Forum', icon: <MessageSquare size={20} />, description: 'Diskusi Jawir' },
  { id: Tool.AI, label: 'Jawir AI', icon: <Bot size={20} />, description: 'Asisten Pintar' },
  { id: Tool.HOME, label: 'Home', icon: <Home size={28} />, description: 'Menu Utama' },
  { id: Tool.LEADERBOARD, label: 'Top', icon: <Trophy size={20} />, description: 'Peringkat Chat' },
  { id: Tool.STATS, label: 'Stats', icon: <BarChart3 size={20} />, description: 'Data Statistik' },
  { id: Tool.CALENDAR, label: 'Sejarah', icon: <Calendar size={20} />, description: 'Peristiwa Masa Lalu' },
  { id: Tool.QR, label: 'QR Maker', icon: <QrCode size={20} />, description: 'Generate QR' },
  { id: Tool.GRID, label: 'IG Grid', icon: <Grid size={20} />, description: 'Kalkulator Feed' },
];

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB-oCX036WuNVyEjvAy0c63XObzM8eAOy8",
  authDomain: "jawir-chat.firebaseapp.com",
  databaseURL: "https://jawir-chat-default-rtdb.firebaseio.com",
  projectId: "jawir-chat",
  storageBucket: "jawir-chat.firebasestorage.app",
  messagingSenderId: "622194375638",
  appId: "1:622194375638:web:b2a4354502b51434cbc277",
  measurementId: "G-J7K9NQZ0GM"
};

export const superNormalize = (text: string): string => {
  if (!text) return "";
  let clean = text.toLowerCase();
  const map: {[key: string]: string} = {
    '4': 'a', '@': 'a', '3': 'e', '1': 'i', '!': 'i', '0': 'o', '5': 's', '$': 's', '7': 't', '8': 'b', 'v': 'u'
  };
  clean = clean.split('').map(char => map[char] || char).join('');
  clean = clean.replace(/[^a-z]/g, '');
  clean = clean.replace(/(.)\1+/g, '$1');
  return clean;
};

export const BLOCKLIST = [
  "kontol", "kntl", "knthl", "kntol", "memek", "mmk", "pantek", "pntk", "anjing", "anjng", "ajg", "anj", "asu", "asw", "goblok", "gblk", "tolol", "jancok", "jancuk", "cok", "peju", "ngentot", "ngewe", "sange", "bokep", "porno", "bugil", "itil", "jembut", "colmek", "coli", "tetek", "toket", "perek", "lonte", "jablay", "setan", "iblis", "dajjal", "pantat", "silit", "niga", "nigga", "negro", "jomok", "banci", "bencong", "autis", "yatim"
];
