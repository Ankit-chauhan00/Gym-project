import ROUTES from "@/constants/routes";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import { MdShoppingCart } from "react-icons/md";

import React from "react";


interface Props {
  image?: string;
  role?: string;
  name?: string;
  id?:string
}

const ProfileSideBar = async ({image, role, name, id}:Props) => {


  return (
    <section className="min-h-full w-1/4 border-r-2 bg-gray-800 md:w-1/3 lg:w-1/6">
      <div className="items-center  md:items-start  mt-20 flex flex-col gap-2 p-3">
        <h2 className="font-iceland text-xl md:text-6xl ">Profile</h2>

        <div className="mt-5 flex flex-col font-iceland gap-5">
         
          <Link className="flex cursor-pointer flex-wrap items-center gap-" href={ROUTES.USER_CART(id!)}>
          <h3 className="md:text-3xl hidden md:block">Favourates</h3>
          <MdShoppingCart className="size-7 md:size-10" />
          </Link>

          <Link className="flex cursor-pointer flex-wrap items-center gap-2" href={ROUTES.USER_EDIT(id!)}>
          <h3 className="md:text-3xl hidden md:block">Edit</h3>
          <MdEdit className="size-7 md:size-10" />
          </Link>


          {role === "TRAINER" &&  <Link className="flex cursor-pointer flex-wrap items-center gap-2" href={ROUTES.USER_CART(id!)}>
          <h3 className="md:text-3xl hidden md:block">Trainer Pannel</h3>
          <MdShoppingCart className="size-7 md:size-10" />
          </Link>}

          {role === "ADMIN" && <Link className="flex cursor-pointer flex-wrap items-center gap-2" href={ROUTES.ADMIN}>
          <h3 className="md:text-3xl hidden md:block">Admin Pannel</h3>
          <MdAdminPanelSettings className="size-7 md:size-10" />
          </Link>}

        </div>
      </div>
    </section>
  );
};

export default ProfileSideBar;
