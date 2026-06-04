import { useDispatch, useSelector } from 'react-redux';
import { ListGroup, Button } from 'react-bootstrap';
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
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>{t('chat.channels')}</h5>
        <Button variant="outline-primary" size="sm" onClick={() => handleOpenModal('add')}>
           + {t('chat.addChannel')}
        </Button>
      </div>
      <ListGroup>
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={channel.id === currentChannelId}
            onClick={() => dispatch(setCurrentChannel(channel.id))}
            className="d-flex justify-content-between align-items-center"
          >
            <span># {channel.name}</span>
            <ChannelMenu 
              channelId={channel.id} 
              channelName={channel.name}
              isDefault={channel.name === 'general'}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default ChannelsList;