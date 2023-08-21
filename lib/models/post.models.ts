import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
