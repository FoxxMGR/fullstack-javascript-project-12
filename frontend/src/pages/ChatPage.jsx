import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useGetChannelsQuery } from '../store/chatApi';
import { setCurrentChannel } from '../store/chatSlice';
import { chatSelectors } from '../store/chatSlice';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';
import ChannelModals from '../components/ChannelModals';

function ChatPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentChannelId = useSelector(chatSelectors.selectCurrentChannelId);

  const { data: channels = [], isLoading, isError, error, refetch } = useGetChannelsQuery();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (channels.length > 0 && !currentChannelId) {
      const defaultChannel = channels.find((ch) => ch.name === 'general');
      dispatch(setCurrentChannel(defaultChannel?.id || channels[0]?.id));
    }
  }, [channels, currentChannelId, dispatch]);

  if (!user) return null;

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>{t('chat.loading')}</p>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>{t('errors.loadError')}</Alert.Heading>
          <p>{error?.data?.message || t('errors.loadError')}</p>
          <button className="btn btn-primary" onClick={refetch}>{t('errors.retry')}</button>
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
