const logger = (...args) => {
  if (import.meta.env.DEV) {
    console.log('[chat]', ...args);
  }
};

export default logger;
