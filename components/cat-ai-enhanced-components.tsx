"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Share, Star, Download, Sun, Moon, MessageSquare, History, Trash2 } from 'lucide-react';

// Premium Toast Notification Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md
        ${type === 'success' 
          ? 'bg-[#064e3b]/90 border-l-4 border-emerald-500 text-emerald-100' 
          : type === 'error' 
            ? 'bg-[#7f1d1d]/90 border-l-4 border-red-500 text-red-100' 
            : 'bg-[#1e3a8a]/90 border-l-4 border-blue-500 text-blue-100'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {type === 'success' && <div className="w-2 h-2 bg-emerald-400 rounded-full" />}
        {type === 'error' && <div className="w-2 h-2 bg-red-400 rounded-full" />}
        {type === 'info' && <div className="w-2 h-2 bg-blue-400 rounded-full" />}
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
          <span className="text-lg font-bold">&times;</span>
        </button>
      </div>
    </motion.div>
  );
};

// Premium Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 p-6">
      <div className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-[#F59E0B] animate-pulse" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded w-full animate-pulse" />
        <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded w-4/6 animate-pulse" />
      </div>
    </div>
  );
};

// Premium Response Actions Component
interface ResponseActionsProps {
  text: string;
  onCopy: (text: string) => void;
  onShare: () => void;
  onFavorite: () => void;
}

const ResponseActions: React.FC<ResponseActionsProps> = ({ text, onCopy, onShare, onFavorite }) => {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => onCopy(text)} 
        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white transition-colors"
        title="Copy"
      >
        <Copy className="w-4 h-4" />
      </button>
      <button 
        onClick={onShare} 
        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-gray-400 hover:text-white transition-colors"
        title="Share"
      >
        <Share className="w-4 h-4" />
      </button>
      <button 
        onClick={onFavorite} 
        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] text-gray-400 hover:text-yellow-400 transition-colors"
        title="Save to Favorites"
      >
        <Star className="w-4 h-4" />
      </button>
    </div>
  );
};

// Premium Theme Toggle Component
interface ThemeToggleProps {
  currentTheme: 'dark' | 'light';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-300"
      title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {currentTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-[#F59E0B]" />
      ) : (
        <Moon className="w-5 h-5 text-[#60A5FA]" />
      )}
    </button>
  );
};

// Premium Export Modal Component
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-[#0f172a] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />
        
        <h3 className="text-2xl font-bold text-white mb-4">Export Chat History</h3>
        <p className="text-gray-300 mb-8">
          Download your conversation history as a well-formatted markdown file for future reference.
        </p>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.3)]">
            <div className="w-2 h-2 bg-[#60A5FA] rounded-full" />
            <span className="text-sm font-medium text-gray-300">Markdown Format (.md)</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
            <div className="w-2 h-2 bg-[#10B981] rounded-full" />
            <span className="text-sm font-medium text-gray-300">Copy to Clipboard (JSON)</span>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300"
          >
            Cancel
          </button>
          <button 
            onClick={onExport}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1342a3] to-[#1e40af] text-white font-medium shadow-lg shadow-[#1e40af]/30 hover:shadow-[#1e40af]/50 hover:scale-[1.02] transition-all duration-300"
          >
            Export History
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Premium Feature Badge Component
export const PremiumBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg shadow-amber-500/20 ${className}`}>
    {children}
  </span>
);

// Premium Button Component with glow effects
interface PremiumButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '' 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#1D4ED8] to-[#1e40af] hover:from-[#2563eb] hover:to-[#1d3690] text-white shadow-lg shadow-[#1D4ED8]/30 hover:shadow-[#2563eb]/50',
    secondary: 'bg-gradient-to-r from-[#064e3b] to-[#065f46] hover:from-[#0f766e] hover:to-[#115e59] text-white shadow-lg shadow-[#064e3b]/30 hover:shadow-[#0f766e]/50',
    ghost: 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-gray-300 hover:text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${variants[variant]} px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Premium Card Component for topic selectors
export const PremiumCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <motion.div
    whileHover={{ scale: 1.01, y: -2 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded-xl p-6 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default {
  Toast,
  LoadingSkeleton,
  ResponseActions,
  ThemeToggle,
  ExportModal,
  PremiumBadge,
  PremiumButton,
  PremiumCard
};