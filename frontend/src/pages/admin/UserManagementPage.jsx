import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { adminService } from '../../services/adminService';

export default function UserManagementPage() {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getUsers(page, 10, search)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const toggleActive = async (id) => {
    await adminService.toggleUserActive(id);
    toast.success('User status updated');
    load();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminService.deleteUser(id);
    toast.success('User deleted');
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="flex gap-2">
        <input className="input-field max-w-xs" placeholder="Search users..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button type="button" className="btn-secondary" onClick={() => { setPage(0); load(); }}>Search</button>
      </div>
      {loading ? <LoadingSkeleton /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">Rank</th><th>User</th><th>Role</th><th>Email</th><th>Score</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content?.map((u) => {
                const isAdminUser = u.roles?.includes('ROLE_ADMIN');
                return (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3">
                    {isAdminUser ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span className="font-semibold text-indigo-600">{u.rank || '—'}</span>
                    )}
                  </td>
                  <td className="py-3">{u.fullName || u.username}</td>
                  <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${isAdminUser ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                      {isAdminUser ? 'Admin' : 'Student'}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.totalScore}</td>
                  <td>{u.active ? 'Active' : 'Inactive'}</td>
                  <td className="space-x-2">
                    <button type="button" className="text-primary-600 text-xs" onClick={() => toggleActive(u.id)}>Toggle</button>
                    <button type="button" className="text-red-600 text-xs" onClick={() => deleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn-secondary text-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
            <span className="py-2 text-sm">Page {page + 1} of {data.totalPages || 1}</span>
            <button type="button" className="btn-secondary text-sm" disabled={page >= data.totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
