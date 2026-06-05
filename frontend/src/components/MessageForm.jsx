import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { sendMessage } from '../store/chatSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { filterProfanity, containsProfanity } from '../services/profanityFilter';

function MessageForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentChannelId, sendingMessage } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;
    
    // Фильтруем нецензурные слова
    const filteredMessage = filterProfanity(message.trim());
    
    // Проверяем, содержит ли сообщение нецензурные слова
    if (containsProfanity(message.trim())) {
      toast.warning(t('errors.profanity'));
      // Можно либо отправить отфильтрованное сообщение, либо заблокировать отправку
      // Вариант 1: отправляем отфильтрованное сообщение
      await dispatch(sendMessage({ channelId: currentChannelId, body: filteredMessage })).unwrap();
      // Вариант 2: блокируем отправку и показываем предупреждение (раскомментируйте строку ниже)
      // return;
    } else {
      await dispatch(sendMessage({ channelId: currentChannelId, body: message.trim() })).unwrap();
    }
    
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