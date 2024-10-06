import { getAccessToken } from "@auth0/nextjs-auth0";
import React from "react";
import { redirect } from "next/navigation";
import { UserContextProvider } from "./context/user";
const Providers: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  let token = "";
  try {
    const { accessToken } = await getAccessToken();
    token = accessToken as string;
  } catch (error) {
    redirect("/api/auth/signup");
  }
  const baseUrl = process.env.BACKEND_BASE_URL as string;
  const s3Url = process.env.S3_BUCKET_URL as string;
  return (
    <UserContextProvider
      token={token as string}
      baseUrl={baseUrl}
      s3Url={s3Url}
    >
      {children}
    </UserContextProvider>
  );
};

export default Providers;
