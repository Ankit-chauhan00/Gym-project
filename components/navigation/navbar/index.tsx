"use client";

import Image from "next/image";
import Link from "next/link";
import Theme from "./Theme";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

const NavBar = () => {
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <nav className="flex-between shadow-light-200 fixed z-50 w-full bg-[#944242] p-1 sm:px-12 dark:bg-[#1D1F23] dark:shadow-none">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/main_logo.png"
          width={53}
          height={53}
          alt="logo"
          aria-label="nav logo"
        />

        <p className="font-frans text-2xl font-bold tracking-wide text-white dark:text-[#ffffff]">
          Gym
          <span className="font-extrabold text-[#CE1919] underline">
            Fit
          </span>
        </p>
      </Link>

      <div className="font-iceland flex-between hidden gap-10 text-2xl text-white sm:flex">
        <Link href="/">Home</Link>
        <Link href="/memberships">Memberships</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/trainers">Trainers</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/contacts">Contacts</Link>
        {isAdmin && <Link href="/admin">Admin Panel</Link>}
      </div>

      <div className="flex-between gap-2">
        <div className="pr-5">
          <Theme />
        </div>

        {userId ? (
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-asap hidden h-[1.8rem] w-[5.5rem] border-[1px] border-white bg-transparent text-sm sm:flex dark:text-white"
          >
            Logout
          </Button>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className="font-asap hidden h-[1.8rem] w-[5.5rem] border-[1px] border-white bg-transparent text-sm sm:flex dark:text-white">
                Sign In
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="font-asap hidden h-[1.8rem] w-[5.5rem] border-[1px] border-white bg-[#1D1F23] text-sm sm:flex dark:border-none dark:bg-[#CE1919] dark:text-white">
                Join Now
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;