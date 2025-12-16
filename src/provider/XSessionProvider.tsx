"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// create context
export const SessionContext = createContext<any>({});

// provider
const XSessionProvider = ({ children, propsData }: { children: ReactNode, propsData: any }) => {
  const [session, setSession] = useState({});

  useEffect(() => {

    async function fetcSession() {
        setSession(propsData);
    }

    fetcSession();
  }, [propsData]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

// hook to use session
export const useXSession = () => {
  const session = useContext(SessionContext);
  return session;
};


export default XSessionProvider;
