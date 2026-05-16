"use client";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isSignIn = pathname?.includes("sign-in");

  return (
    <main className="flex min-h-screen items-center overflow-hidden bg-white dark:bg-black">
      {/* Top Navbar */}
      <div className="absolute top-4 z-50 flex w-full justify-between px-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/main_logo.png" width={40} height={40} alt="logo" className="h-8 w-8 sm:h-10 sm:w-10" />
          <p className="font-frans text-xl font-bold tracking-wide text-black sm:text-2xl dark:text-white">
            Gym
            <span className="font-extrabold text-[#CE1919] underline">Fit</span>
          </p>
        </Link>

        <div className="font-frans flex items-center gap-2">
          <p className="text-xs text-black sm:text-base dark:text-white">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
            <Button className="bg-[#CE1919] px-2 py-1 text-xs text-white hover:bg-[#B01515] sm:px-4 sm:py-2 sm:text-sm">
              {isSignIn ? "Sign Up" : "Sign In"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Left Form - Full width on mobile, 50% on desktop */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-20 sm:px-10 sm:py-0 sm:width-1/2 md:w-1/2">
        <div className="w-full max-w-md">{children}</div>
        <div className="mt-6 w-full max-w-md">
          <SocialAuthForm />
        </div>
      </div>

      {/* Right Image - Hidden on mobile and tablet, visible on desktop */}
      <div className="relative hidden h-screen w-1/2 overflow-hidden md:block">
        {/* Dark Theme Image */}
        <Image
          src="/images/bull_dark.png"
          alt="dark auth image"
          fill
          sizes="50vw"
          priority
          className="hidden scale-150 object-cover object-[10px] dark:block"
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
