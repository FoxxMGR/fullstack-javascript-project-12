import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { fetchChatData, setCurrentChannel, addMessage, openModal } from '../store/chatSlice';
import { initSocket, closeSocket } from '../services/socket';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';
import ChannelModals from '../components/ChannelModals';

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { loading, error, currentChannelId } = useSelector((state) => state.chat);

  // Слушаем события из меню
  useEffect(() => {
    const handleOpenModal = (e) => {
      dispatch(openModal(e.detail));
    };
    window.addEventListener('openModal', handleOpenModal);
    return () => window.removeEventListener('openModal', handleOpenModal);
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchChatData()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        const socket = initSocket(token);
        socket.on('newMessage', (message) => {
          dispatch(addMessage(message));
        });
      }
    });
    
    return () => closeSocket();
  }, [token, dispatch, navigate]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Загрузка...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Ошибка</Alert.Heading>
          <p>{error}</p>
          <Button onClick={() => dispatch(fetchChatData())}>Повторить</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col md={3} className="bg-light p-3" style={{ height: '100vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Каналы</h5>
            <Button variant="outline-danger" size="sm" onClick={logout}>
              Выйти
            </Button>
          </div>
          <ChannelsList />
        </Col>
        <Col md={9} className="p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <MessagesList />
          <MessageForm />
        </Col>
      </Row>
      <ChannelModals />
    </Container>
  );
}

export default ChatPage;