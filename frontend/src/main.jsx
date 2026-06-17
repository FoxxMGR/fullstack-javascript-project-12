import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { getSocket } from './services/socket';
import storage from './services/storage';
import init from './init.jsx';

const user = storage.getUser();
const socket = user?.token ? getSocket(user.token) : null;

init(socket).then((vdom) => {
  createRoot(document.getElementById('root')).render(vdom);
});
