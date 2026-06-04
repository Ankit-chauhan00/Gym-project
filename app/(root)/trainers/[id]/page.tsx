import UserAvatar from "@/components/UserAvtar";
import { getTrainerById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

interface TrainerDetailsPageProps {
  params: { id: string };
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-4 text-sm text-slate-300 shadow-sm shadow-slate-950/10">
    <p className="text-xs tracking-[0.32em] text-slate-500 uppercase">{label}</p>
    <p className="mt-2 text-base font-semibold text-white">{value}</p>
  </div>
);

const TrainerDetails = async ({ params }: TrainerDetailsPageProps) => {
  const { id } = await params;
  const { success, data: trainer } = await await getTrainerById({ trainerId: id });

  if (!success || !trainer) return redirect("/404");

  const { name, username, email, image, isVerified, phone, experience, specialization, createdAt } = trainer;

  const joinedAt = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-700/60 bg-slate-950/80 mt-20 p-6 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <UserAvatar id={id} name={name} imageUrl={image || "/images/default-user.jpg"} classname="h-28 w-28 sm:h-32 sm:w-32" />
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold tracking-[0.32em] text-red-300 uppercase">
                  Trainer Profile
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.32em] uppercase ${
                    isVerified ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700/50 text-slate-300"
                  }`}
                >
                  {isVerified ? "Verified" : "Pending verification"}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{name || "Trainer Name"}</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                {specialization ||
                  "A dedicated trainer ready to help members achieve strength, mobility, and confidence."}
              </p>
            </div>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-3 lg:w-auto">
            <Stat label="Experience" value={experience ? `${experience} years` : "Not specified"} />
            <Stat label="Specialization" value={specialization || "General Fitness"} />
            <Stat label="Joined" value={joinedAt} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_1fr]">
        <aside className="space-y-6 rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.32em] text-slate-400 uppercase">Contact</p>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="text-slate-100">Email</p>
              <a href={`mailto:${email}`} className="break-all text-red-300 hover:text-red-400">
                {email || "Not provided"}
              </a>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="text-slate-100">Username</p>
              <p>{username || "Not provided"}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="text-slate-100">Phone</p>
              <p>{phone || "Not available"}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="text-slate-100">Verification</p>
              <p>{isVerified ? "Verified trainer" : "Awaiting verification"}</p>
            </div>
          </div>
        </aside>

        <main className="space-y-6 rounded-[2rem] border border-slate-700/60 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.32em] text-slate-400 uppercase">Trainer overview</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Complete trainer details</h2>
            </div>
            <div className="inline-flex rounded-full bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300">
              Profile created {joinedAt}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat label="Focus area" value={specialization || "Fitness"} />
            <Stat label="Experience level" value={experience ? `${experience} years` : "Not specified"} />
          </div>

          <div className="rounded-[2rem] bg-slate-900/80 p-6 text-sm leading-7 text-slate-300">
            <p className="text-base font-semibold text-white">About this trainer</p>
            <p className="mt-3">
              {specialization
                ? `${name} brings experience in ${specialization.toLowerCase()} training and a proven track record supporting clients with tailored workout plans.`
                : `This trainer is focused on delivering supportive coaching, thoughtful programming, and strong accountability for every member.`}
            </p>
            <p className="mt-3 text-slate-400">
              Use the contact details on the left to book a session or request a customized training plan.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerDetails;
