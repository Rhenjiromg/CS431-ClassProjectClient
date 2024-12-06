
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const setUserData = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const clearUser = () => {
    setUser(null);
    localStorage.setItem('user', null);
  };

  return (
    <UserContext.Provider value={{ user, setUserData, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  return useContext(UserContext);
};
