import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Container, Button, Alert } from 'react-bootstrap';

function ChatPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем наличие токена при загрузке страницы
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Если нет токена, показываем загрузку (чтобы избежать моргания)
  if (!token) {
    return <Container className="mt-5"><p>Перенаправление на страницу входа...</p></Container>;
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Чат</h1>
        <Button variant="outline-danger" onClick={logout}>
          Выйти
        </Button>
      </div>
      <Alert variant="info">
        Здесь будет чат (реализуется позже)
      </Alert>
      <p>Вы успешно авторизованы!</p>
    </Container>
  );
}

export default ChatPage;