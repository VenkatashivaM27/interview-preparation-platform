import { useNavigate } from 'react-router-dom';

export default function TestExitBar({ title, timeLeft, onExit, exitLabel = 'Exit Test' }) {
  const navigate = useNavigate();

  const handleExit = () => {
    if (window.confirm('Leave this test? Your current progress may be lost.')) {
      if (onExit) onExit();
      navigate('/dashboard');
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-500">Active Session</p>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-rose-50 px-4 py-2 font-mono text-lg font-bold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          {mins}:{secs}
        </div>
        <button
          type="button"
          onClick={handleExit}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {exitLabel}
        </button>
      </div>
    </div>
  );
}
