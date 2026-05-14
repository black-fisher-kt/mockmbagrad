"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, History, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessage {
    id: string;
    title: string;
    lastMessagePreview: string;
    timestamp: string;
}

interface ChatHistoryProps {
  history: ChatMessage[];
  onSelectChat?: (id: string) => void;
  onClear: () => void;
}

export default function CatAIChatHistory({
  history,
  onSelectChat,
  onClear,
}: ChatHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <History className="h-4 w-4 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold">Chat History</h2>
          <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full">
            {history.length}
          </span>
                </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              title="Clear all history"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
        )}

          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
      </div>
    </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No chat history yet</p>
                <p className="text-sm">Start a conversation to see it here</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {history.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors flex items-center gap-3"
                    onClick={() => onSelectChat && onSelectChat(chat.id)}
                  >
                    <MessageSquare className="h-5 w-5 text-indigo-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm truncate">
                        {chat.title}
                      </p>
                      <p className="text-gray-300 text-xs truncate">
                        {chat.lastMessagePreview}
                      </p>
                    </div>
                    <span className="text-gray-400 text-xs flex-shrink-0">
                      {formatDate(chat.timestamp)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

