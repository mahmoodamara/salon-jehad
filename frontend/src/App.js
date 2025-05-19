import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import ConfirmAppointmentPage from './pages/ConfirmAppointmentPage';

import './index.css';

function App() {
  console.log('API BASE:', process.env.REACT_APP_API_URL);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookAppointment />} />
        <Route path="/MyAppointments" element={<MyAppointments />} />
        <Route path="/confirm-appointment" element={<ConfirmAppointmentPage />} />

      </Routes>
    </Router>
    
  );
}

export default App;