const express = require('express');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all recipes (supports ?search= and ?category=)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const recipes = await Recipe.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my favorite recipes (must be above '/:id')
router.get('/favorites/mine', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'favorites',
      populate: { path: 'author', select: 'name' },
    });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a recipe (login required)
router.post('/', auth, async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, author: req.userId });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a recipe (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (String(recipe.author) !== req.userId)
      return res.status(403).json({ message: 'Not allowed' });

    Object.assign(recipe, req.body, { author: recipe.author });
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a recipe (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (String(recipe.author) !== req.userId)
      return res.status(403).json({ message: 'Not allowed' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle favorite
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const id = req.params.id;
    const has = user.favorites.some((f) => String(f) === id);
    if (has) user.favorites.pull(id);
    else user.favorites.push(id);
    await user.save();
    res.json({ favorited: !has });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;