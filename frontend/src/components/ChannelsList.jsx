import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/slices/channelsSlice';

function ChannelsList() {
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector((state) => state.channels);

  return (
    <div className="col-3 border-end vh-100 p-3">
      <h5>Каналы</h5>
      <ul className="nav flex-column">
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item mb-2">
            <button
              className={`btn btn-sm w-100 text-start ${
                currentChannelId === channel.id ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              # {channel.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelsList;