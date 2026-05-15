import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen items-center overflow-hidden bg-white dark:bg-black">
  
  {/* Top Navbar */}
  <div className="absolute top-5 z-50 flex w-full justify-between px-10">
    
    <Link href="/" className="flex items-center">
      <Image
        src="/images/main_logo.png"
        width={53}
        height={53}
        alt="logo"
      />

      <p className="font-frans text-2xl font-bold tracking-wide text-white">
        Gym
        <span className="font-extrabold text-[#CE1919] underline">
          Fit
        </span>
      </p>
    </Link>

    <div className="flex items-center gap-1 font-frans">
      <p className="text-white">
        Don’t have an account?
      </p>

      <Link href="/sign-up">
        <Button className="bg-transparent text-[#CE1919] hover:bg-transparent">
          Sign up
        </Button>
      </Link>
    </div>
  </div>

  {/* Left Form */}
  <div className="flex w-[50%] justify-center flex-col px-10">
    {children}

    <SocialAuthForm/>
  </div>

  {/* Right Image */}
  <div className="relative h-screen w-[55%] overflow-hidden">
   {/* Dark Theme Image */}
  <Image
    src="/images/bull_dark.png"
    alt="dark auth image"
    fill
    sizes="50vw"
    priority
    className="hidden object-cover object-left dark:block"
  />

  {/* Light Theme Image */}
  <Image
    src="/images/bull_light.png"
    alt="light auth image"
    fill
    priority
    sizes="50vw"
    className="object-cover object-[150%_center] dark:hidden"
  />
  </div>
</main>
  );
};

export default AuthLayout;
