import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'ArchAssist - Arxitektorlar uchun Sun\'iy Intellekt',
  description: 'Arxitektorlar uchun mo\'ljallangan chizma tahlilchisi va AI yordamchisi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
