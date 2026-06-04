import Image from "next/image";

interface Trainer {
  id: number;
  name: string;
  role: string;
  email: string;
  specialization: string;
  image?: string | null;
  experience: number;
  clients?: number;
  isActive: boolean;
}

interface TrainerCardProps {
  data: Trainer;
  variant?: "compact" | "full";
}

const TrainerCard = ({
  data: {
    name,
    role = "TRAINER",
    specialization,
    image,
    experience,
    isActive,
    email,
    clients,
  },
  variant = "compact",
}: TrainerCardProps) => {
  const isFull = variant === "full";

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
      
      {/* Image Section */}
      <div
        className={`relative overflow-hidden ${
          isFull ? "h-[500px]" : "h-72"
        }`}
      >
        <Image
          src={image?.trim() ? image : "/images/default-user.jpg"}
          fill
          alt={name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase backdrop-blur-md ${
              isActive
                ? "bg-green-500/20 text-green-300 border border-green-400/30"
                : "bg-red-500/20 text-red-300 border border-red-400/30"
            }`}
          >
            {isActive ? "Active" : "Offline"}
          </span>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 w-full p-6 text-white">
          <p className="text-xs tracking-[0.3em] text-red-400 uppercase">
            {role}
          </p>

          <h2
            className={`mt-2 font-black uppercase leading-tight ${
              isFull ? "text-4xl" : "text-2xl"
            }`}
          >
            {name}
          </h2>

          <p className="mt-3 max-w-lg text-sm text-zinc-200">
            {specialization}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* Email */}
        <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">

          <p className="mt-2 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {email}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Experience
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {experience}+
            </h3>

            <p className="text-sm text-zinc-500">Years</p>
          </div>

          <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Clients
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {clients || 0}+
            </h3>

            <p className="text-sm text-zinc-500">Trained</p>
          </div>
        </div>

        {/* CTA */}
 
        { isFull &&  <button className="mt-6 w-full rounded-2xl bg-red-600 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-700">
          Book Session
        </button>}
      </div>
    </div>
  );
};

export default TrainerCard;