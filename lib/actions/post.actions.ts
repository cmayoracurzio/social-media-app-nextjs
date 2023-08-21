"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Post from "../models/post.models";
import User from "../models/user.model";
import Community from "../models/community.model";

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

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdPost = await Post.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { posts: createdPost._id },
      });
    }

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
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "children", // Populate the children field
        populate: {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id name parentId image", // Select only _id and username fields of the author
        },
      });

    // Count the total number of top-level posts i.e., posts that are not comments.
    const totalPostsCount = await Post.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

async function fetchAllChildPosts(postId: string): Promise<any[]> {
  const childPosts = await Post.find({ parentId: postId });

  const descendantPosts = [];
  for (const childPost of childPosts) {
    const descendants = await fetchAllChildPosts(childPost._id);
    descendantPosts.push(childPost, ...descendants);
  }

  return descendantPosts;
}

export async function deletePost(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the post to be deleted
    const mainPost = await Post.findById(id).populate("author community");

    if (!mainPost) {
      throw new Error("Post not found");
    }

    // Fetch all child posts and their descendants recursively
    const descendantPosts = await fetchAllChildPosts(id);

    // Get all descendant post IDs including the main post ID and child post IDs
    const descendantPostIds = [id, ...descendantPosts.map((post) => post._id)];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantPosts.map((post) => post.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantPosts.map((post) => post.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainPost.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child posts and their descendants
    await Post.deleteMany({ _id: { $in: descendantPostIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { posts: { $in: descendantPostIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { posts: { $in: descendantPostIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

export async function fetchPostById(postId: string) {
  try {
    connectToDB();

    // TODO: Populate community
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Post, // The model of the nested children (assuming it's the same "Post" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
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
      parentId: postId, // Set the parentId to the original post's ID
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
