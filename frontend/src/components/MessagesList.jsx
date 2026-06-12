import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetMessagesQuery, useGetChannelsQuery } from '../store/chatApi';
import { chatSelectors } from '../store/chatSlice';
import { filterProfanity } from '../services/profanityFilter';

function MessagesList() {
  const { t } = useTranslation();
  const { data: messages = [] } = useGetMessagesQuery();
  const { data: channels = [] } = useGetChannelsQuery();
  const currentChannelId = useSelector(chatSelectors.selectCurrentChannelId);

  const currentChannel = useMemo(
    () => channels.find((ch) => ch.id === currentChannelId) || null,
    [channels, currentChannelId],
  );

  const currentMessages = useMemo(
    () => messages.filter((msg) => msg.channelId === currentChannelId),
    [messages, currentChannelId],
  );

  return (
    <>
      <h4 className="mb-3"># {currentChannel?.name || t('chat.selectChannel')}</h4>
      <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {currentMessages.length === 0 ? (
          <p className="text-muted">{t('chat.noMessages')}</p>
        ) : (
          currentMessages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.username || 'unknown'}:</strong>{' '}
              {filterProfanity(msg.body)}
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
