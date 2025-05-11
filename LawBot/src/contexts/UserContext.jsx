// src/contexts/UserContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const contextLogin = (id) => {
    setUserId(id);
  };

  const contextLogout = () => {
    localStorage.clear();
    setUserId(null);
  };

  return (
    <UserContext.Provider value={{ userId, contextLogin, contextLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
