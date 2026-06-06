import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { fetchChatData, addMessage, openModal } from '../store/chatSlice';
import { initSocket, closeSocket } from '../services/socket';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';
import ChannelModals from '../components/ChannelModals';
import { useRollbar } from '@rollbar/react';

function ChatPage() {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { loading, error } = useSelector((state) => state.chat);

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
      if (result.meta.requestStatus === 'rejected') {
        rollbar.error('Ошибка загрузки данных чата', { error: result.payload });
        toast.error(t('toasts.loadError'));
      } else if (result.meta.requestStatus === 'fulfilled') {
        try {
          const socket = initSocket(token);
          
          socket.on('connect', () => {
            console.log('WebSocket connected');
          });
          
          socket.on('newMessage', (message) => {
            dispatch(addMessage(message));
          });
          
          socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            toast.error(t('toasts.websocketError'), { toastId: 'websocket-error' });
          });

          socket.on('disconnect', (reason) => {
            if (reason !== 'io client disconnect') {
              toast.error(t('toasts.websocketError'), { toastId: 'websocket-error' });
            }
          });
        } catch (err) {
          console.error('Failed to initialize socket:', err);
          toast.error(t('toasts.websocketError'));
        }
      }
    });
    
    return () => {
      closeSocket();
    };
  }, [token, dispatch, navigate, rollbar, t]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>{t('chat.loading')}</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>{t('errors.loadError')}</Alert.Heading>
          <p>{error}</p>
          <Button onClick={() => dispatch(fetchChatData())}>{t('errors.retry')}</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col md={3} className="bg-light p-3" style={{ height: '100vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>{t('chat.channels')}</h5>
            <Button variant="outline-danger" size="sm" onClick={logout}>
              {t('header.logout')}
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
