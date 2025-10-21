'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type IUser = {
  userId: string;
  email: string;
};

type IAuthContext = {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
}

export const authContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    setUser(user);
  }, []);

  const login = (userData: IUser) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <authContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
