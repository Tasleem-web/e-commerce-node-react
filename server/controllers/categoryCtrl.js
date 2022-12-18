const Category = require('../models/categoryModel');

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            return res.status(200).json({ categories })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body;

            const category = await Category.findOne({ name });
            if (category) return res.status(500).json({ message: "This Category is already exists" });

            const newCategory = new Category({ name });

            await newCategory.save();

            return res.status(200).json({ message: "Created a Category" });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            await Category.findByIdAndDelete(id);

            return res.status(200).json({ message: "Category is Deleted" });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const { id } = req.params;

            await Category.findByIdAndUpdate({ _id: id }, { name });
            return res.status(200).json({ message: "Category is Updated" });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
module.exports = categoryCtrl;