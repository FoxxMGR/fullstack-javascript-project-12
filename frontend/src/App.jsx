import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  LoginPage  from './pages/LoginPage';
import  ChatPage  from './pages/ChatPage';
import SignupPage from './pages/SignupPage';
import  NotFoundPage  from './pages/NotFoundPage';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;