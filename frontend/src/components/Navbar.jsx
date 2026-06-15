import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { notificationService } from '../services/notificationService';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isAdmin) return;
    notificationService.getUnreadCount()
      .then((data) => setUnread(data?.count || 0))
      .catch(() => {});
  }, [isAdmin]);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="lg:hidden">
        <span className="font-bold text-indigo-600">InterviewPrep</span>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        {!isAdmin && (
          <Link
            to="/friends"
            className="relative rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Alerts
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unread}
              </span>
            )}
          </Link>
        )}
        <ThemeToggle />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
            {isAdmin ? (
              <p className="text-xs text-indigo-500 font-medium">Administrator</p>
            ) : (
              <p className="text-xs text-slate-500">
                {user?.rank ? `Rank ${user.rank}` : 'Unranked'}
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold">
            {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
          </div>
          <button type="button" onClick={logout} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
