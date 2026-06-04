import { Dropdown } from 'react-bootstrap';

function ChannelMenu({ channelId, channelName, isDefault }) {
  if (isDefault) return null;

  return (
    <Dropdown drop="start">
      <Dropdown.Toggle variant="link" size="sm" className="text-dark p-0" style={{ textDecoration: 'none' }}>
        ⋮
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { type: 'rename', channelId } }))}>
          ✏️ Переименовать
        </Dropdown.Item>
        <Dropdown.Item onClick={() => window.dispatchEvent(new CustomEvent('openModal', { detail: { type: 'remove', channelId } }))}>
          🗑️ Удалить
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ChannelMenu;