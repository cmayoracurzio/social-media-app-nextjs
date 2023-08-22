import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className="text-heading2-bold text-light-1">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length === 0 ? (
          <p className="text-center text-base-regular text-light-3">
            No activity found
          </p>
        ) : (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/post/${activity.parentId}`}>
                <article className="flex items-center gap-2 rounded-md bg-dark-2 px-7 py-4">
                  <Image
                    src={activity.author.image}
                    alt="Profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="text-small-regular text-light-1">
                    <span className="mr-1 text-indigo-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Page;
