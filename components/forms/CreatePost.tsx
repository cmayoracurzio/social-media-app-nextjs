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
import { Textarea } from "../ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { PostValidation } from "@/lib/validations/post";
import { createPost } from "@/lib/actions/post.actions";
import { useOrganization } from "@clerk/nextjs";

interface Props {
  userId: string;
}

const CreatePost = ({ userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      post: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    await createPost({
      text: values.post,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormControl className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={11}
                  className="border border-dark-4 bg-dark-3 text-light-1 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="rounded-3xl bg-indigo-500 hover:bg-indigo-800 px-5 py-2 text-light-1"
        >
          Create Post
        </Button>
      </form>
    </Form>
  );
};

export default CreatePost;
