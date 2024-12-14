const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const workoutModel = require("../models/workoutModel");

const createWorkout = async (req, res, next) => {
  const { name, _note, trainer_id, exercises } = req.body;

  const workout = await workoutModel.createWorkout(
    trainer_id,
    name,
    _note,
    exercises
  );
  res.status(201).json({
    status: "success",
    data: {
      workout,
    },
  });
};

const getWorkoutsCoach = async (req, res, next) => {
  const { coachId } = req.params;
  if (!coachId || isNaN(coachId)) {
    return next(new AppError("Please provide a coach id", 400));
  }
  const workouts = await workoutModel.getWorkoutsByCoachId(coachId);
  res.status(200).json({
    status: "success",
    data: {
      workouts,
    },
  });
};

const getCurrentWorkoutByTraineeId = async (req, res, next) => {
  const { traineeId } = req.params;
  if (!traineeId || isNaN(traineeId)) {
    return next(new AppError("Please provide a trainee id", 400));
  }
  const workout = await workoutModel.getCurrentWorkoutByTraineeId(traineeId);
  res.status(200).json({
    status: "success",
    data: {
      workout,
    },
  });
};

module.exports = {
  createWorkout: catchAsync(createWorkout),
  getWorkoutsCoach: catchAsync(getWorkoutsCoach),
  getCurrentWorkoutByTraineeId: catchAsync(getCurrentWorkoutByTraineeId)
};
