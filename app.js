const express = require('express');
const app = express();
app.use(express.json());

let users = [];
let posts = [];


app.post('/register', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Both username and email are required' });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = { username, email, id: users.length + 1, following: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});


app.post('/post', (req, res) => {
  const { userId, content } = req.body;

  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newPost = { userId, content, id: posts.length + 1 };
  posts.push(newPost);
  res.status(201).json(newPost);
});


app.post('/follow', (req, res) => {
  const { followerId, followeeId } = req.body;

  const follower = users.find(user => user.id === followerId);
  const followee = users.find(user => user.id === followeeId);

  if (!follower || !followee) {
    return res.status(404).json({ error: 'User(s) not found' });
  }

  if (follower.following.includes(followeeId)) {
    return res.status(400).json({ error: 'User already followed' });
  }

  follower.following.push(followeeId);
  res.status(200).json({ message: 'User followed successfully' });
});


app.post('/unfollow', (req, res) => {
  const { followerId, followeeId } = req.body;

  const follower = users.find(user => user.id === followerId);
  if (!follower) {
    return res.status(404).json({ error: 'Follower not found' });
  }

  if (!follower.following.includes(followeeId)) {
    return res.status(400).json({ error: 'User not followed' });
  }

  follower.following = follower.following.filter(id => id !== followeeId);
  res.status(200).json({ message: 'User unfollowed successfully' });
});


app.get('/profile/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userPosts = posts.filter(post => post.userId === userId);
  const userProfile = { ...user, posts: userPosts };
  res.json(userProfile);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
