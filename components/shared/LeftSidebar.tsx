"use client";

import { useAuth } from "@clerk/nextjs";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SignOut from "./SignOut";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-28 max-md:hidden">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={
                link.route === "/profile"
                  ? `${link.route}/${userId}`
                  : link.route
              }
              key={link.label}
              className={`relative flex justify-start gap-4 rounded-lg p-4 ${
                isActive
                  ? "bg-indigo-500"
                  : "hover:bg-dark-4 transition-colors duration-75"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignOut />
      </div>
    </section>
  );
};

export default LeftSidebar;
