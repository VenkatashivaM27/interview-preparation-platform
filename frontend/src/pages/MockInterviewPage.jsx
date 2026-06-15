import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import TestExitBar from '../components/TestExitBar';
import { interviewService } from '../services/interviewService';

export default function MockInterviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef(null);

  const startInterview = async () => {
    try {
      const data = await interviewService.startMock(user?.skillLevel);
      setSession(data);
      setTimeLeft(data.timeLimitSeconds || 1800);
      setCurrentQ(0);
      setAnswers({});
      setCompleted(false);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
      }, 1000);
    } catch {
      toast.error('Failed to start mock interview');
    }
  };

  const exitInterview = () => {
    clearInterval(timerRef.current);
    setSession(null);
    setCompleted(false);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const finishInterview = async () => {
    const score = Math.round((Object.keys(answers).length / (session?.questions?.length || 1)) * 100);
    try {
      await interviewService.completeMock(session.mockTestId, score, (session.timeLimitSeconds || 1800) - timeLeft);
      clearInterval(timerRef.current);
      setCompleted(true);
      toast.success(`Interview completed! Score: ${score}%`);
    } catch {
      toast.error('Failed to save results');
    }
  };

  if (completed) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold">Mock Interview Complete</h2>
        <p className="mt-2 text-slate-500">Your session has been saved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={startInterview} className="btn-primary">Start Another</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-3xl font-bold">Mock Interview</h1>
          <p className="mt-3 text-slate-500">
            Technical and HR questions for {user?.skillLevel || 'BEGINNER'} level with timed session.
          </p>
          <button type="button" onClick={startInterview} className="btn-primary mt-8 px-10 py-3">
            Start Mock Interview
          </button>
        </div>
      </div>
    );
  }

  const q = session.questions[currentQ];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <TestExitBar
        title={`Mock Interview — Q${currentQ + 1}/${session.questions.length}`}
        timeLeft={timeLeft}
        onExit={exitInterview}
        exitLabel="Exit Interview"
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700">{q.type}</span>
          <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-medium text-violet-700">{q.difficulty}</span>
        </div>
        <h2 className="mt-4 text-lg font-semibold leading-relaxed">{q.question}</h2>
        <textarea
          className="input-field mt-6 h-48 resize-none font-sans"
          placeholder="Type your answer here..."
          value={answers[q.id] || ''}
          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
        />
        {q.sampleAnswer && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-indigo-600">View sample answer</summary>
            <p className="mt-2 text-sm text-slate-500">{q.sampleAnswer}</p>
          </details>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {currentQ > 0 && (
            <button type="button" className="btn-secondary" onClick={() => setCurrentQ(currentQ - 1)}>Previous</button>
          )}
          {currentQ < session.questions.length - 1 ? (
            <button type="button" className="btn-primary" onClick={() => setCurrentQ(currentQ + 1)}>Next</button>
          ) : (
            <button type="button" className="btn-primary" onClick={finishInterview}>Finish Interview</button>
          )}
          <button type="button" className="btn-secondary ml-auto" onClick={exitInterview}>Exit Interview</button>
        </div>
      </div>
    </div>
  );
}
