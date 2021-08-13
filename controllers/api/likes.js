const Post = require('../../models/post');
const Like = require('../../models/like');
const Comment = require('../../models/comment');

// Create a like
createLike = async (req, res) => {
  try {
    // Check if like already exists by the user
    let isLiked;

    if (req.query.on === 'Post') {
      const post = await Post.findById(req.query.id).populate({
        path: 'likes',
        select: { _id: 1, createdBy: 1 },
      });
      isLiked = false;
      post.likes.map((like) => {
        if (like.createdBy.equals(req.user._id)) {
          isLiked = true;
        }
      });
      if (isLiked) {
        res.status(200).json({ message: 'Already liked post', success: true });
      }
    } else if (req.query.on === 'Comment') {
      const comment = await Comment.findById(req.query.id).populate({
        path: 'likes',
        select: { _id: 1, createdBy: 1 },
      });
      isLiked = false;
      comment.likes.map((like) => {
        if (like.createdBy.equals(req.user._id)) {
          isLiked = true;
        }
      });
      if (isLiked) {
        res
          .status(200)
          .json({ message: 'Already liked comment', success: true });
      }
    }

    if (!isLiked) {
      // Create new like
      const like = new Like({
        createdBy: req.user._id,
        onPostOrComment: req.query.id,
        onModel: req.query.on,
      });

      like.save();

      // Insert like in post or the comment
      if (req.query.on === 'Post') {
        const post = await Post.findById(req.query.id);

        post.likes.push(like._id);
        await post.save();
      } else if (req.query.on === 'Comment') {
        const comment = await Comment.findById(req.query.id);

        comment.likes.push(like._id);
        comment.save();
      }

      // Success response
      res.status(200).json({ message: 'Like created', success: true });
    }
  } catch (err) {
    // Failure response
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

unlike = async (req, res) => {
  try {
    if (req.query.on === 'Post') {
      // Delete like on post
      const post = await Post.findById(req.query.id).populate({
        path: 'likes',
        populate: {
          path: 'createdBy',
          select: { _id: 1 },
        },
        select: { _id: 1 },
      });
      let likeId = null;
      post.likes.map((like) => {
        if (req.user._id.equals(like.createdBy._id)) {
          likeId = like._id;
        }
      });
      post.likes.pull(likeId);
      post.save();

      // Delete like document for post
      await Like.findByIdAndDelete(likeId);
    } else if (req.query.on === 'Comment') {
      // Delete like on comment
      const comment = await Comment.findById(req.query.id).populate({
        path: 'likes',
        populate: {
          path: 'createdBy',
          select: { _id: 1 },
        },
        select: { _id: 1 },
      });
      let likeId = null;
      comment.likes.map((like) => {
        if (req.user._id.equals(like.createdBy._id)) {
          likeId = like._id;
        }
      });
      comment.likes.pull(likeId);
      comment.save();

      // Delete like document for comment
      await Like.findByIdAndDelete(likeId);
    }
    // Success response
    return res.status(200).json({ message: 'Unliked', success: true });
  } catch (err) {
    // Failure response
    console.log(err);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', success: false });
  }
};

module.exports = { createLike, unlike };
