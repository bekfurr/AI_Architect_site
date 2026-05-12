'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, Sparkles, Mic, Settings, LogOut, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import './Sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Bosh sahifa', href: '/', icon: LayoutDashboard },
    { name: 'Chizma tahlili', href: '/vision', icon: ImageIcon },
    { name: 'Konsept yordamchisi', href: '/prompt', icon: Sparkles },
    { name: 'Ovozli yordamchi', href: '/assistant', icon: Mic },
  ];

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>ArchAssist</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/settings" className="nav-item">
          <Settings size={20} />
          <span>Sozlamalar</span>
        </Link>
        
        {user ? (
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        ) : (
          <Link href="/login" className="nav-item login-btn-sidebar">
            <LogIn size={20} />
            <span>Tizimga kirish</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
