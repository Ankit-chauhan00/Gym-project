import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilters from "@/components/filters/CommonFilters";
import Pagination from "@/components/Pagination";
import LoaclSearch from "@/components/search/LoaclSearch";
import { DeleteUserFilters } from "@/constants/filter";
import { DEFAULT_EMPTY } from "@/constants/states";
import { getUsers } from "@/lib/actions/admin.action";
import { SafeUser } from "@/types/action";

// we haev to delete use and their associated  account


interface SearchParams {
  searchParams: {
    page?: string;
    pageSize?: string;
    query?: string;
    filter?: string;
  };
}

const DeleteUser = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
    query: query || "",
    filter: filter || "",
  });

  const { users, isNext} = data || {};
  return (
    <section className="min-h-full w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="font-iceland text-3xl leading-tight text-slate-950 sm:text-4xl dark:text-white">
                  Delete Users
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Find and manage users with search and filters. Results update automatically as you type.
                </p>
              </div>

              <div className="w-full sm:w-[420px]">
                <LoaclSearch
                  route="/admin/delete-users"
                  imgSrc="/icons/search.svg"
                  placeholder="Search users..."
                  otherClasses="w-full"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CommonFilters filters={DeleteUserFilters} otherClasses="w-full" containerClasses="" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-sm dark:border-zinc-800  dark:bg-zinc-950/90">
            <DataRenderer
              success={success}
              error={error}
              data={users}
              empty={DEFAULT_EMPTY}
              render={(users: SafeUser[]) => (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {users.map((user) => (
                    <UserCard key={user.id} user={user}  />
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Pagination page={page} isNext={isNext || false} containerClasses="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteUser;
