import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChatData, setCurrentChannel, clearError } from '../store/chatSlice';
import { useAuth } from '../hooks/useAuth';
import { Container, Row, Col, ListGroup, Alert, Button, Spinner } from 'react-bootstrap';

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  
  const { channels, messages, currentChannelId, loading, error } = useSelector(
    (state) => state.chat
  );

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchChatData());
  }, [token, dispatch, navigate]);

  // Фильтруем сообщения для текущего канала
  const currentMessages = messages.filter(
    (msg) => msg.channelId === currentChannelId
  );

  // Получаем имя текущего канала
  const currentChannel = channels.find((ch) => ch.id === currentChannelId);

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Загрузка данных чата...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
          <Button onClick={() => dispatch(fetchChatData())}>Повторить</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        {/* Список каналов слева */}
        <Col md={3} className="bg-light p-3" style={{ height: '100vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Каналы</h5>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
          <ListGroup>
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                action
                active={channel.id === currentChannelId}
                onClick={() => handleChannelSelect(channel.id)}
              >
                # {channel.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Область чата справа */}
        <Col md={9} className="p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <h4 className="mb-3">#{currentChannel?.name || 'Выберите канал'}</h4>
          
          {/* Сообщения */}
          <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            {currentMessages.length === 0 ? (
              <p className="text-muted">Нет сообщений в этом канале</p>
            ) : (
              currentMessages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <strong>{msg.username}:</strong> {msg.body}
                </div>
              ))
            )}
          </div>

          {/* Форма отправки сообщения (пока заглушка) */}
          <div className="mt-auto">
            <p className="text-muted small">Форма отправки сообщений будет здесь</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage;