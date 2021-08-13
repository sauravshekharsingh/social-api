const Post = require('../../models/post');
const Comment = require('../../models/comment');

// Create a comment
createComment = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      createdBy: req.user._id,
      onPost: req.query.postId,
    });

    await comment.save();

    const post = await Post.findById(req.query.postId)
      .then((post) => {
        post.comments.push(comment._id);
        post.save();
      })
      .catch((err) => {
        console.log(err);
      });

    res.status(200).json({ message: 'Comment created', success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

module.exports = { createComment };
