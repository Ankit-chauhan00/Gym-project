import TrainerCard from "@/components/cards/TrainerCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilters from "@/components/filters/CommonFilters";
import Pagination from "@/components/Pagination";
import LoaclSearch from "@/components/search/LoaclSearch";
import { DeleteUserFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { DEFAULT_EMPTY } from "@/constants/states";
import { getSavedTrainers } from "@/lib/actions/user.action";
import { TrainerWithUser } from "@/types/global";
import Link from "next/link";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Trainers = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedTrainers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 6,
    query: query || "",
    filter: filter || "",
  });

  const { trainers, isNext } = data || {};

  return (
    <section className="min-h-screen w-full bg-white transition-colors duration-300 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-red-500 uppercase">Expert Trainers</p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-black uppercase md:text-6xl dark:text-white">
            Meet Our Coaches
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Train with certified professionals dedicated to helping you achieve your fitness goals.
          </p>
          <LoaclSearch
            otherClasses="w-full  border-1 border-white mt-5"
            route="/trainers"
            imgSrc="/icons/search.svg"
            placeholder="Search your favourate Trainer with their specialization ex:- yoga, cardio, powerlifting crossfit..." 
              // "Yoga"
              // "Cardio",
              // "Powerlifting",
              // "Crossfit",
              // "Calisthenics","
            iconPosition="left"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CommonFilters filters={DeleteUserFilters} otherClasses="w-full" containerClasses="" />
          </div>
        </div>

        {/* Trainers Grid */}
        <div className=" min-h-full w-full gap-6 ">
          <DataRenderer
            success={success}
            error={error}
            data={trainers}
            empty={DEFAULT_EMPTY}
            render={(trainers: TrainerWithUser[]) => (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {trainers.map((trainer) => (
                  <Link key={trainer.id} href={ROUTES.TRAINER(trainer.id)}>
                  <TrainerCard
                    data={{
                      ...trainer,
                      image: trainer.user?.image || "",
                      name: trainer.user?.name || "Unknown Trainer",
                    }}
                  />
                  </Link>
                ))}
              </div>
            )}
          />
        </div>

        <div className="flex justify-center mt-5">
          <Pagination page={page} isNext={isNext || false} containerClasses="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
};

export default Trainers;
