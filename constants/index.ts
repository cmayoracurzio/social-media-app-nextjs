import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  UserIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  TagIcon,
  UsersIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

export const sidebarLinks = [
  {
    icon: HomeIcon,
    route: "/",
    label: "Home",
  },
  {
    icon: MagnifyingGlassIcon,
    route: "/search",
    label: "Search",
  },
  {
    icon: HeartIcon,
    route: "/activity",
    label: "Activity",
  },
  {
    icon: PaperAirplaneIcon,
    route: "/create-post",
    label: "Create Post",
  },
  {
    icon: UserGroupIcon,
    route: "/communities",
    label: "Communities",
  },
  {
    icon: UserIcon,
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "posts", label: "Posts", icon: PaperAirplaneIcon },
  { value: "replies", label: "Replies", icon: ChatBubbleOvalLeftEllipsisIcon },
  { value: "tagged", label: "Tagged", icon: TagIcon },
];

export const communityTabs = [
  { value: "posts", label: "Posts", icon: ChatBubbleOvalLeftEllipsisIcon },
  { value: "members", label: "Members", icon: UsersIcon },
  { value: "requests", label: "Requests", icon: UserPlusIcon },
];
