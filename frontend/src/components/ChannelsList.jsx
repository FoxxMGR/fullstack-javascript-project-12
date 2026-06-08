import { useDispatch, useSelector } from 'react-redux';
import { Button, Stack } from 'react-bootstrap';
import { setCurrentChannel, openModal } from '../store/chatSlice';
import ChannelMenu from './ChannelMenu';
import { useTranslation } from 'react-i18next';

function ChannelsList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.chat);

  const handleOpenModal = (type, channelId = null) => {
    dispatch(openModal({ type, channelId }));
  };

  return (
    <Stack gap={2}>
      {channels.map((channel) => (
        <div key={channel.id} className="d-flex align-items-center gap-1">
          <Button
            variant={channel.id === currentChannelId ? 'primary' : 'outline-secondary'}
            className="flex-grow-1 text-start"
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            aria-label={channel.name}
          >
             {channel.name}
          </Button>
          <ChannelMenu 
            channelId={channel.id} 
            channelName={channel.name}
            isDefault={channel.name === 'general'}
          />
        </div>
      ))}
      <Button 
        variant="outline-primary" 
        size="sm" 
        onClick={() => handleOpenModal('add')}
        className="mt-2"
      >
        + {t('chat.addChannel')}
      </Button>
    </Stack>
  );
}

export default ChannelsList;
