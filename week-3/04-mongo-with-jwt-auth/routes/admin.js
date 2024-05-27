const { Router } = require("express");
const jwt = require("jsonwebtoken");
const z = require("zod");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const { getJwtSecret } = require("../util/Env");

const router = Router();

const adminSchema = z.object({
    username: z.string().min(5, { message: 'Username should be atleast 5 characters long' }),
    password: z.string().min(8, { message: 'Password should be atleast 8 characters long' }),
});
const courseSchema = z.object({
    title: z.string().min(5, { message: 'Title should be atleast 5 characters long' }),
    description: z.string().min(30, { message: 'Description should be atleast 50 characters long' }),
    price: z.number(),
    imageLink: z.string().url(),
});

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    try {
        const admin = adminSchema.safeParse(req.body);
        await new Admin(admin).save();
        return res.status(200).json({ message: 'Admin created successfully' });
    } catch (error) {
        return res.status(400).json({message: error.issues[0].message});
    }
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    try {
        const username = req.body.username;
        const password = req.body.password;
        const admin = await Admin.findOne({username, password});
        if(!admin) {
            return res.status("401").json({message: "Unauthorized: User not found!"});
        }
        const token = jwt.sign({adminId: admin._id}, getJwtSecret(), { expiresIn: "1d" });
        res.status(200).json({token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Error"});
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    try {
        const course = courseSchema.safeParse(req.body);
        const newCourse = await Course.create(course.data);
        newCourse.published = true;
        await newCourse.save();
        return res.status(200).json({ message: 'Course created successfully', courseId: newCourse._id });
    } catch (error) {
        return res.status(400).json({message: error.issues[0].message});
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});
    res.status(200).json({courses});
});

module.exports = router;