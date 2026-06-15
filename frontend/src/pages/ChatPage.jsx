import { useEffect, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useGetChannelsQuery, chatApi } from '../store/chatApi';
import { setCurrentChannel } from '../store/chatSlice';
import { chatSelectors } from '../store/chatSlice';
import { getSocket, closeSocket } from '../services/socket';
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
  const currentChannelIdRef = useRef(currentChannelId);

  const { data: channels = [], isLoading, isError, error, refetch } = useGetChannelsQuery();

  useLayoutEffect(() => {
    currentChannelIdRef.current = currentChannelId;
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (channels.length > 0 && !currentChannelId) {
      const defaultChannel = channels.find((ch) => ch.name === 'general');
      dispatch(setCurrentChannel(defaultChannel?.id || channels[0]?.id));
    }
  }, [channels, currentChannelId, dispatch]);

  useEffect(() => {
    if (!user || isLoading) return;

    const socket = getSocket(user.token);

    const onNewMessage = (message) => {
      dispatch(chatApi.util.updateQueryData('getMessages', undefined, (draft) => {
        draft.push(message);
      }));
    };

    const onNewChannel = (channel) => {
      dispatch(chatApi.util.updateQueryData('getChannels', undefined, (draft) => {
        if (!draft.some((ch) => ch.id === channel.id)) {
          draft.push(channel);
        }
      }));
    };

    const onRenameChannel = (channel) => {
      dispatch(chatApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const idx = draft.findIndex((ch) => ch.id === channel.id);
        if (idx !== -1) draft[idx] = channel;
      }));
    };

    const onRemoveChannel = ({ id }) => {
      dispatch(chatApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const idx = draft.findIndex((ch) => ch.id === id);
        if (idx !== -1) draft.splice(idx, 1);
      }));
      dispatch(chatApi.util.updateQueryData('getMessages', undefined, (draft) => {
        for (let i = draft.length - 1; i >= 0; i--) {
          if (draft[i].channelId === id) draft.splice(i, 1);
        }
      }));
      if (currentChannelIdRef.current === id) {
        dispatch(setCurrentChannel(null));
      }
    };

    const onConnectError = () => {
      toast.error(t('toasts.websocketError'), { toastId: 'websocket-error' });
    };

    const onDisconnect = (reason) => {
      if (reason !== 'io client disconnect') {
        toast.error(t('toasts.websocketError'), { toastId: 'websocket-error' });
      }
    };

    socket.on('newMessage', onNewMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('renameChannel', onRenameChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('newMessage', onNewMessage);
      socket.off('newChannel', onNewChannel);
      socket.off('renameChannel', onRenameChannel);
      socket.off('removeChannel', onRemoveChannel);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onDisconnect);
      closeSocket();
    };
  }, [user, isLoading, dispatch, t]);

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
