'use client';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useReducer } from 'react';

type IUser = {
  userId: string;
  email: string;
};

type IAuthContext = {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
}

type IAction = {
  type: 'SET_USER' | 'SET_LOGGED_IN_USER' | 'LOGOUT_USER';
  payload: IUser | null;
}

const userReducer = (state: IUser | null, action:IAction) => {
  console.log(action);
  switch (action.type) {
    case 'SET_USER': {
      return action.payload;
    }

    case 'SET_LOGGED_IN_USER': {
      return action.payload;
    }

    case 'LOGOUT_USER': {
      return null;
    }

    default: {
      return state;
    }
  }

}



export const authContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, dispatch] = useReducer(userReducer, null);

  const searchParams = useSearchParams()
  const error = searchParams.get('error');

  useEffect(() => {
    if (error && error === 'invalid_token') {
      // remove any existing user data on error
      dispatch({
        type: 'LOGOUT_USER',
        payload: null,
      });
      localStorage.removeItem('user');
    }
  }, [error]);





  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    dispatch({
      type: 'SET_USER',
      payload: user,
    });
  }, []);

  const login = (userData: IUser) => {
    dispatch({
      type: "SET_LOGGED_IN_USER",
      payload: userData,
    })

    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    dispatch({
      type: "LOGOUT_USER",
      payload: null,
    })

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
