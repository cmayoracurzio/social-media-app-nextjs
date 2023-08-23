import Link from "next/link";
import Image from "next/image";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== "Community" && (
          <Link
            href="/profile/edit"
            className="flex items-center cursor-pointer gap-2 rounded-lg bg-dark-3 p-4 sm:px-4 sm:py-3 hover:bg-dark-4 border border-dark-4"
          >
            <PencilSquareIcon className="object-contain w-5 h-5 text-indigo-500" />
            <p className="text-light-2 max-sm:hidden">Edit</p>
          </Link>
        )}
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-4" />
    </div>
  );
}

export default ProfileHeader;
