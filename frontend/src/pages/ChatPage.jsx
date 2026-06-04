import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Alert, Button, Spinner, Form } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { fetchChatData, sendMessage, setCurrentChannel, addMessage, setSocketConnected } from '../store/chatSlice';
import { initSocket, closeSocket, getSocket } from '../services/socket';

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  
  const { channels, messages, currentChannelId, loading, sendingMessage, error } = useSelector(
    (state) => state.chat
  );

  // Загружаем данные и подключаем WebSocket
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Загружаем данные чата
    dispatch(fetchChatData()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // Подключаем WebSocket после успешной загрузки данных
        try {
          const socket = initSocket(token);
          
          socket.on('connect', () => {
            console.log('WebSocket connected');
            dispatch(setSocketConnected(true));
          });
          
          socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
            dispatch(setSocketConnected(false));
          });
          
          socket.on('newMessage', (message) => {
            console.log('New message via WebSocket:', message);
            if (message.channelId === null || message.channelId === undefined) {
    message.channelId = currentChannelId;
  }
            dispatch(addMessage(message));
          });
          
          socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            dispatch(setSocketConnected(false));
          });
        } catch (err) {
          console.error('Failed to initialize socket:', err);
        }
      }
    });
    
    // Cleanup: закрываем сокет при размонтировании
    return () => {
      closeSocket();
    };
  }, [token, dispatch, navigate]);

  // Фильтруем сообщения для текущего канала
  const currentMessages = messages.filter((msg) => msg.channelId === currentChannelId);
  
  // Находим текущий канал
  const currentChannel = channels.find((ch) => ch.id === currentChannelId);

  // Отправка сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;
    
    try {
      await dispatch(sendMessage({ channelId: currentChannelId, body: newMessage.trim() })).unwrap();
      setNewMessage(''); // Очищаем поле только после успешной отправки
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleLogout = () => {
    closeSocket();
    logout();
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
          <h4 className="mb-3"># {currentChannel?.name || 'Выберите канал'}</h4>
          
          {/* Сообщения */}
          <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {currentMessages.length === 0 ? (
              <p className="text-muted">Нет сообщений в этом канале. Будьте первым!</p>
            ) : (
              currentMessages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <strong>{msg.username}:</strong> {msg.body}
                  <small className="text-muted ms-2">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
          </div>

          {/* Форма отправки сообщения */}
          <Form onSubmit={handleSendMessage}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sendingMessage}
              />
              <Button type="submit" variant="primary" disabled={sendingMessage || !newMessage.trim()}>
                {sendingMessage ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatPage;