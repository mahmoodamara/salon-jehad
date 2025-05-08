import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import OTPVerification from './pages/OTPVerification';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/reschedule/:id" element={<Reschedule />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
