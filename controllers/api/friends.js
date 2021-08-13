const Friend = require('../../models/friends');
const User = require('../../models/user');

// Add friend
addFriend = async (req, res) => {
  let errors = [];
  let user = null;
  try {
    user = await User.findById(req.user._id);

    let isUserFriend = false;
    user.friends.map((friend) => {
      if (friend.equals(req.query.userId)) {
        isUserFriend = true;
      }
    });

    if (!isUserFriend) {
      user.friends.push(req.query.userId);
      await user.save();

      const friendship = new Friend({
        from: req.user._id,
        to: req.query.userId,
      });
      await friendship.save();

      user = await User.findById(req.user._id);
      const friends = user.friends;
      return res.json({ message: 'Friend added', friends, success: true });
    }

    user = await User.findById(req.user._id);
    const friends = user.friends;
    return res.json({ message: 'Friends already', friends, success: true });
  } catch (err) {
    errors.push(err);
    return res.json({ message: 'Error', success: false });
  }
};

// Remove friend
removeFriend = async (req, res) => {
  let errors = [];
  let user = null;

  try {
    user = await User.findById(req.user._id);
    user.friends.pull(req.query.userId);
    await user.save();

    let friend = await Friend.findOne({
      from: req.user._id,
      to: req.query.userId,
    });
    if (friend) {
      await friend.remove();
      user = await User.findById(req.user._id);
      const friends = user.friends;
      return res.json({ message: 'Friend removed', friends, success: true });
    }

    user = await User.findById(req.user._id);
    const friends = user.friends;
    return res.json({ message: 'Friend not exists', friends, success: true });
  } catch (err) {
    errors.push(err);
    return res.json({ message: errors, success: false });
  }
};

const fetchFriends = async (req, res) => {
  let errors = [];
  try {
    const user = await User.findById(req.user._id).populate([
      {
        path: 'friends',
        select: { _id: 1, name: 1, username: 1 },
      },
    ]);
    const friends = user.friends;

    return res.json({ message: 'Fetched friends', friends, success: true });
  } catch (err) {
    errors.push(err);
    return res.json({ message: errors, success: false });
  }
};

module.exports = { addFriend, removeFriend, fetchFriends };
