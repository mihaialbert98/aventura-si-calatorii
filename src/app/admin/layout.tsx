import { isAuthenticated } from '@/lib/auth';
import AdminShell from './AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = isAuthenticated();

  // Login page renders without AdminShell (unauthenticated users)
  // Protected pages render with AdminShell (middleware ensures auth)
  if (!authed) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
