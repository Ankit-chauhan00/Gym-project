import NavBar from "@/components/navigation/navbar";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <NavBar/>

      <section className="flex-1">
        {children}
      </section>
    </main>
  );
};

export default RootLayout;
