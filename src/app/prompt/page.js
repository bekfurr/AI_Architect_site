'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import './prompt.css';

export default function PromptGenerator() {
  const [idea, setIdea] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const generatePrompt = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    setError(null);
    setPrompt('');
    setCopied(false);

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server xatosi');
      }

      setPrompt(data.prompt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prompt-container animate-fade-in">
      <header className="page-header">
        <h1>Konsept Yordamchisi</h1>
        <p>G'oyangizni kiriting va AI uni Midjourney uchun ajoyib promptga aylantiradi.</p>
      </header>

      <div className="prompt-content">
        <div className="input-section glass">
          <label htmlFor="idea-input">Sizning g'oyangiz</label>
          <textarea
            id="idea-input"
            className="input-field"
            rows="5"
            placeholder="Masalan: Tog' yonbag'rida yog'och va oynadan qurilgan zamonaviy uy..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <button 
            className="btn-primary generate-btn" 
            onClick={generatePrompt}
            disabled={loading || !idea.trim()}
          >
            {loading ? <Loader2 className="spinner" size={20} /> : <Sparkles size={20} />}
            <span>{loading ? 'Yaratilmoqda...' : 'Prompt Yaratish'}</span>
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="result-section glass">
          <div className="result-header">
            <label>Natija (Ingliz tilida)</label>
            {prompt && (
              <button className="copy-btn" onClick={copyToClipboard} title="Nusxalash">
                {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                <span>{copied ? 'Nusxalandi' : 'Nusxa olish'}</span>
              </button>
            )}
          </div>
          
          <div className={`result-box ${!prompt && !loading ? 'empty' : ''}`}>
            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton-line"></div>
                <div className="skeleton-line w-80"></div>
                <div className="skeleton-line w-60"></div>
              </div>
            ) : prompt ? (
              <p>{prompt}</p>
            ) : (
              <span className="empty-text">Natija bu yerda ko'rinadi...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
