import CreatePost from "@/components/forms/CreatePost";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="text-heading2-bold text-light-1">Create Post</h1>
      {}
      <CreatePost userId={userInfo._id.toJSON()} />
    </>
  );
}

export default Page;
