'use client';

import { useEffect, useState } from 'react';


type User = {
  userId: string;
  email: string;
};


const useUserData = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    setUser(user);
  }, []);

  return user;
};

export default useUserData;
