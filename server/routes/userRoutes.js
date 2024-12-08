const db = require("../db");
const router = require("express").Router();
const authController = require("../controllers/authController");
const userModel = require("../models/userModel");
const convertToSnakeCase = require("../middlewares/camelToSnakeMiddleware");
const packageRouter = require("./packageRoute");
const ingredientRouter = require("./ingredientRoute");
const exerciseRouter = require("./exerciseRoute");

//for testing without opening pgAdmin (getting all users)
router.get("/", async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      users: await userModel.getAllUsers(),
    },
  });
});

//auth routes
router.post("/login", authController.login);
router.post("/signup", convertToSnakeCase, authController.signup);
router.get("/logout", authController.logout);

//coach packages
router.use("/:coachId/packages", packageRouter);
router.use("/:coachId/exercises", exerciseRouter);
router.use("/:coachId/ingredients", ingredientRouter);

module.exports = router;

// /users/:id/packages
// /packages
