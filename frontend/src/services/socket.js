import io from 'socket.io-client';

export const createSocket = (token) => io({ auth: { token } });
