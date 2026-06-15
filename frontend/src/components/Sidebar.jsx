import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icons } from './icons';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
  { to: '/skills', label: 'Skill Level', Icon: Icons.Skills },
  { to: '/programming', label: 'Coding Test', Icon: Icons.Code },
  { to: '/mock-interview', label: 'Mock Interview', Icon: Icons.Interview },
  { to: '/resume', label: 'Resume Analyzer', Icon: Icons.Resume },
  { to: '/analytics', label: 'Analytics', Icon: Icons.Analytics },
  { to: '/friends', label: 'Friends & Chat', Icon: Icons.Chat },
  { to: '/groups', label: 'Discussions', Icon: Icons.Groups },
  { to: '/profile', label: 'Profile', Icon: Icons.Profile },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', Icon: Icons.Admin },
  { to: '/admin/users', label: 'User Management', Icon: Icons.Users },
  { to: '/admin/questions', label: 'Skills & Questions', Icon: Icons.Questions },
  { to: '/admin/reports', label: 'Reports', Icon: Icons.Reports },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 p-4 text-slate-200 lg:flex">
      <div className="mb-8 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
          IP
        </div>
        <h1 className="mt-3 text-lg font-bold text-white">InterviewPrep</h1>
        <p className="text-xs text-slate-400">{isAdmin ? 'Admin Console' : 'Student Portal'}</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
