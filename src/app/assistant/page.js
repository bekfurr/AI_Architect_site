'use client';

import { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import './assistant.css';

export default function AssistantPage() {
  const { connected, isRecording, volume, connect, disconnect, setOnTextReceived } = useLiveAPI();
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Salom, men ArchAssist ovozli yordamchisiman. Sizga qanday yordam bera olaman?' }]);
  const [connecting, setConnecting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setOnTextReceived((text) => {
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          return [...prev.slice(0, -1), { ...lastMsg, text: lastMsg.text + text }];
        }
        return [...prev, { role: 'assistant', text }];
      });
    });
  }, [setOnTextReceived]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConnect = async () => {
    setConnecting(true);
    await connect();
    setConnecting(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setMessages([{ role: 'assistant', text: 'Aloqa uzildi. Yana suhbatlashish uchun ulaning.' }]);
  };

  // Visualizer scale based on volume
  const scale = 1 + Math.min(volume * 5, 0.5);

  return (
    <div className="assistant-container animate-fade-in">
      <header className="page-header">
        <h1>Ovozli Yordamchi</h1>
        <p>Qo'llaringiz bandmi? Arxitektura bo'yicha savollaringizni to'g'ridan-to'g'ri bering.</p>
      </header>

      <div className="assistant-content">
        <div className="chat-section glass">
          <div className="messages-list">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.role}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="control-section glass">
          <div className="visualizer-container">
            <div 
              className={`mic-visualizer ${isRecording ? 'active' : ''}`}
              style={{ transform: `scale(${isRecording ? scale : 1})` }}
            >
              {connected ? (
                <Mic size={48} className="mic-icon" />
              ) : (
                <MicOff size={48} className="mic-icon muted" />
              )}
            </div>
            {isRecording && (
              <div className="ripple-waves">
                <div className="wave w1"></div>
                <div className="wave w2"></div>
                <div className="wave w3"></div>
              </div>
            )}
          </div>

          <div className="status-text">
            {connecting ? (
              <span className="flex-center gap-2"><Loader2 className="spinner" size={18}/> Ulanmoqda...</span>
            ) : connected ? (
              <span className="text-success">Tizim eshitmoqda...</span>
            ) : (
              <span>Ulanmagan</span>
            )}
          </div>

          {connected ? (
            <button className="btn-danger connect-btn" onClick={handleDisconnect}>
              Suhbatni tugatish
            </button>
          ) : (
            <button className="btn-primary connect-btn" onClick={handleConnect} disabled={connecting}>
              Suhbatni boshlash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
