export default function StatCard({ title, value, subtitle, accent = 'indigo' }) {
  const accents = {
    indigo: 'from-indigo-500/20 to-violet-500/20 ring-indigo-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 ring-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 ring-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/20 ring-rose-500/30',
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br p-[1px] ring-1 ${accents[accent] || accents.indigo}`}>
      <div className="rounded-2xl bg-white p-5 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}
