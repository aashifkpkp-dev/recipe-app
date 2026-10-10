const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    category: { type: String, default: 'Other' },
    image: { type: String, default: '' },
    cookTime: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);