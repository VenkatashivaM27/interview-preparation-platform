import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import StatCard from '../../components/StatCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { adminService } from '../../services/adminService';

const PIE_COLORS = ['#6366f1', '#94a3b8', '#10b981', '#f43f5e'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  const statusChart = stats?.studentStatusChart || [];
  const participationChart = stats?.studentParticipationChart || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Analytics</h1>
        <p className="text-slate-500">Student engagement and platform overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={stats?.totalStudents ?? 0} accent="indigo" />
        <StatCard title="Active Students" value={stats?.activeStudents ?? 0} accent="emerald" />
        <StatCard title="Inactive Students" value={stats?.inactiveStudents ?? 0} accent="rose" />
        <StatCard title="Online Now" value={stats?.onlineUsers ?? 0} accent="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-1 font-semibold">Active vs Inactive Students</h3>
          <p className="mb-4 text-sm text-slate-500">Account status among registered students</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statusChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusChart.map((entry, i) => (
                  <Cell key={entry.name} fill={i === 0 ? '#10b981' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-1 font-semibold">Participating vs Not Participating</h3>
          <p className="mb-4 text-sm text-slate-500">Students who completed tests, mocks, or activities</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={participationChart}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {participationChart.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Participating"
          value={stats?.participatingStudents ?? 0}
          subtitle="Completed at least one activity"
          accent="emerald"
        />
        <StatCard
          title="Not Participating"
          value={stats?.nonParticipatingStudents ?? 0}
          subtitle="No tests or mock interviews yet"
          accent="rose"
        />
        <StatCard title="Mock Interviews Done" value={stats?.totalMockInterviews ?? 0} accent="indigo" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-white">Student Rankings</h3>
        <p className="mt-1 text-sm text-slate-500">Leaderboard by score — students only (admins excluded)</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                <th className="pb-3 pr-4 font-medium text-slate-500">Rank</th>
                <th className="pb-3 pr-4 font-medium text-slate-500">Student</th>
                <th className="pb-3 pr-4 font-medium text-slate-500">Username</th>
                <th className="pb-3 pr-4 font-medium text-slate-500">Score</th>
                <th className="pb-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.studentLeaderboard || []).map((row) => (
                <tr key={row.userId} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 pr-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium">{row.fullName || '—'}</td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{row.username}</td>
                  <td className="py-3 pr-4 font-semibold text-indigo-600">{row.totalScore} pts</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${row.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-600'}`}>
                      {row.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {!stats?.studentLeaderboard?.length && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No student rankings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
