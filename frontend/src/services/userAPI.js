import axios from 'axios';
const API = process.env.REACT_APP_API_URL;

export const sendOTP = (phone) => axios.post(`${API}/verify/send`, { phone });
export const bookAppointment = (data) => axios.post(`${API}/appointments/book`, data);
export const getAppointmentsByPhone = (phone) => axios.get(`${API}/appointments/phone/${phone}`);
export const cancelAppointment = (id, data) => axios.post(`${API}/appointments/${id}/cancel`, data);
export const rescheduleAppointment = (id, data) => axios.post(`${API}/appointments/${id}/reschedule`, data);
