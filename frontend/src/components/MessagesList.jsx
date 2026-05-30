import { useSelector } from 'react-redux';

function MessagesList() {
  const { items: messages } = useSelector((state) => state.messages);
  const { currentChannelId } = useSelector((state) => state.channels);

  const filteredMessages = messages.filter(
    (message) => message.channelId === currentChannelId
  );

  return (
    <div className="flex-grow-1 overflow-auto p-3" style={{ height: 'calc(100vh - 140px)' }}>
      {filteredMessages.map((message) => (
        <div key={message.id} className="mb-2">
          <strong>{message.username}:</strong> {message.body}
        </div>
      ))}
    </div>
  );
}

export default MessagesList;