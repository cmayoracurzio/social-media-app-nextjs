import PostsTab from "@/components/shared/PostsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="posts">
          <TabsList className="w-full bg-dark-2 min-h-[50px] flex items-center gap-2 rounded-lg border border-dark-4">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className="min-h-[41px] flex flex-1 items-center gap-3 rounded-md text-light-4 data-[state=active]:bg-indigo-500 hover:bg-dark-4 data-[state=active]:text-light-2"
              >
                <tab.icon className="object-contain w-5 h-5 text:inherit" />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Posts" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                    {userInfo?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="posts">
            <PostsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            />
          </TabsContent>

          <TabsContent value="replies">
            <p className="mt-10 text-center text-base-regular text-light-3">
              Coming soon
            </p>
          </TabsContent>

          <TabsContent value="tagged">
            <p className="mt-10 text-center text-base-regular text-light-3">
              Coming soon
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
