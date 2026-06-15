import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">InterviewPrep</span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">
          Master Your <span className="bg-gradient-brand bg-clip-text text-transparent">Interview Journey</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Practice coding, attend mock interviews, analyze resumes, track performance, and collaborate with peers — all in one enterprise platform.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register" className="btn-primary px-8 py-3 text-lg">Start Free</Link>
          <Link to="/login" className="btn-secondary px-8 py-3 text-lg">Sign In</Link>
        </div>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { title: 'Dynamic Coding Tests', desc: 'Questions tailored to your skill level with auto evaluation.' },
            { title: 'Mock Interviews', desc: 'Technical & HR questions with timed sessions.' },
            { title: 'Real-time Collaboration', desc: 'Chat, groups, friends, and placement prep together.' },
          ].map((f) => (
            <div key={f.title} className="card text-left">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
