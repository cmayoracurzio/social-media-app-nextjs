"use client";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();
  return (
    <SignedIn>
      <SignOutButton signOutCallback={() => router.push("/sign-in")}>
        <div className="flex items-center cursor-pointer rounded-lg gap-4 p-4 hover:bg-dark-4">
          <ArrowLeftOnRectangleIcon className="text-white h-7 w-7" />
          <p className="text-light-1 max-lg:hidden">Logout</p>
        </div>
      </SignOutButton>
    </SignedIn>
  );
};

export default SignOut;
