export const getSession = (key) => {
  try {
      const sessionData = sessionStorage.getItem(key);
      if (sessionData) {
          const { value, expiry } = JSON.parse(sessionData);
          const now = new Date();
          if (now.getTime() > new Date(expiry).getTime()) {
              // Session expired, remove it
              sessionStorage.removeItem(key);
              return null;
          }
          return value;
      }
      return null;
  } catch (error) {
      console.error("Error getting session data", error);
      return null;
  }
};

export const setSession = (key, value, day) => {
  try {
      const now = new Date();
      const expiry = new Date(now.getTime() + day * 24 * 60 * 60 * 1000); // Adding days in milliseconds
      const sessionData = JSON.stringify({ value, expiry: expiry.toISOString() });
      sessionStorage.setItem(key, sessionData);
  } catch (error) {
      console.error("Error setting session data", error);
  }
};

export const deleteSession = (key) => {
  try {
      sessionStorage.removeItem(key);
  } catch (error) {
      console.error("Error deleting session data", error);
  }
};

//checking session still alive?
export const isSessionValid = (key) => {
  const sessionData = getSession(key);
  return sessionData !== null;
};