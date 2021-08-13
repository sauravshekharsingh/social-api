const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Like = require('../../models/like');

// Fetch all posts
fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'createdBy',
          select: { _id: 1, username: 1, name: 1 },
        },
        {
          path: 'likes',
          populate: {
            path: 'createdBy',
            select: { _id: 1, username: 1, name: 1 },
          },
          select: { _id: 1, createdBy: 1 },
        },
        {
          path: 'comments',
          populate: {
            path: 'createdBy',
            select: { _id: 1, username: 1, name: 1 },
          },
        },
      ]);

    return res.status(200).json({ posts, success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false });
  }
};

// Create a post
createPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      createdBy: req.user._id,
    });

    await post.save();
    return res.status(200).json({ message: 'Post created', success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false });
  }
};

// Delete a post
deletePost = async (req, res) => {
  try {
    // Find post
    let post = await Post.findById(req.query.postId);
    post.remove();

    // Delete likes and comments
    await Comment.deleteMany({ onPost: req.query.postId });
    await Like.deleteMany({ onPostOrComment: req.query.postId });

    return res.status(200).json({ message: 'Post deleted', success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false });
  }
};

module.exports = { fetchPosts, createPost, deletePost };
