"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeUser } from "@/types/action";
import { User } from "@prisma/client";
import UserDelete from "../deletionComponets/UserDelete";

interface UserCardProps {
  user: SafeUser;
}

const roleStyles: Record<NonNullable<User["role"]>, string> = {
  USER: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200",
  ADMIN: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200",
  TRAINER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
};

const UserCard = ({ user: { name, image, username, email, role, createdAt, id } }: UserCardProps) => {
  const displayName = name || username || "Unknown User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <>
    <article className="group overflow-hidden rounded-3xl border border-gray-200 bg-white p-10 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <Avatar className="relative h-24 w-24 shrink-0 rounded-full border border-gray-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900">
          {image ? (
            <AvatarImage src={image} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-sky-500 to-cyan-400 text-lg font-black text-white">
              {initials || "U"}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="gap- flex flex-wrap items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase dark:text-slate-400">
                {role}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                {displayName}
              </h2>
            </div>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${roleStyles[role]}`}>{role}</span>
          </div>

          <p className="mt-3 truncate text-sm text-slate-600 dark:text-slate-400">@{username || "no_username"}</p>

          {email && <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{email}</p>}
        </div>
      </div>

      <div className="mt-3 grid gap-8 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-zinc-900 dark:text-slate-300">
          <p className="text-xs tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">Member since</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">
            {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-zinc-900 dark:text-slate-300">
          <p className="text-xs tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">Profile status</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">Active member</p>
        </div>
      </div>

      <UserDelete  userId={id} />
    
    </article>

  </>
  );
};

export default UserCard;
