import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { auth } from './config/firebase';
import { updateProfile, sendEmailVerification } from 'firebase/auth';
import Navbar from './components/navbar/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import {
  Income, Expenses, Investments, Savings, BudgetDocs, BudgetReports, BudgetPlanner, BudgetPlannerPage
} from './pages/budget/BudgetPages';
import ShoppingPlanner from './pages/shopping/ShoppingPlanner';
import HealthPage     from './pages/health/HealthPage';
import WaterPage      from './pages/health/WaterPage';
import SleepPage      from './pages/health/SleepPage';
import StepsPage      from './pages/health/StepsPage';
import WorkoutPage    from './pages/health/WorkoutPage';
import NutritionPage  from './pages/health/NutritionPage';
import CaloriesPage   from './pages/health/CaloriesPage';
import ChecklistPage  from './pages/health/ChecklistPage';
import ConditionsPage from './pages/health/ConditionsPage';
import MotivationPage    from './pages/motivation/MotivationPage';
import DocumentPage      from './pages/document/DocumentPage';
import TimeBalancerPage  from './pages/time/TimeBalancerPage';
import PromoTodo         from './pages/time/PromoTodo';
import TodoPage          from './pages/todo/TodoPage';
import CategoryDashboard      from './features/exams/CategoryDashboard';
import ExamDashboard          from './features/exams/ExamDashboard';
import StudyDashboard         from './features/study/StudyDashboard';
import MockTestDashboard      from './features/mock-test/MockTestDashboard';
import MockTestSetup          from './features/mock-test/MockTestSetup';
import MockTestExamScreen     from './features/mock-test/MockTestExamScreen';
import MockTestResultScreen   from './features/mock-test/MockTestResultScreen';
import MockTestAnalysisScreen from './features/mock-test/MockTestAnalysisScreen';
import MockTestResultsPage    from './pages/mocktest/MockTestResultsPage';
import MockTestAnalysisPage   from './pages/mocktest/MockTestAnalysisPage';
import NotificationCenterPage from './features/notifications/NotificationCenterPage';
import { NotificationProvider } from './features/notifications/context/NotificationContext';
import {
  GovtOpportunities, PrivateIT, CompanyInformation,
  CompanyWatchlist, RequiredSkills, InterviewPrep, CareerResources
} from './pages/career/CareerPages';
import SettingsLayout         from './features/settings/SettingsLayout';
import {
  AptitudeShortcuts, AptitudeRepeated, AptitudeConcepts,
  AptitudeFormula, AptitudePractice, AptitudeRank
} from './pages/study/AptitudePages';
import ProfileViewPage        from './features/profile/ProfileViewPage';
import ProfileEditPage        from './features/profile/ProfileEditPage';

function PublicApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signup, loginGoogle, resetPassword, logout } = useAuth();

  const page = location.pathname.replace('/', '') || 'home';

  const handleLogout = async () => { await logout(); navigate('/'); };

  const handleNavigate = (path) => {
    if (path === 'dashboard') navigate('/dashboard');
    else if (path === 'home') navigate('/');
    else if (path === 'profile') navigate('/dashboard/profile');
    else if (path === 'settings') navigate('/dashboard/settings');
    else navigate(`/${path}`);
  };

  const handleLogin = async (email, password) => {
    await login(email, password);
    await auth.currentUser.reload();
    if (!auth.currentUser.emailVerified) {
      await logout();
      throw Object.assign(new Error(), { code: 'auth/email-not-verified' });
    }
    navigate('/dashboard');
  };

  const handleSignup = async (fullName, email, password) => {
    const { user: newUser } = await signup(email, password);
    await updateProfile(newUser, { displayName: fullName });
    await sendEmailVerification(newUser);
    await logout();
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  };

  const handleGoogleLogin = async () => {
    const result = await loginGoogle();
    if (result.user) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={!!user}
        user={user}
        notificationCount={0}
        currentPage={page}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/"                  element={<HomePage isLoggedIn={!!user} onNavigate={handleNavigate} />} />
        <Route path="/login"             element={<LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />} />
        <Route path="/signup"            element={<SignupPage onSignup={handleSignup} onGoogleSignup={handleGoogleLogin} onResendVerification={handleResendVerification} onNavigate={handleNavigate} />} />
        <Route path="/forgot-password"   element={<ForgotPasswordPage onSendResetLink={resetPassword} onNavigate={handleNavigate} />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function DashboardApp() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <NotificationProvider>
    <DashboardLayout onLogout={handleLogout}>
      <Routes>
        <Route index                     element={<Overview />} />
        <Route path="budget"             element={<BudgetPlanner />} />
        <Route path="budget/planner"     element={<BudgetPlannerPage />} />
        <Route path="budget/income"      element={<Income />} />
        <Route path="budget/expenses"    element={<Expenses />} />
        <Route path="budget/investments" element={<Investments />} />
        <Route path="budget/savings"     element={<Savings />} />
        <Route path="budget/documents"   element={<BudgetDocs />} />
        <Route path="budget/reports"     element={<BudgetReports />} />
        <Route path="todo"                 element={<TodoPage />} />
        <Route path="todo/daily"            element={<TodoPage tab="Daily" />} />
        <Route path="todo/weekly"           element={<TodoPage tab="Weekly" />} />
        <Route path="todo/monthly"          element={<TodoPage tab="Monthly" />} />
        <Route path="todo/yearly"            element={<TodoPage tab="Yearly" />} />
        <Route path="shopping"             element={<ShoppingPlanner />} />
        <Route path="shopping/items"       element={<ShoppingPlanner />} />
        <Route path="shopping/weekly"      element={<ShoppingPlanner />} />
        <Route path="shopping/monthly"     element={<ShoppingPlanner />} />
        <Route path="shopping/yearly"      element={<ShoppingPlanner />} />
        <Route path="health"             element={<HealthPage />} />
        <Route path="health/water"       element={<WaterPage />} />
        <Route path="health/sleep"       element={<SleepPage />} />
        <Route path="health/steps"       element={<StepsPage />} />
        <Route path="health/workout"     element={<WorkoutPage />} />
        <Route path="health/nutrition"   element={<NutritionPage />} />
        <Route path="health/calories"    element={<CaloriesPage />} />
        <Route path="health/checklist"   element={<ChecklistPage />} />
        <Route path="health/conditions"  element={<ConditionsPage />} />
        <Route path="documents"                    element={<DocumentPage />} />
        <Route path="documents/original"            element={<DocumentPage cat="Original Documents" />} />
        <Route path="documents/worksheets"          element={<DocumentPage cat="Worksheets" />} />
        <Route path="documents/personal"            element={<DocumentPage cat="Personal Documents" />} />
        <Route path="documents/study"               element={<DocumentPage cat="Study Documents" />} />
        <Route path="documents/images"              element={<DocumentPage cat="Images" />} />
        <Route path="time"         element={<TimeBalancerPage />} />
        <Route path="time/daily"   element={<TimeBalancerPage tab="daily" />} />
        <Route path="time/weekly"  element={<TimeBalancerPage tab="weekly" />} />
        <Route path="time/monthly"   element={<TimeBalancerPage tab="monthly" />} />
        <Route path="time/promotodo" element={<PromoTodo />} />
        <Route path="motivation"                    element={<MotivationPage />} />
        <Route path="motivation/quotes"             element={<MotivationPage tab="quotes" />} />
        <Route path="motivation/images"             element={<MotivationPage tab="images" />} />
        <Route path="motivation/goals"              element={<MotivationPage tab="goals" />} />
        <Route path="motivation/vision-board"       element={<MotivationPage tab="board" />} />
        <Route path="study/*"                       element={<StudyDashboard />} />
        <Route path="mock-test"                              element={<MockTestDashboard />} />
        <Route path="mock-test/setup/:examId"               element={<MockTestSetup />} />
        <Route path="mock-test/exam/:attemptId"             element={<MockTestExamScreen />} />
        <Route path="mock-test/results"                     element={<MockTestResultsPage />} />
        <Route path="mock-test/result/:attemptId"           element={<MockTestResultScreen />} />
        <Route path="mock-test/analysis"                    element={<MockTestAnalysisPage />} />
        <Route path="mock-test/analysis/:attemptId"         element={<MockTestAnalysisScreen />} />
        <Route path="exams"                         element={<CategoryDashboard />} />
        <Route path="exams/:category"               element={<CategoryDashboard />} />
        <Route path="exams/:category/:examId"        element={<ExamDashboard />} />
        <Route path="career"                      element={<GovtOpportunities />} />
        <Route path="career/government"             element={<GovtOpportunities />} />
        <Route path="career/private-it"             element={<PrivateIT />} />
        <Route path="career/company-info"           element={<CompanyInformation />} />
        <Route path="career/watchlist"              element={<CompanyWatchlist />} />
        <Route path="career/skills"                 element={<RequiredSkills />} />
        <Route path="career/interview"              element={<InterviewPrep />} />
        <Route path="career/resources"              element={<CareerResources />} />
        <Route path="aptitude/shortcuts" element={<AptitudeShortcuts />} />
        <Route path="aptitude/repeated"  element={<AptitudeRepeated />} />
        <Route path="aptitude/concepts"  element={<AptitudeConcepts />} />
        <Route path="aptitude/formula"   element={<AptitudeFormula />} />
        <Route path="aptitude/practice"  element={<AptitudePractice />} />
        <Route path="aptitude/rank"      element={<AptitudeRank />} />
        <Route path="aptitude"           element={<AptitudeShortcuts />} />
        <Route path="notifications"  element={<NotificationCenterPage />} />
        <Route path="profile"         element={<ProfileViewPage />} />
        <Route path="profile/edit"    element={<ProfileEditPage />} />
        <Route path="settings/*"      element={<SettingsLayout />} />
        <Route path="*"                  element={<Overview />} />
      </Routes>
    </DashboardLayout>
    </NotificationProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (!user || !user.emailVerified) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<ProtectedRoute><DashboardApp /></ProtectedRoute>} />
      <Route path="/*"           element={<PublicApp />} />
    </Routes>
  );
}
