import io from 'socket.io-client';

let socket = null;

export const getSocket = (token) => {
  if (!socket) {
    socket = io({ auth: { token } });
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
