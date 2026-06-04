import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { sendMessage } from '../store/chatSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

function MessageForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentChannelId, sendingMessage } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;
    
    await dispatch(sendMessage({ channelId: currentChannelId, body: message.trim() })).unwrap();
    setMessage('');
  };

  if (!currentChannelId) return null;

  return (
    <Form onSubmit={handleSubmit}>
      <div className="d-flex gap-2">
        <Form.Control
          type="text"
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