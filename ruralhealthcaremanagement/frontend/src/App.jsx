import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import DoctorManagement from './pages/DoctorManagement';
import VillageAnalytics from './pages/VillageAnalytics';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/add" element={<AddPatient />} />
          <Route path="patients/edit/:id" element={<EditPatient />} />
          <Route path="billing" element={<Billing />} />
          <Route path="reports" element={<Reports />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="villages" element={<VillageAnalytics />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
