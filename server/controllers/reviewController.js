const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const reviewModel = require("../models/reviewModel");

const getReviewsCoach = async (req, res, next) => {
  const { coachId } = req.params;
  if (!coachId || isNaN(coachId)) {
    return next(new AppError("Please provide a coach id", 400));
  }
  const reviews = await reviewModel.getReviewsByCoachId(coachId);
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
};

const getReviewsTrainee = async (req, res, next) => {
  const { traineeId } = req.params;
  if (!traineeId || isNaN(traineeId)) {
    return next(new AppError("Please provide a trainee id", 400));
  }
  const reviews = await reviewModel.getReviewsByTraineeId(traineeId);
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
};

const getCoachRate = async (req, res, next) => {
  const { coachId } = req.params;
  if (!coachId || isNaN(coachId)) {
    return next(new AppError("Please provide a coach id", 400));
  }
  const rate = await reviewModel.getTotalCoachRate(coachId);
  res.status(200).json({
    status: "success",
    data: {
      rate,
    },
  });
};

const createReview = async (req, res, next) => {
  const { trainer_id, trainee_id, content, stars } = req.body;

  if (isNaN(Number(stars)) || Number(stars) <= 0) {
  }

  const reviews = await reviewModel.createReview(
    trainer_id,
    trainee_id,
    content,
    stars
  );
  res.status(201).json({
    status: "success",
    data: {
      reviews,
    },
  });
};

const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  if (!reviewId || isNaN(reviewId)) {
    return next(new AppError("Please provide a review id", 400));
  }
  await reviewModel.deleteReview(reviewId);
  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
};

const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { content, stars } = req.body;

  if (!reviewId || isNaN(reviewId)) {
    return next(new AppError("Please provide a review id", 400));
  }

  const review = await reviewModel.updateReview(reviewId, content, stars);

  res.status(200).json({
    status: "success",
    message: "Review updated successfully",
    data: { review },
  });
};

const getReviewByReviewId = async (req, res, next) => {
  const { reviewId } = req.params;
  if (!reviewId || isNaN(reviewId)) {
    return next(new AppError("Please provide a review id", 400));
  }
  const review = await reviewModel.getReviewsByReviewId(reviewId);
  res.status(200).json({
    status: "success",
    data: {
      review
    },
  });
};

module.exports = {
  getReviewsCoach: catchAsync(getReviewsCoach),
  createReview: catchAsync(createReview),
  getCoachRate: catchAsync(getCoachRate),
  getReviewsTrainee: catchAsync(getReviewsTrainee),
  deleteReview: catchAsync(deleteReview),
  updateReview: catchAsync(updateReview),
  getReviewByReviewId: catchAsync(getReviewByReviewId),
};
