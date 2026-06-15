import { useState } from 'react';
import toast from 'react-hot-toast';
import { resumeService } from '../services/resumeService';

export default function ResumeAnalyzerPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await resumeService.analyze(file);
      setResult(data);
      toast.success('Resume analyzed successfully!');
    } catch {
      toast.error('Failed to analyze resume. Upload a PDF file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Resume Analyzer</h1>
      <div className="card border-dashed border-2 border-primary-300 text-center">
        <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" id="resume-upload" />
        <label htmlFor="resume-upload" className="cursor-pointer">
          <p className="text-4xl">📄</p>
          <p className="mt-2 font-medium">{loading ? 'Analyzing...' : 'Upload PDF Resume'}</p>
          <p className="text-sm text-slate-500">Max 10MB</p>
        </label>
      </div>
      {result && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Resume Score</h3>
              <span className="text-3xl font-bold text-primary-600">{result.score}/100</span>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-3 rounded-full bg-gradient-brand" style={{ width: `${result.score}%` }} />
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold">Analysis Summary</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{result.analysisSummary}</p>
          </div>
          <div className="card">
            <h3 className="font-semibold">Detected Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(result.extractedSkills || '').split(',').filter(Boolean).map((s) => (
                <span key={s} className="rounded-full bg-primary-100 px-3 py-1 text-sm dark:bg-primary-900/40">{s.trim()}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold">Suggestions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
              {(result.suggestions || '').split('\n').map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
