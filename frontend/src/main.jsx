import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import { getSocket } from './services/socket';
import init from './init.jsx';

const token = localStorage.getItem('token');
const socket = token ? getSocket(token) : null;

init(socket).then((vdom) => {
  createRoot(document.getElementById('root')).render(vdom);
}).catch((err) => {
  console.error('Init failed:', err);
});
