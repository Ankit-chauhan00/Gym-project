import { auth } from "@/auth";
import Interface from "@/components/3d/Interface";
import { Button } from "@/components/ui/button";
import bcrypt from "bcryptjs";
import Link from "next/link";
import React from "react";

const Home = async () => {

  const session = await auth();
  console.log(session);

  return (
    <section className="min-h-screen w-full bg-white dark:bg-black">
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Left Hero Text Section */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 md:py-0">
          <div className="w-full max-w-xl space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-iceland text-4xl leading-tight font-bold text-black sm:text-5xl md:text-6xl dark:text-white">
                Transform Your Body,
                <span className="text-[#CE1919]"> Transform Your Life</span>
              </h1>
              <p className="font-asap text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
                Start your fitness journey with our cutting-edge gym equipment and expert guidance. Build strength,
                boost confidence, and achieve your fitness goals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:pt-6">
              <Link href="/sign-up">
                <Button className="w-full bg-[#CE1919] px-8 py-3 text-lg font-bold text-white transition-all hover:bg-[#B01515] sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button className="w-full border-2 border-gray-300 bg-transparent px-8 py-3 text-lg font-bold text-black transition-all hover:bg-gray-100 sm:w-auto dark:border-gray-700 dark:text-white dark:hover:bg-gray-900">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-8 sm:pt-12 dark:border-gray-800">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#CE1919] sm:text-3xl">500+</p>
                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">Members</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#CE1919] sm:text-3xl">50+</p>
                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">Classes</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#CE1919] sm:text-3xl">10+</p>
                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">Trainers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3D Model Section */}
        <div className="hidden h-screen flex-1 bg-gradient-to-bl from-gray-100 to-white md:block dark:from-gray-900 dark:to-black">
          <Interface />
        </div>
      </div>
    </section>
  );
};

export default Home;
