import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  LoginPage  from './pages/LoginPage';
import  ChatPage  from './pages/ChatPage';
import  NotFoundPage  from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;