import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import init from './init.jsx';

init().then((vdom) => {
  createRoot(document.getElementById('root')).render(vdom);
});
