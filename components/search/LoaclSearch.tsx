'use client';

import { formUrlQuerry, removeKeysfromUrlQuery } from "@/constants/url";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

const LoaclSearch = ({ route, imgSrc, placeholder, otherClasses, iconPosition = "left" }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("query") || "";
  const router = useRouter();
  const [searchQuery, setsearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuerry({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysfromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return ()=>clearTimeout(delayDebounceFn)
  },[searchQuery, router, route, searchParams, pathname]);

  return  <div className={`background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
     {iconPosition === 'left' && 
      <Image 
      src={imgSrc}
      height={24}
      width={24}
      alt='Searc'
      className='cursor-pointer'
      />}
      <Input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e)=>{setsearchQuery(e.target.value)}}
      className='paragraph-regular no-focus placeholder   text-dark400_light700 border-none shadow-none outline-none'
      />
      {iconPosition === 'right' && 
      <Image 
      src={imgSrc}
      height={24}
      width={24}
      alt='Searc'
      className='cursor-pointer'
      />}
    </div>
};

export default LoaclSearch;
