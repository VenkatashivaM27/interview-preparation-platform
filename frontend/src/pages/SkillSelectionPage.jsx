import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const levels = [
  { value: 'BEGINNER', label: 'Beginner', desc: 'Fundamentals, basic syntax, simple problems' },
  { value: 'INTERMEDIATE', label: 'Intermediate', desc: 'Data structures, algorithms, OOP concepts' },
  { value: 'ADVANCED', label: 'Advanced', desc: 'Complex algorithms, system design, optimization' },
];

export default function SkillSelectionPage() {
  const { user, refreshUser } = useAuth();
  const [selected, setSelected] = useState(user?.skillLevel || 'BEGINNER');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({ skillLevel: selected });
      await refreshUser();
      toast.success('Skill level updated! Questions will be tailored accordingly.');
    } catch {
      toast.error('Failed to update skill level');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Select Your Programming Skill Level</h1>
      <p className="text-slate-500">Questions for coding tests and mock interviews are dynamically generated based on your level.</p>
      <div className="space-y-4">
        {levels.map((level) => (
          <button key={level.value} type="button" onClick={() => setSelected(level.value)}
            className={`card w-full text-left transition ${selected === level.value ? 'ring-2 ring-primary-500' : ''}`}>
            <h3 className="font-semibold">{level.label}</h3>
            <p className="mt-1 text-sm text-slate-500">{level.desc}</p>
          </button>
        ))}
      </div>
      <button type="button" onClick={save} className="btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Skill Level'}
      </button>
    </div>
  );
}
