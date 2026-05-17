"use client";

import Image from "next/image";

interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
  image?: string;
}

interface MembershipCardProps {
  plan: MembershipPlan;
}

const MembershipCard = ({
  plan: { name, image, description, price, durationDays, features, isActive },
}: MembershipCardProps) => {
  return (
    <div
      className={`relative flex h-[600px] w-80 flex-shrink-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-2 sm:h-[650px] sm:w-96 ${
        isActive
          ? "border-red-500 bg-white/95 shadow-[0_8px_32px_rgba(239,68,68,0.15)] dark:border-red-500 dark:bg-black/90 dark:shadow-[0_0_25px_rgba(255,0,0,0.25)]"
          : "border-gray-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none"
      }`}
    >
      {/* Active Badge */}
      {isActive && (
        <div
          className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${isActive ? "bg-red-600 text-white dark:bg-red-600" : ""}`}
        >
          Most Popular
        </div>
      )}

      {/* Image */}
      <div className="relative h-40 overflow-hidden rounded-xl sm:h-48">
        <Image src={image || "/images/default-gym.jpg"} alt={name} fill className="object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col space-y-3 overflow-y-auto p-5 sm:space-y-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide text-black uppercase sm:text-3xl dark:text-white">
            {name}
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-zinc-400">{description}</p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-red-500 sm:text-5xl">${price}</span>

          <span className="mb-1 text-xs text-gray-600 sm:text-sm dark:text-zinc-400">/ {durationDays} Days</span>
        </div>

        {/* Features */}
        <ul className="flex-grow space-y-2 sm:space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm dark:text-zinc-300">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Button */}
        <button
          className={`mt-auto w-full rounded-lg py-2 text-xs font-bold tracking-wide uppercase transition-all duration-300 sm:py-3 sm:text-sm ${
            isActive
              ? "bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700"
              : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white"
          }`}
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
};

export default MembershipCard;
