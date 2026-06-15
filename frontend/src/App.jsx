import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import StudentOnlyRoute from './components/StudentOnlyRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SkillSelectionPage from './pages/SkillSelectionPage';
import ProgrammingTestPage from './pages/ProgrammingTestPage';
import MockInterviewPage from './pages/MockInterviewPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import FriendsChatPage from './pages/FriendsChatPage';
import GroupDiscussionPage from './pages/GroupDiscussionPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import QuestionManagementPage from './pages/admin/QuestionManagementPage';
import ReportsPage from './pages/admin/ReportsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/skills" element={<SkillSelectionPage />} />
        <Route path="/programming" element={<ProgrammingTestPage />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
        <Route path="/resume" element={<ResumeAnalyzerPage />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="/friends" element={<StudentOnlyRoute><FriendsChatPage /></StudentOnlyRoute>} />
        <Route path="/groups" element={<StudentOnlyRoute><GroupDiscussionPage /></StudentOnlyRoute>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
        <Route path="/admin/questions" element={<AdminRoute><QuestionManagementPage /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
