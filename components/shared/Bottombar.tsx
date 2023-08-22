"use client";

import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const Bottombar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="fixed bottom-0 z-10 w-full bg-glassmorphism p-4 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-evenly gap-4">
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
              className={`relative flex flex-col items-center gap-2 rounded-lg p-3 ${
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
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Bottombar;
