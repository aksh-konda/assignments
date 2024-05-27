const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user");


mongoose.connect('mongodb+srv://iamak:c3VBojyhJTcZB7bi@helloworld.0bchp5b.mongodb.net/100xweek3');

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter)
app.use("/user", userRouter)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
