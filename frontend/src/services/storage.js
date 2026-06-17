const USER_KEY = 'user';

const storage = {
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const { token, username } = JSON.parse(raw);
      return token && username ? { token, username } : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },
};

export default storage;
