"use client"
import CatAiChatInterface from "@/components/cat-ai-chat-interface";

export default function CatAIPage() {
  const handleOnClose = () => {
    window.location.href = '/';
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#050810' }}>
      <CatAiChatInterface
        isOpen={true}
        onClose={handleOnClose}
        isFullPageMode={true}
      />
    </div>
  );
}