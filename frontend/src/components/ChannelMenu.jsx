import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { openModal } from '../store/chatSlice';

function ChannelMenu({ channelId, isDefault }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  if (isDefault) return null;

  return (
    <Dropdown drop="start">
      <Dropdown.Toggle
        variant="link"
        size="sm"
        className="text-dark p-0"
        style={{ textDecoration: 'none' }}
      >
        Управление каналом
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => dispatch(openModal({ type: 'rename', channelId }))}>
          {t('modals.renameChannel')}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => dispatch(openModal({ type: 'remove', channelId }))}>
          {t('modals.deleteChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ChannelMenu;
