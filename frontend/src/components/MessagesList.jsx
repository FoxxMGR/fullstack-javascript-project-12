import { useSelector } from 'react-redux';

function MessagesList() {
  const { messages, currentChannelId, channels } = useSelector((state) => state.chat);
  const currentChannel = channels.find(ch => ch.id === currentChannelId);
  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);

  return (
    <>
      <h4 className="mb-3"># {currentChannel?.name || 'Выберите канал'}</h4>
      <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {currentMessages.length === 0 ? (
          <p className="text-muted">Нет сообщений. Будьте первым!</p>
        ) : (
          currentMessages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.username}:</strong> {msg.body}
              <small className="text-muted ms-2">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
              </small>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MessagesList;