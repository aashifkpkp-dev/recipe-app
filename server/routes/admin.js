const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.use(auth, admin);

// Dashboard numbers
router.get('/stats', async (req, res) => {
  const [users, recipes] = await Promise.all([
    User.countDocuments(),
    Recipe.countDocuments(),
  ]);
  res.json({ users, recipes });
});

// All users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Delete a user and their recipes
router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.userId)
    return res.status(400).json({ message: "You can't delete yourself" });
  await Recipe.deleteMany({ author: req.params.id });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User and their recipes deleted' });
});

module.exports = router;