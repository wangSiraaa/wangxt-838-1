import { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { ToastContainer } from '../ui/Toast';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
