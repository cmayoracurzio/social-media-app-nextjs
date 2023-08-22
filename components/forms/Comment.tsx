"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { CommentValidation } from "@/lib/validations/post";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToPost } from "@/lib/actions/post.actions";

interface Props {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ postId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      post: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToPost(
      postId,
      values.post,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col"
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="rounded-3xl bg-indigo-500 hover:bg-indigo-800 px-5 py-2 text-light-1"
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
