import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { userService } from '../services/userService';

const quickActions = [
  { to: '/programming', title: 'Coding Challenge', desc: 'Timed assessment with IDE', color: 'indigo' },
  { to: '/mock-interview', title: 'Mock Interview', desc: 'Technical & HR practice', color: 'violet' },
  { to: '/resume', title: 'Resume Scan', desc: 'PDF analysis & scoring', color: 'emerald' },
  { to: '/analytics', title: 'Progress Insights', desc: 'Charts & weak areas', color: 'amber' },
];

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  const rankDisplay = data?.rank ? `Rank ${data.rank}` : 'Unranked';

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-20 h-32 w-32 rounded-full bg-violet-400/20 blur-xl" />
        <div className="relative">
          <p className="text-sm font-medium text-indigo-100">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold">{user?.fullName || user?.username}</h1>
          <p className="mt-2 max-w-xl text-indigo-100">
            Your placement journey continues. Practice coding, mock interviews, and track growth in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">{rankDisplay}</span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
              Level {user?.skillLevel || 'BEGINNER'}
            </span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
              {data?.totalScore ?? 0} points
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Score" value={data?.totalScore ?? 0} accent="indigo" />
        <StatCard title="Leaderboard" value={rankDisplay} accent="violet" />
        <StatCard title="Coding Tests" value={data?.testsCompleted ?? 0} accent="emerald" />
        <StatCard title="Mock Interviews" value={data?.mockInterviewsCompleted ?? 0} accent="amber" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition group-hover:w-16" />
            <h3 className="font-semibold text-slate-900 dark:text-white">{action.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <ul className="mt-4 space-y-3">
            {(data?.recentActivity || []).map((a, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
                <span className="text-sm text-slate-600 dark:text-slate-300">{a.details}</span>
                <span className="text-sm font-semibold text-indigo-600">+{a.score} pts</span>
              </li>
            ))}
            {!data?.recentActivity?.length && (
              <p className="text-sm text-slate-500">No activity yet. Start your first coding test.</p>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-white">Top Performers</h3>
          <ul className="mt-4 space-y-2">
            {(data?.leaderboard || []).map((u) => (
              <li
                key={u.userId}
                className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 px-4 py-3 dark:from-slate-800/50 dark:to-indigo-950/30"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                    {u.rank}
                  </span>
                  <span className="font-medium">{u.fullName || u.username}</span>
                </div>
                <span className="font-semibold text-indigo-600">{u.totalScore} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
