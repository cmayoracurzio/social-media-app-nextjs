import * as z from "zod";

export const PostValidation = z.object({
  post: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  post: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
