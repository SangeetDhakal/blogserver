const Category = require('../models/category');
const Blog = require('../models/blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    const newcategory = new Category({ name, slug });

    newcategory.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);

    });
};
 
exports.list = (req, res) => {
    Category.find({draft: {$ne:true}}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 6;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug })

        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.json(category);
            Blog.find({ categories: category,draft: {$ne:true} })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('postedBy', '_id name')
                .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
                .exec((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    blogs=data
                    res.json({ category: category, blogs: data, size: blogs.length });
                });
        });
};



exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Category deleted successfully'
        });
    });
};
