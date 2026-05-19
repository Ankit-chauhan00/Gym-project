"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

import ROUTES from "@/constants/routes";
import { signIn } from "next-auth/react";
import { toast } from "sonner";


const SocialAuthForm = () => {

  const handleSocilaAuthForm = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: true,
      });
    } catch (error) {
      toast.error("Sign in failed")
    }
  };

  return (
    <div className="mt-6 flex w-full flex-col flex-wrap gap-2 sm:mt-10 sm:flex-row sm:gap-2.5">
      <Button
        onClick={() => handleSocilaAuthForm("google")}
        className="flex-1 gap-2 border border-gray-300 bg-white px-3 py-2 text-black transition-colors hover:bg-gray-100 sm:flex-none sm:px-4 sm:py-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      >
        <Image src="/icons/google.svg" height={20} width={20} alt="google logo" className="object-contain" />
        <span className="text-sm font-medium sm:text-base">Google</span>
      </Button>
      <Button
        onClick={() => handleSocilaAuthForm("github")}
        className="flex-1 gap-2 border border-gray-300 bg-white px-3 py-2 text-black transition-colors hover:bg-gray-100 sm:flex-none sm:px-4 sm:py-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      >
        <Image src="/icons/github.png" height={20} width={20} alt="github logo" className="object-contain" />
        <span className="text-sm font-medium sm:text-base">GitHub</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
