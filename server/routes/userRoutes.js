const db = require("../db");
const router = require("express").Router();
const authController = require("../controllers/authController");
const userModel = require("../models/userModel");
const convertToSnakeCase = require("../middlewares/camelToSnakeMiddleware");
const packageRouter = require("./packageRoute");
const ingredientRouter = require("./ingredientRoute");
const exerciseRouter = require("./exerciseRoute");
const reviewRouter = require("./reviewRoute");
const certificateRouter = require("./certificateRoute");
const workoutRouter = require("./workoutRoute");
const mealRouter = require("./mealRoute");
const adminController = require("../controllers/adminController");

//for testing without opening pgAdmin (getting all users)
router.get("/", async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      users: await userModel.getAllUsers(),
    },
  });
});

//Admin routes
router.get("/coaches", async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      coaches: await userModel.getAllCoaches(),
    },
  });
});

router.get("/trainees", async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      trainees: await userModel.getAllTrainees(),
    },
  });
});

router.delete("/:userId", adminController.deleteUserByUserId);

//auth routes
router.post("/login", authController.login);
router.post("/signup", convertToSnakeCase, authController.signup);
router.get("/logout", authController.logout);
router.get("/checkAuth", authController.checkAuth);
router.get("/:userId", authController.getUserById);
//coach packages
router.use("/:coachId/packages", packageRouter);
router.use("/:coachId/exercises", exerciseRouter);
router.use("/:coachId/ingredients", ingredientRouter);
router.use("/:coachId/reviews", reviewRouter);
router.use("/:coachId/certificates", certificateRouter);
router.use("/:coachId/workouts", workoutRouter);
router.use("/:nutritionistId/meals", mealRouter);

module.exports = router;

// /users/:id/packages
// /packages
