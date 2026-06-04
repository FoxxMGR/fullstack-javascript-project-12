import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../store/slices/messagesSlice';

const MessageForm = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const { currentChannelId, sending, error } = useSelector(state => state.messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    dispatch(sendMessage({
      channelId: currentChannelId,
      body: text.trim()
    })).then(() => {
      setText(''); // Очищаем поле после успешной отправки
    });
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение..."
        disabled={sending}
      />
      <button type="submit" disabled={sending || !text.trim()}>
        {sending ? 'Отправка...' : 'Отправить'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default MessageForm;