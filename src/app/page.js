import Link from 'next/link';
import { ArrowRight, ImageIcon, Sparkles, Mic } from 'lucide-react';
import './home.css';

export default function Home() {
  return (
    <div className="home-container animate-fade-in">
      <header className="home-header">
        <h1>Xush kelibsiz, Arxitektor!</h1>
        <p>Sun'iy intellekt yordamida loyihalaringizni keyingi bosqichga olib chiqing.</p>
      </header>

      <div className="features-grid">
        <Link href="/vision" className="feature-card glass">
          <div className="feature-icon bg-blue">
            <ImageIcon size={24} />
          </div>
          <h3>Chizma Tahlili</h3>
          <p>Eskiz va chizmalaringizni yuklang, AI ularni tahlil qilib, konstruktiv maslahatlar beradi.</p>
          <div className="feature-action">
            <span>Boshlash</span>
            <ArrowRight size={16} />
          </div>
        </Link>

        <Link href="/prompt" className="feature-card glass">
          <div className="feature-icon bg-purple">
            <Sparkles size={24} />
          </div>
          <h3>Konsept Yordamchisi</h3>
          <p>Oddiy g'oyalaringizni Midjourney yoki Stable Diffusion uchun professional promptlarga aylantiring.</p>
          <div className="feature-action">
            <span>Boshlash</span>
            <ArrowRight size={16} />
          </div>
        </Link>

        <Link href="/assistant" className="feature-card glass">
          <div className="feature-icon bg-green">
            <Mic size={24} />
          </div>
          <h3>Ovozli Yordamchi</h3>
          <p>Qo'llaringiz bandmi? Arxitektura normalari va qoidalari haqida ovozli tarzda savol bering.</p>
          <div className="feature-action">
            <span>Boshlash</span>
            <ArrowRight size={16} />
          </div>
        </Link>
      </div>

      <div className="recent-activity glass mt-8">
        <h3>So'nggi faolliklar</h3>
        <div className="empty-state">
          <p>Hozircha ma'lumot yo'q. Dastlabki tahlil yoki konseptingizni yarating!</p>
        </div>
      </div>
    </div>
  );
}
