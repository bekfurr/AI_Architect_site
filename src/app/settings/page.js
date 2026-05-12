'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Shield, Palette, Bell, Save, LogOut, Camera } from 'lucide-react';
import './settings.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('dark');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email);
        setFullName(session.user.user_metadata?.full_name || '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save delay
    setTimeout(() => setSaving(false), 800);
    
    // In a real app we'd update supabase metadata here:
    // await supabase.auth.updateUser({ data: { full_name: fullName } })
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const tabs = [
    { id: 'general', label: 'Umumiy sozlamalar', icon: User },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'appearance', label: "Tashqi ko'rinish", icon: Palette },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="settings-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="settings-container animate-fade-in">
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <Shield size={48} style={{ margin: '0 auto 1rem', color: 'var(--accent-color)' }} />
          <h2>Avtorizatsiyadan o'tilmagan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
            Sozlamalarni ko'rish va o'zgartirish uchun tizimga kiring.
          </p>
          <button onClick={() => window.location.href = '/login'} className="btn-primary">
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container animate-fade-in">
      <div className="settings-header">
        <h1>Sozlamalar</h1>
        <p>Shaxsiy profilingiz va tizim parametrlarini boshqaring</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar glass">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button className="settings-tab" style={{ color: 'var(--danger-color)' }} onClick={handleLogout}>
              <LogOut size={18} />
              <span>Chiqish</span>
            </button>
          </div>
        </aside>

        <main className="settings-content glass">
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <h2 className="settings-section-title">
                <User size={20} />
                Shaxsiy ma'lumotlar
              </h2>
              
              <div className="profile-avatar-section">
                <div className="avatar-circle">
                  {fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                </div>
                <div className="avatar-actions">
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    <Camera size={16} /> Rasm yuklash
                  </button>
                  <p>JPG, GIF yoki PNG. Maksimal hajm 2MB.</p>
                </div>
              </div>

              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Ism va familiya</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Masalan: Alisher Navoiy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Elektron pochta</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      value={email}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Kasb / Mutaxassislik</label>
                  <input type="text" className="input-field" placeholder="Masalan: Bosh arxitektor" />
                </div>
              </div>

              <div className="save-actions">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  <Save size={18} />
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h2 className="settings-section-title">
                <Shield size={20} />
                Xavfsizlik
              </h2>

              <div className="settings-form">
                <div className="form-group">
                  <label>Joriy parol</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Yangi parol</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label>Parolni tasdiqlang</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="save-actions">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  <Save size={18} />
                  {saving ? 'Saqlanmoqda...' : 'Parolni yangilash'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-fade-in">
              <h2 className="settings-section-title">
                <Palette size={20} />
                Tashqi ko'rinish
              </h2>

              <div className="form-group">
                <label>Mavzu (Theme)</label>
                <div className="theme-options">
                  <div 
                    className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="theme-preview light">
                      <div className="tp-sidebar"></div>
                      <div className="tp-main"></div>
                    </div>
                    <span>Yorug' mavzu</span>
                  </div>
                  
                  <div 
                    className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="theme-preview dark">
                      <div className="tp-sidebar"></div>
                      <div className="tp-main"></div>
                    </div>
                    <span>Tungi mavzu</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                  Eslatma: ArchAssist asosan tungi mavzu uchun optimallashtirilgan. Yorug' mavzu hozirda sinov rejimida.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h2 className="settings-section-title">
                <Bell size={20} />
                Bildirishnomalar
              </h2>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Elektron pochta xabarlari</h4>
                    <p>Yangiliklar, tahlil natijalari va maslahatlar pochtangizga yuborilsinmi?</p>
                  </div>
                  <div 
                    className={`toggle-switch ${emailNotif ? 'active' : ''}`}
                    onClick={() => setEmailNotif(!emailNotif)}
                  >
                    <div className="toggle-knob"></div>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Brauzer bildirishnomalari</h4>
                    <p>Jarayonlar yakunlanganda (masalan, render) brauzerdan xabar olish</p>
                  </div>
                  <div 
                    className={`toggle-switch ${pushNotif ? 'active' : ''}`}
                    onClick={() => setPushNotif(!pushNotif)}
                  >
                    <div className="toggle-knob"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
