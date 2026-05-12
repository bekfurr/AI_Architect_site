'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Ro'yxatdan o'tdingiz. Elektron pochtangizni tekshiring.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass">
        <div className="login-header">
          <h2>{isSignUp ? "Ro'yxatdan o'tish" : "Tizimga kirish"}</h2>
          <p>ArchAssist platformasidan to'liq foydalanish uchun tizimga kiring.</p>
        </div>

        <form onSubmit={handleAuth} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Parol</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {msg && <div className="success-message">{msg}</div>}

          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={18}/> : (isSignUp ? <UserPlus size={18}/> : <LogIn size={18}/>)}
            <span>{isSignUp ? "Ro'yxatdan o'tish" : "Kirish"}</span>
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isSignUp ? "Profilingiz bormi? " : "Profilingiz yo'qmi? "}
            <button className="text-accent" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Tizimga kiring" : "Ro'yxatdan o'ting"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
