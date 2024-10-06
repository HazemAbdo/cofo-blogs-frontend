"use client";
import { createContext, useContext, ReactNode, FC } from "react";

const UserContext = createContext<{
  token: string;
  baseUrl: string;
  s3Url: string;
}>({
  token: "",
  baseUrl: "",
  s3Url: "",
});

export const UserContextProvider: FC<{
  children: ReactNode;
  token: string;
  baseUrl: string;
  s3Url: string;
}> = ({ children, token, baseUrl, s3Url }) => {
  return (
    <UserContext.Provider value={{ token, baseUrl, s3Url }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
