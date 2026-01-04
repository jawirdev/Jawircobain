
import React from 'react';
import { 
  Home, 
  MessageSquare, 
  Grid, 
  Palette, 
  Bot, 
  QrCode, 
  Trophy, 
  BarChart3 
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS_CONFIG = [
  { id: Tool.HOME, label: 'Home', icon: <Home size={20} />, description: 'Menu Utama' },
  { id: Tool.FORUM, label: 'Forum Chat', icon: <MessageSquare size={20} />, description: 'Komunitas Jawir' },
  { id: Tool.GRID, label: 'IG Grid', icon: <Grid size={20} />, description: 'Kalkulator Feed' },
  { id: Tool.COLOR, label: 'Color Picker', icon: <Palette size={20} />, description: 'Ekstrak Warna' },
  { id: Tool.AI, label: 'AI Assistant', icon: <Bot size={20} />, description: 'Tanya Jawir AI' },
  { id: Tool.QR, label: 'QR Generator', icon: <QrCode size={20} />, description: 'Buat Kode QR' },
  { id: Tool.LEADERBOARD, label: 'Top Global', icon: <Trophy size={20} />, description: 'Peringkat Chat' },
  { id: Tool.STATS, label: 'Statistik', icon: <BarChart3 size={20} />, description: 'Data Real-time' },
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

export const BLOCKLIST = [
    // INDONESIA UMUM
    "anjing", "anjg", "ajg", "anj", "babi", "bangsat", "bgst", "bajingan", 
    "brengsek", "brgsk", "biadab", "goblok", "gblk", "tolol", "tll", "idiot", 
    "kampret", "keparat", "kunyuk", "monyet", "pantek", "perek", "setan", 
    4"sinting", "sontoloyo", "tai", "tahi", "geblek", "upil", "sompret", "bego", "dungu",
    "jancok", "jancuk", "cok", "coeg", "dancok", "jamput", "gateli", "matamu", "ndasmu", 
    "asu", "asw", "kirik", "pekok", "bagong", "anjir", "anying", "goblog", "sias", 
    "belegug", "koplok", "kehed", "ontohod", "seuneu", "pukimak", "puki", "kimak", 
    "telaso", "laso", "sundala", "bujanginam", "bodat", "pantek", 
    "kontol",