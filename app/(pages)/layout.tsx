import React from "react";
import Providers from "./providers";
import NavBar from "@components/navbar/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {" "}
      <NavBar />
      <main className='min-h-screen'>{children}</main>
      <footer className='w-full flex items-center justify-center py-3'></footer>
    </Providers>
  );
}
