"use client";

import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignOut = () => {
  const router = useRouter();
  return (
    <SignedIn>
      <SignOutButton signOutCallback={() => router.push("/sign-in")}>
        <div className="flex cursor-pointer rounded-lg gap-4 p-4 hover:bg-dark-4 transition-colors duration-75">
          <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
          <p className="text-light-2 max-lg:hidden">Logout</p>
        </div>
      </SignOutButton>
    </SignedIn>
  );
};

export default SignOut;
