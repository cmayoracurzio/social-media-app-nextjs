"use server";

import { revalidatePath } from "next/cache";
import Post from "../models/post.models";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function createPost({
  text,
  author,
  communityId,
  path,
}: {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}) {
  try {
    connectToDB();

    const createPost = await Post.create({ text, author, community: null });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createPost._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    // Calculate number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have to no parents (i.e. top-level posts)
    const postsQuery = Post.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentID image",
        },
      });

    const totalPostsCount = await Post.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length;
    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

export async function fetchPostById(id: string) {
  try {
    connectToDB();

    // TODO: Populate community
    const post = await Post.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
      })
      .exec();
    return post;
  } catch (error: any) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
}

export async function addCommentToPost(
  postId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();

    // Find the original post by its ID
    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      throw new Error("Post not found");
    }

    // Create a new post with the comment text
    const commentPost = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });

    // Save the new post
    const savedCommentPost = await commentPost.save();

    // Update the original post to include the new comment
    originalPost.children.push(savedCommentPost._id);

    // Save the original post
    await originalPost.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to add comment to post post: ${error.message}`);
  }
}
