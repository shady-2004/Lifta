const db = require("../db");
const express = require("express");
const router = express.Router({ mergeParams: true }); // Enable mergeParams
const mealController = require("../controllers/mealController");
const ingredientRouter = require("./ingredientRoute");
const convertCamelToSnake = require("../middlewares/camelToSnakeMiddleware");
const sanitizeEmptyFields = require("../middlewares/sanitizeEmptyFields");

router.get("/", (req, res, next) => {
  return mealController.getCurrentMealsByTraineeId(req, res, next);
});

router.post(
    "/",
    convertCamelToSnake,
    sanitizeEmptyFields,
    mealController.addDoneMeal
  );

router.use("/:mealId/ingredients", ingredientRouter);

module.exports = router;
