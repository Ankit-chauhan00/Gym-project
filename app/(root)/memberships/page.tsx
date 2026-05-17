import MembershipCard from "@/components/cards/MembershipCard";
import React from "react";
export const membershipPlans = [
  {
    id: 1,
    name: "Basic Plan",
    description: "Perfect for beginners who want to start their fitness journey.",
    price: 19,
    durationDays: 30,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    features: ["Gym Access", "Basic Equipment", "1 Group Class / Week", "Locker Room Access", "Community Support"],
    isActive: false,
  },

  {
    id: 2,
    name: "Pro Plan",
    description: "Best for consistent training and faster body transformation.",
    price: 39,
    durationDays: 30,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Everything in Basic",
      "Unlimited Gym Access",
      "3 Group Classes / Week",
      "Personal Training (1x / Month)",
      "Nutrition Guidance",
      "Priority Support",
    ],
    isActive: true,
  },

  {
    id: 3,
    name: "Elite Plan",
    description: "Advanced membership for serious athletes and professionals.",
    price: 69,
    durationDays: 30,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Everything in Pro",
      "Unlimited Group Classes",
      "Personal Training (2x / Month)",
      "Custom Workout Plan",
      "Body Composition Analysis",
      "VIP Support",
      "Guest Pass (2 / Month)",
    ],
    isActive: false,
  },

  {
    id: 4,
    name: "Athlete Plan",
    description: "Designed for athletes focused on performance, endurance, and recovery.",
    price: 99,
    durationDays: 90,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Everything in Elite",
      "Advanced Strength Training",
      "Weekly Personal Coaching",
      "Recovery & Mobility Sessions",
      "Sports Performance Tracking",
      "Exclusive Athlete Community",
    ],
    isActive: false,
  },

  {
    id: 5,
    name: "Transformation Plan",
    description: "Complete transformation program with personalized fitness and nutrition support.",
    price: 149,
    durationDays: 120,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
    features: [
      "Custom Workout Program",
      "Dedicated Personal Trainer",
      "Diet & Nutrition Planning",
      "Weekly Progress Tracking",
      "Premium Recovery Access",
      "24/7 Support & Guidance",
      "Monthly Fitness Assessment",
    ],
    isActive: true,
  },
];

const Memberships = () => {
  return (
    <section className="min-h-screen w-full bg-white transition-colors duration-300 dark:bg-black">
      <div className="relative flex h-full w-full flex-col px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mb-12 flex flex-col items-center gap-2 sm:mb-16 sm:gap-4">
          <h2 className="font-frans text-lg text-red-600 sm:text-2xl dark:text-red-500">Choose your Plan</h2>
          <h1 className="font-frans text-center text-4xl text-black sm:text-5xl lg:text-6xl dark:text-white">
            MEMBERSHIP PLAN
          </h1>
          <p className="text-center text-base text-gray-600 sm:text-xl dark:text-gray-300">
            Flexible Plan for Every Fitness Level
          </p>
        </header>

        <main className="scrollbar-hide flex gap-6 overflow-x-auto pb-4 sm:gap-8">
          {membershipPlans.map((plan) => (
            <MembershipCard key={plan.id} plan={plan} />
          ))}
        </main>
      </div>
    </section>
  );
};

export default Memberships;
