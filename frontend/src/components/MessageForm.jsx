import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { sendMessage } from '../store/chatSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { filterProfanity, containsProfanity } from '../services/profanityFilter';

function MessageForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { username } = useAuth();
  const { currentChannelId, sendingMessage } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;
    
    const body = message.trim();
    const filteredMessage = filterProfanity(body);

    if (containsProfanity(body)) {
      toast.warning(t('errors.profanity'));
    }

    try {
      await dispatch(sendMessage({
        channelId: currentChannelId,
        body: containsProfanity(body) ? filteredMessage : body,
        username,
      })).unwrap();
      setMessage('');
    } catch {
      // Сообщение об ошибке уже показывает sendMessage thunk.
    }
  };

  if (!currentChannelId) return null;

  return (
    <Form onSubmit={handleSubmit}>
      <div className="d-flex gap-2">
        <Form.Control
          type="text"
          aria-label={t('chat.newMessage')}
          placeholder={t('chat.messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sendingMessage}
        />
        <Button type="submit" variant="primary" disabled={sendingMessage || !message.trim()}>
          {sendingMessage ? t('chat.sending') : t('chat.send')}
        </Button>
      </div>
    </Form>
  );
}

export default MessageForm;
