const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const { username, password } = req.body;
    new User({ username, password })
        .save()
        .then(() => {
            res.json({ message: 'User created successfully' });
        });
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find();
    res.json({ courses });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const { username, password } = req.headers;
    const courseId = req.query["courseId"];

    await User.updateOne({ username, password }, { $push: { purchasedCourses: courseId } })

    res.json({ message: 'Course purchased successfully' });
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const {username, password} = req.headers;
    const user = await User.findOne({username, password});

    const purchasedCourses = await Course.find({
        _id: {
            $in: user.purchasedCourses
        }
    });

    res.json({purchasedCourses});
});

module.exports = router