import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { useSendMessageMutation } from '../store/chatApi';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { filterProfanity, containsProfanity } from '../services/profanityFilter';

function MessageForm() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
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
      await sendMessage({
        channelId: currentChannelId,
        body: containsProfanity(body) ? filteredMessage : body,
        username: user?.username,
      }).unwrap();
      setMessage('');
    } catch {
      // Toast уже показан в onQueryStarted
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
