import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  const load = () => adminService.getReports().then(setReports);
  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    const notes = prompt('Admin notes:');
    if (!notes) return;
    await adminService.resolveReport(id, notes);
    toast.success('Report resolved');
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Chat Moderation & Reports</h1>
      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="card">
            <p className="text-sm text-slate-500">Reported by: {r.reporter?.username}</p>
            <p className="mt-2 font-medium">Reason: {r.reason}</p>
            <p className="text-sm text-slate-600">Message: {r.message?.content}</p>
            <button type="button" className="btn-primary mt-3 text-sm" onClick={() => resolve(r.id)}>Resolve</button>
          </div>
        ))}
        {!reports.length && <p className="text-slate-500">No pending reports.</p>}
      </div>
    </div>
  );
}
