const Category = require("../Models/categoryModel");
const asyncHandler = require("express-async-handler");

// get all categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

// create new category
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: category,
  });
});

// get specific Category
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res
      .status(404)
      .json({ status: "fail", message: "Category not found" });
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// Update category
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return res
      .status(404)
      .json({ status: "fail", message: "Category not found" });
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// Delete category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res
      .status(404)
      .json({ status: "fail", message: "Category not found" });
  }
  res.status(200).json({ status: "success", data: null });
});
