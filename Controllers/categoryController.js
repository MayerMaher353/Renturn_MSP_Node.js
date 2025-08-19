const Category = require("../Models/categoryModel");

// get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });  
  }
};

// create new category
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// get specific Category
exports.getCategory = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
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
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ status: "fail", message: "Category not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

