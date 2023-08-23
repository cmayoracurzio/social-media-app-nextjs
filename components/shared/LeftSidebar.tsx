"use client";

import { useAuth } from "@clerk/nextjs";
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOut from "./SignOut";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-28 max-md:hidden">
      <div className="flex w-full flex-1 flex-col gap-5 px-6">
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
              className={`relative flex items-center justify-start gap-4 rounded-lg p-4 ${
                isActive ? "bg-indigo-500" : "hover:bg-dark-4"
              }`}
            >
              <link.icon className="cursor-pointer object-contain w-6 h-6 text-light-1" />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mb-4 px-6">
        <SignOut />
      </div>
    </section>
  );
};

export default LeftSidebar;
