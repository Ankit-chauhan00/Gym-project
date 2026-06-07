import { auth } from "@/auth";
import ProfileSideBar from "@/components/navigation/ProfileSideBar";
import UserAvatar from "@/components/UserAvtar";
import { getUser } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const UserProfile = async ({ params }: RouteParams) => {
  const { id } = await params;

  const session = await auth();

  if (!session?.user.id) {
    toast.message("need to be logged in or Sign up First");
    redirect("/sign-in");
  }

  // prevent accessing other profiles

  if (session.user.id != id) {
    toast.error("Unauthorized");
    redirect("/");
  }

  const { data: profileUser } = await getUser();

  if (!profileUser) {
    toast.error("User not found");
    redirect("/sign-up");
  }

  const { image, name, role } = profileUser!;



  return (
    <main className="min-h-screen w-full">
      <div className="flex min-h-screen w-full">
        <ProfileSideBar image={image || ""} role={role} name={name || ""} id={id} />
        <div className="flex items-start p-20">
          <div className="">
            <UserAvatar id={id} imageUrl={image} name={name || ""} classname="size-28   object-cover" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
