import NavBar from "@/components/navigation/navbar";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="">
      <NavBar/>

      <section className="min-h-screen flex-1  object-cover">
        {children}
      </section>
    </main>
  );
};

export default RootLayout;
