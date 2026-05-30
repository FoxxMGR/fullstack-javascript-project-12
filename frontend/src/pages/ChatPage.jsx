import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChannels, setCurrentChannel, setLoading } from '../store/slices/channelsSlice';
import { setMessages } from '../store/slices/messagesSlice';
import { channelsAPI, messagesAPI } from '../services/api';
import ChannelsList from '../components/ChannelsList';
import MessagesList from '../components/MessagesList';
import MessageForm from '../components/MessageForm';

function ChatPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { currentChannelId } = useSelector((state) => state.channels);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [channelsResponse, messagesResponse] = await Promise.all([
          channelsAPI.getAll(),
          messagesAPI.getAll(),
        ]);

        dispatch(setChannels(channelsResponse.data));
        dispatch(setMessages(messagesResponse.data));

        // Устанавливаем первый канал как текущий, если ещё не выбран
        if (!currentChannelId && channelsResponse.data.length > 0) {
          dispatch(setCurrentChannel(channelsResponse.data[0].id));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [token, isAuthenticated, navigate, dispatch]);

  if (!token || !isAuthenticated) {
    return null; // Редирект произойдёт в useEffect
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <ChannelsList />
        <div className="col-9 d-flex flex-column vh-100">
          <MessagesList />
          <MessageForm />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;