import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import PostsTab from "@/components/shared/PostsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.createdBy.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="posts">
          <TabsList className="w-full bg-dark-2 min-h-[50px] flex items-center gap-1 rounded-lg">
            {communityTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                className="min-h-[41px] flex flex-1 items-center gap-2 rounded-md text-light-2 data-[state=active]:bg-indigo-500 hover:bg-dark-4 data-[state=active]:text-light-2"
              >
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Posts" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 text-tiny-medium text-light-2">
                    {communityDetails.posts.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="posts">
            <PostsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members">
            <section className="mt-10 flex flex-col gap-10">
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests">
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
