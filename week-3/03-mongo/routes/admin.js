const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { User, Course, Admin } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    const { username, password } = req.body;
    new Admin({ username, password }).save()
        .then(() => {
            res.json({ message: 'Admin created successfully' });
        })
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    const { title, description, price, imageLink } = req.body;
    new Course({title, description, price, imageLink, published: true})
    .save()
    .then((doc) => {
        res.json({ message: 'Course created successfully', courseId: doc._id });
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find();
    res.json({courses});
});

module.exports = router;