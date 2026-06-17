import Rollbar from 'rollbar';

let rollbar = null;

const getRollbar = () => {
  if (!rollbar) {
    rollbar = new Rollbar({
      accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
      environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT || 'development',
      captureUncaught: true,
      captureUnhandledRejections: true,
      scrubFields: [
        'password',
        'token',
        'secret',
        'authorization',
        'cookie',
        'csrf_token',
      ],
    });
  }
  return rollbar;
};

export default getRollbar;
