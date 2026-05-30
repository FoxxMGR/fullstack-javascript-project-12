import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { sendMessage } from '../store/slices/messagesSlice';

function MessageForm() {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Отправка сообщения будет реализована позже с WebSocket
      console.log('Send message:', { channelId: currentChannelId, body: message });
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-top">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Отправить
        </button>
      </div>
    </form>
  );
}

export default MessageForm;