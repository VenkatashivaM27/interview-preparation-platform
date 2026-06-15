import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CodeEditor from '../components/CodeEditor';
import TestExitBar from '../components/TestExitBar';
import { programmingService } from '../services/programmingService';
import { DEFAULT_LANGUAGE, PROGRAMMING_LANGUAGES, getStarterCode, normalizeLanguage } from '../utils/programmingLanguages';

export default function ProgrammingTestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inTest, setInTest] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [timeLeft, setTimeLeft] = useState(300);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  const level = user?.skillLevel || 'BEGINNER';

  const startTest = async () => {
    setLoading(true);
    try {
      const qs = await programmingService.getQuestions(level);
      if (!qs?.length) {
        toast.error('No questions for your skill level');
        return;
      }
      setQuestions(qs);
      setCurrent(0);
      setSelectedLanguage(DEFAULT_LANGUAGE);
      setCode(getStarterCode(qs[0], DEFAULT_LANGUAGE));
      setTimeLeft(qs[0]?.timeLimitSeconds || 300);
      setEvaluation(null);
      setInTest(true);
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!questions[current]) return;
    setSubmitting(true);
    try {
      const result = await programmingService.submitCode({
        questionId: questions[current].id,
        code,
        language: selectedLanguage,
        timeTakenSeconds: (questions[current].timeLimitSeconds || 300) - timeLeft,
      });
      setEvaluation(result);
      toast.success(`Score: ${result.score}%`);
    } catch {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [questions, current, code, selectedLanguage, timeLeft]);

  useEffect(() => {
    if (!inTest || evaluation) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [inTest, current, evaluation, handleSubmit]);

  const nextQuestion = () => {
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setCode(getStarterCode(questions[next], selectedLanguage));
      setTimeLeft(questions[next].timeLimitSeconds || 300);
      setEvaluation(null);
    } else {
      toast.success('All questions completed!');
      setInTest(false);
      navigate('/dashboard');
    }
  };

  const exitTest = () => {
    clearInterval(timerRef.current);
    setInTest(false);
  };

  if (!inTest) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-3xl font-bold">Programming Assessment</h1>
          <p className="mt-3 text-slate-500">
            Multi-language IDE with content assist, timed challenges, and real test-case execution for {level} level.
          </p>
          <button type="button" onClick={startTest} className="btn-primary mt-8 px-10 py-3" disabled={loading}>
            {loading ? 'Loading...' : 'Start Coding Test'}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return <LoadingSkeleton rows={4} />;

  const changeLanguage = (language) => {
    const nextLanguage = normalizeLanguage(language);
    setSelectedLanguage(nextLanguage);
    setCode(getStarterCode(q, nextLanguage));
    setEvaluation(null);
  };

  return (
    <div className="space-y-4">
      <TestExitBar
        title={`Coding Test — Q${current + 1}/${questions.length}`}
        timeLeft={timeLeft}
        onExit={exitTest}
        exitLabel="Exit Test"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              {q.difficulty}
            </span>
            {q.skillTrack?.name && (
              <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40">
                {q.skillTrack.name}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs dark:bg-slate-800">{selectedLanguage}</span>
          </div>
          <h2 className="mt-4 text-xl font-bold">{q.title}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">{q.description}</p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor="programming-language">
              Language
            </label>
            <select
              id="programming-language"
              className="input-field max-w-xs"
              value={selectedLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              disabled={submitting}
            >
              {PROGRAMMING_LANGUAGES.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
          <CodeEditor value={code} onChange={setCode} language={selectedLanguage} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleSubmit} className="btn-primary" disabled={submitting}>
              {submitting ? 'Evaluating...' : 'Run & Submit'}
            </button>
            {evaluation && (
              <button type="button" onClick={nextQuestion} className="btn-secondary">
                {current < questions.length - 1 ? 'Next Question' : 'Finish Test'}
              </button>
            )}
            <button type="button" onClick={exitTest} className="btn-secondary ml-auto">
              Exit Test
            </button>
          </div>
          {evaluation && (
            <div className={`rounded-xl p-4 ${evaluation.passed ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
              <p className="font-semibold">Score: {evaluation.score}%</p>
              {evaluation.message && <p className="mt-1 text-sm">{evaluation.message}</p>}
              <p className="text-sm">Passed {evaluation.passedTests}/{evaluation.totalTests} test cases</p>
              <ul className="mt-2 space-y-1 text-sm">
                {evaluation.results?.map((r) => (
                  <li key={r.index} className={r.passed ? 'text-emerald-700' : 'text-rose-600'}>
                    Test {r.index}: {r.passed ? 'Passed' : `Failed (expected ${r.expected}, got ${r.actual || 'no output'})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
