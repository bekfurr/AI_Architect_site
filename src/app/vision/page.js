'use client';

import { useState, useRef } from 'react';
import { Upload, ImageIcon, Loader2, FileWarning } from 'lucide-react';
import './vision.css';

export default function VisionAnalyzer() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Iltimos, faqat rasm faylini yuklang (JPG, PNG).");
      return;
    }
    
    setError(null);
    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Iltimos, faqat rasm faylini yuklang.");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const formData = new FormData();
      formData.append('image', image);
      if (prompt) {
        formData.append('prompt', prompt);
      }

      const res = await fetch('/api/vision', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server xatosi');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vision-container animate-fade-in">
      <header className="page-header">
        <h1>Chizma Tahlili (Vision)</h1>
        <p>Eskiz, 3D render yoki chizmalaringizni yuklang, AI ularni tahlil qilib maslahat beradi.</p>
      </header>

      <div className="vision-content">
        <div className="upload-section glass">
          <div 
            className={`upload-area ${preview ? 'has-image' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden-input"
            />
            
            {preview ? (
              <div className="image-preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <div className="image-overlay">
                  <span>Boshqa rasm yuklash</span>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <Upload size={48} className="upload-icon" />
                <h3>Rasmni bu yerga tashlang</h3>
                <p>Yoki tanlash uchun bosing (JPG, PNG)</p>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="custom-prompt">Maxsus so'rov (ixtiyoriy)</label>
            <textarea
              id="custom-prompt"
              className="input-field"
              rows="3"
              placeholder="Masalan: Ushbu xona rejasida derazalarning joylashuvi qanchalik to'g'ri?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <button 
            className="btn-primary analyze-btn" 
            onClick={analyzeImage}
            disabled={loading || !image}
          >
            {loading ? <Loader2 className="spinner" size={20} /> : <ImageIcon size={20} />}
            <span>{loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}</span>
          </button>
          
          {error && (
            <div className="error-message">
              <FileWarning size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="analysis-section glass">
          <h3>Tahlil Natijasi</h3>
          
          <div className={`analysis-box ${!analysis && !loading ? 'empty' : ''}`}>
            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton-line"></div>
                <div className="skeleton-line w-80"></div>
                <div className="skeleton-line w-60"></div>
                <div className="skeleton-line" style={{marginTop: '1rem'}}></div>
                <div className="skeleton-line w-80"></div>
              </div>
            ) : analysis ? (
              <div className="markdown-content" style={{whiteSpace: 'pre-wrap'}}>
                {analysis}
              </div>
            ) : (
              <div className="empty-state-mini">
                <ImageIcon size={32} />
                <p>Natijani ko'rish uchun rasm yuklang va "Tahlil qilish" tugmasini bosing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
