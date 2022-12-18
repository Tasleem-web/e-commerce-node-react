const Products = require('../models/product');

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filtering() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'limit', 'sort'];
        excludedFields.forEach(el => delete (queryObj[el]));
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match); // operators prefix with $ in mongodb
        this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log({ sortBy });
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;  // 3
        const limit = this.queryString.limit * 1 || 3; // 3
        const skip = (page - 1) * limit; // 3-1 * 3 = 6
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const filter = new APIFeatures(Products.find(), req.query)
                .filtering()
                .sorting()
                .paginating();
            const products = await filter.query;

            return res.json({ status: 'success', results: products.length, products })
            // return res.status(200).json({ message: products });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    addProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ message: "No image upload." })

            const product = await Products.findOne({ product_id });

            if (product) return res.status(400).json({ message: "This product is already exists." })

            const newProduct = await Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })

            await newProduct.save();
            return res.status(500).json({ message: "Product is created.", product: newProduct });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const deleteProduct = await Products.findByIdAndDelete(id);
            if (!deleteProduct) return res.status(400).json({ message: "Product is not found." });
            return res.status(200).json({ message: "Product is Deleted." });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            console.log('update product');
            const { id } = req.params;

            const { product_id, title, price, description, content, images, category, checked, sold } = req.body;

            await Products.findByIdAndUpdate({ _id: id }, {
                product_id, title: title.toLowerCase(), price, description, content, images, category, checked, sold
            })

            return res.status(200).json({ message: "Product has been updated" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

module.exports = productCtrl;