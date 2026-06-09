import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; 

function ChannelMenu({ channelId, isDefault }) {
  const { t } = useTranslation();
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
        <Dropdown.Item onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { type: 'rename', channelId } }))}>
          {t('modals.renameChannel')}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { type: 'remove', channelId } }))}>
          {t('modals.deleteChannel')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ChannelMenu;