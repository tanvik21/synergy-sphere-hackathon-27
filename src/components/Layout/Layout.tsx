import { Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAppStore } from '@/store/useAppStore';

export function Layout() {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}