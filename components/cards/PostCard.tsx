import { formatDateString } from "@/lib/utils";
import {
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowPathRoundedSquareIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const PostCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7 mb-12" : "bg-dark-2 p-7 border border-dark-4"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="relative mt-2 w-0.5 grow rounded-full bg-neutral-800" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1 hover:underline hover:underline-offset-2">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2 break-normal">
              {content}
            </p>
            <div className={`${isComment && "mb-5"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-6 items-center">
                <HeartIcon className="cursor-pointer object-contain w-6 h-6 text-light-4" />
                <Link href={`/post/${id}`}>
                  <ChatBubbleOvalLeftEllipsisIcon className="cursor-pointer object-contain w-6 h-6 text-light-4" />
                </Link>
                <ArrowPathRoundedSquareIcon className="cursor-pointer object-contain w-6 h-6 text-light-4" />
                <BookmarkIcon className="cursor-pointer object-contain w-6 h-6 text-light-4" />

                <ShareIcon className="cursor-pointer object-contain w-6 h-6 text-light-4" />
              </div>
            </div>
          </div>
        </div>

        {/* TODO: Delete post */}
        {/* TODO: Show comment logos */}
      </div>

      <div className="mt-6 flex items-center gap-1 text-subtle-medium text-gray-1">
        <p>{formatDateString(createdAt)}</p>
        {!isComment && community && (
          <>
            {" · "}
            <Link
              href={`/communities/${community.id}`}
              className="flex items-center hover:text-light-2"
            >
              {community.name} Community
            </Link>
          </>
        )}
      </div>
    </article>
  );
};

export default PostCard;
