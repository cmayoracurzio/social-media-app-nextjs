"use client";

import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  inLeftSidebar: boolean;
}

const SignOut = ({ inLeftSidebar }: Props) => {
  const router = useRouter();
  return (
    <SignedIn>
      <SignOutButton signOutCallback={() => router.push("/sign-in")}>
        <div className={`flex cursor-pointer ${inLeftSidebar && "gap-4 p-4"}`}>
          <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
          {inLeftSidebar && (
            <p className="text-light-2 max-lg:hidden">Logout</p>
          )}
        </div>
      </SignOutButton>
    </SignedIn>
  );
};

export default SignOut;
