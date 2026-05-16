"use client";
import Image from "next/image";
import Link from "next/link";
import Theme from "./Theme";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <nav className="flex-between shadow-light-200 fixed z-50 w-full bg-[#944242] p-1 sm:px-12 dark:bg-[#1D1F23] dark:shadow-none">
      <Link href="/" className="flex items-center">
        <Image src="/images/main_logo.png" width={53} height={53} alt="logo" aria-label="nav logo" />
        <p className="font-frans text-2xl font-bold tracking-wide text-white dark:text-[#ffffff]">
          {" "}
          Gym<span className="font-extrabold text-[#CE1919] underline">Fit</span>
        </p>
      </Link>

      <div className="font-iceland flex-between hidden gap-10 text-2xl text-white sm:flex">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/programs">Programs</Link>
        <Link href="/trainers">Trainers</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/contacts">Contacts</Link>
      </div>
      <div className="flex-between gap-2">
        <div className="pr-5">
          <Theme />
        </div>
        <Link href="/sign-in">
        <Button className="font-asap hidden text-sm sm:flex h-[1.8rem] dark:text-white w-[5.5rem] border-[1px] border-white bg-transparent">Sign In</Button>
        </Link>
        <Link href="/sign-up">
         <Button className="font-asap hidden text-sm sm:flex h-[1.8rem] dark:bg-[#CE1919] dark:border-none dark:text-white w-[5.5rem] border-[1px] border-white bg-[#1D1F23]">Join Now</Button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
