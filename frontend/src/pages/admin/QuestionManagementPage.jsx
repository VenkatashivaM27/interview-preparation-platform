import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { PROGRAMMING_LANGUAGES, getStarterCode } from '../../utils/programmingLanguages';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const TYPES = ['TECHNICAL', 'HR'];
const DEFAULT_CODING_FORM = {
  title: '', description: '', difficulty: 'BEGINNER', language: 'Java',
  starterCode: getStarterCode({ title: '', language: 'Java' }, 'Java'),
  testCases: '[{"input":"2 3","output":"5"}]', skillTrackId: '',
};

export default function QuestionManagementPage() {
  const [tab, setTab] = useState('skills');
  const [skills, setSkills] = useState([]);
  const [codingQs, setCodingQs] = useState([]);
  const [mockQs, setMockQs] = useState([]);

  const [skillForm, setSkillForm] = useState({ name: '', description: '', level: 'BEGINNER', category: '' });
  const [codingForm, setCodingForm] = useState(DEFAULT_CODING_FORM);
  const [mockForm, setMockForm] = useState({
    question: '', type: 'TECHNICAL', difficulty: 'BEGINNER', sampleAnswer: '', skillTrackId: '',
  });

  const load = async () => {
    const [s, c, m] = await Promise.all([
      adminService.getSkills(),
      adminService.getProgrammingQuestions(),
      adminService.getInterviewQuestions(),
    ]);
    setSkills(s || []);
    setCodingQs(c?.content || c || []);
    setMockQs(m || []);
  };

  useEffect(() => { load(); }, []);

  const createSkill = async (e) => {
    e.preventDefault();
    try {
      await adminService.createSkill(skillForm);
      toast.success('Skill created');
      setSkillForm({ name: '', description: '', level: 'BEGINNER', category: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const createCoding = async (e) => {
    e.preventDefault();
    try {
      await adminService.createProgrammingQuestion({
        ...codingForm,
        skillTrackId: codingForm.skillTrackId ? Number(codingForm.skillTrackId) : null,
      });
      toast.success('Coding question added');
      load();
    } catch {
      toast.error('Failed to add question');
    }
  };

  const updateCodingLanguage = (language) => {
    setCodingForm((form) => ({
      ...form,
      language,
      starterCode: getStarterCode({ ...form, language }, language),
    }));
  };

  const createMock = async (e) => {
    e.preventDefault();
    try {
      await adminService.createInterviewQuestion({
        ...mockForm,
        skillTrackId: mockForm.skillTrackId ? Number(mockForm.skillTrackId) : null,
      });
      toast.success('Mock question added');
      load();
    } catch {
      toast.error('Failed to add question');
    }
  };

  const tabs = [
    { id: 'skills', label: 'Skill Tracks' },
    { id: 'coding', label: 'Coding Questions' },
    { id: 'mock', label: 'Mock Interview Questions' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Skills & Question Bank</h1>
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'skills' && (
        <>
          <form onSubmit={createSkill} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold">Add New Skill Track</h3>
            <input className="input-field" placeholder="Skill name (e.g. Java DSA)" value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
            <textarea className="input-field" placeholder="Description" value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} />
            <select className="input-field" value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <input className="input-field" placeholder="Category (e.g. Backend)" value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} />
            <button type="submit" className="btn-primary">Create Skill</button>
          </form>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold mb-4">Skill Tracks ({skills.length})</h3>
            <div className="space-y-2">
              {skills.map((s) => (
                <div key={s.id} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.level} {s.category && `• ${s.category}`}</p>
                  </div>
                  <button type="button" className="text-sm text-rose-600"
                    onClick={() => adminService.deleteSkill(s.id).then(load)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'coding' && (
        <>
          <form onSubmit={createCoding} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold">Add Coding Question</h3>
            <input className="input-field" placeholder="Title" value={codingForm.title}
              onChange={(e) => setCodingForm({ ...codingForm, title: e.target.value })} required />
            <textarea className="input-field" placeholder="Description" value={codingForm.description}
              onChange={(e) => setCodingForm({ ...codingForm, description: e.target.value })} required />
            <div className="grid gap-3 md:grid-cols-3">
              <select className="input-field" value={codingForm.difficulty}
                onChange={(e) => setCodingForm({ ...codingForm, difficulty: e.target.value })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <select className="input-field" value={codingForm.language}
                onChange={(e) => updateCodingLanguage(e.target.value)}>
                {PROGRAMMING_LANGUAGES.map((language) => (
                  <option key={language.id} value={language.id}>{language.label}</option>
                ))}
              </select>
              <select className="input-field" value={codingForm.skillTrackId}
                onChange={(e) => setCodingForm({ ...codingForm, skillTrackId: e.target.value })}>
                <option value="">Skill (optional)</option>
                {skills.filter((s) => s.active).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <textarea className="input-field font-mono text-sm" rows={6} value={codingForm.starterCode}
              onChange={(e) => setCodingForm({ ...codingForm, starterCode: e.target.value })} />
            <textarea className="input-field font-mono text-sm" placeholder='Test cases JSON'
              value={codingForm.testCases} onChange={(e) => setCodingForm({ ...codingForm, testCases: e.target.value })} />
            <button type="submit" className="btn-primary">Add Coding Question</button>
          </form>
          <div className="space-y-2">
            {codingQs.map((q) => (
              <div key={q.id} className="flex justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium">{q.title}</p>
                  <p className="text-xs text-slate-500">{q.difficulty} • {q.language} {q.skillTrack?.name && `• ${q.skillTrack.name}`}</p>
                </div>
                <button type="button" className="text-sm text-rose-600"
                  onClick={() => adminService.deleteProgrammingQuestion(q.id).then(load)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'mock' && (
        <>
          <form onSubmit={createMock} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold">Add Mock Interview Question</h3>
            <textarea className="input-field" placeholder="Question" value={mockForm.question}
              onChange={(e) => setMockForm({ ...mockForm, question: e.target.value })} required />
            <div className="grid gap-3 md:grid-cols-3">
              <select className="input-field" value={mockForm.type}
                onChange={(e) => setMockForm({ ...mockForm, type: e.target.value })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <select className="input-field" value={mockForm.difficulty}
                onChange={(e) => setMockForm({ ...mockForm, difficulty: e.target.value })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <select className="input-field" value={mockForm.skillTrackId}
                onChange={(e) => setMockForm({ ...mockForm, skillTrackId: e.target.value })}>
                <option value="">Skill (optional)</option>
                {skills.filter((s) => s.active).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <textarea className="input-field" placeholder="Sample answer" value={mockForm.sampleAnswer}
              onChange={(e) => setMockForm({ ...mockForm, sampleAnswer: e.target.value })} />
            <button type="submit" className="btn-primary">Add Mock Question</button>
          </form>
          <div className="space-y-2">
            {mockQs.map((q) => (
              <div key={q.id} className="flex justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <div>
                  <p className="font-medium line-clamp-2">{q.question}</p>
                  <p className="text-xs text-slate-500">{q.type} • {q.difficulty}</p>
                </div>
                <button type="button" className="text-sm text-rose-600 shrink-0"
                  onClick={() => adminService.deleteInterviewQuestion(q.id).then(load)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
