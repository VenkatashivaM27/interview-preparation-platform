import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    interests: user?.interests || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(form);
      await refreshUser();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await userService.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await userService.uploadAvatar(file);
      await refreshUser();
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      <div className="card flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand text-2xl text-white font-bold">
          {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
        </div>
        <div>
          <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" id="avatar" />
          <label htmlFor="avatar" className="btn-secondary cursor-pointer text-sm">Change Photo</label>
        </div>
      </div>
      <form onSubmit={saveProfile} className="card space-y-4">
        <h3 className="font-semibold">Personal Info</h3>
        {['fullName', 'bio', 'skills', 'interests'].map((field) => (
          <div key={field}>
            <label className="text-sm text-slate-500 capitalize">{field}</label>
            {field === 'bio' ? (
              <textarea className="input-field mt-1" rows={3} value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            ) : (
              <input className="input-field mt-1" value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            )}
          </div>
        ))}
        <button type="submit" className="btn-primary">Save Profile</button>
      </form>
      <form onSubmit={changePassword} className="card space-y-4">
        <h3 className="font-semibold">Change Password</h3>
        <input className="input-field" type="password" placeholder="Current password"
          value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
        <input className="input-field" type="password" placeholder="New password"
          value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
        <button type="submit" className="btn-secondary">Update Password</button>
      </form>
    </div>
  );
}
