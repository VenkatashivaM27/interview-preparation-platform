import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { analyticsService } from '../services/analyticsService';

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnalytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  const progressData = data?.progressData || [];
  const categoryData = Object.entries(data?.scoreByCategory || {}).map(([name, score]) => ({
    name, score: Math.round(score),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Performance Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Total Tests</p><p className="text-3xl font-bold">{data?.totalTests ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Average Score</p><p className="text-3xl font-bold">{Math.round(data?.averageScore ?? 0)}%</p></div>
        <div className="card"><p className="text-sm text-slate-500">Strong Areas</p><p className="text-lg font-medium">{(data?.strongAreas || []).join(', ') || 'N/A'}</p></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold">Score Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="mb-4 font-semibold">Score by Difficulty</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold">Weak Areas to Improve</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {(data?.weakAreas || []).map((a) => (
            <span key={a} className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 dark:bg-red-900/30">{a}</span>
          ))}
          {!data?.weakAreas?.length && <p className="text-slate-500">Great job! No weak areas detected.</p>}
        </div>
      </div>
    </div>
  );
}
