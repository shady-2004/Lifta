const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const packageModel = require("../models/packageModel");
const validator = require("validator");
const getAllPackages = async (req, res, next) => {
  const packages = await packageModel.getAllPackages();
  res.status(200).json({
    status: "success",
    data: {
      packages,
    },
  });
};

const getPackage = async (req, res, next) => {
  const { pkgId } = req.params;
  if (!pkgId || isNaN(pkgId)) {
    return next(new AppError("Please provide a package id", 400));
  }
  const package = await packageModel.getPackageById(pkgId);
  res.status(200).json({
    status: "success",
    data: {
      package,
    },
  });
};

const getPackagesCoach = async (req, res, next) => {
  const { coachId } = req.params;
  if (!coachId || isNaN(coachId)) {
    return next(new AppError("Please provide a coach id", 400));
  }
  const packages = await packageModel.getPackagesByCoachId(coachId);
  res.status(200).json({
    status: "success",
    data: {
      packages,
    },
  });
};

const createPackage = async (req, res, next) => {
  const { name, description, price, trainer_id, duration, type } = req.body;

  if (!name || !duration || !price || !trainer_id || !type) {
    return next(new AppError("Please provide all required fields", 400));
  }
  if (!name || !validator.isAlpha(name.trim().replace(/\s/g, ""))) {
    return next(new AppError("Package name should contain only letters", 400));
  }

  if (isNaN(Number(price)) || Number(price) <= 0) {
    return next(new AppError("Please provide a valid price", 400));
  }

  if (isNaN(Number(duration)) || Number(duration) <= 0) {
    return next(new AppError("Please provide a valid duration", 400));
  }

  if (
    !description ||
    description.trim().length < 10 ||
    description.trim().length > 250
  ) {
    return next(
      new AppError("Description must be at least 10 characters", 400)
    );
  }

  const package = await packageModel.createPackage(
    name,
    price,
    trainer_id,
    duration,
    type,
    description,
    (is_active = true)
  );
  res.status(201).json({
    status: "success",
    data: {
      package,
    },
  });
};
const updatePackage = async (req, res, next) => {
  const { price, duration } = req.body;
  const { pkgId } = req.params;
  if (!pkgId || isNaN(pkgId)) {
    return next(new AppError("Please provide a package id", 400));
  }
  if (isNaN(Number(duration)) || Number(duration) <= 0) {
    return next(new AppError("Please provide a valid duration", 400));
  }

  if (isNaN(Number(price)) || Number(price) <= 0) {
    return next(new AppError("Please provide a valid price", 400));
  }
  const package = await packageModel.updatePackage(price, duration, pkgId);
  res.status(200).json({
    status: "success",
    data: {
      package,
    },
  });
};
const toggleActiveState = async (req, res, next) => {
  const { is_active } = req.body;
  const { pkgId } = req.params;
  console.log(req.body);
  if (!pkgId || isNaN(pkgId)) {
    return next(new AppError("Please provide a package id", 400));
  }
  const package = await packageModel.toggleActiveState(pkgId, is_active);
  res.status(200).json({
    status: "success",
    message: "Package updated successfully",
  });
};
const deletePackage = async (req, res, next) => {
  const { package_id } = req.body;
  await packageModel.deletePackage(package_id);
  res.status(200).json({
    status: "success",
    message: "Package deleted successfully",
  });
};

const getTopFivePackages = async (req, res, next) => {
  const packages = await packageModel.getTopFivePackages();
  res.status(200).json({
    status: "success",
    data: {
      packages,
    },
  });
};

const getAvgPrice = async (req, res, next) => {
  const average = await packageModel.getAvgPrice();
  res.status(200).json({
    status: "success",
    data: {
      average,
    },
  });
};

const getPackagesDetails = async (req, res, next) => {
  const packages = await packageModel.getPackagesDetails();
  res.status(200).json({
    status: "success",
    data: {
      packages,
    },
  });
};

module.exports = {
  getAllPackages: catchAsync(getAllPackages),
  getPackagesCoach: catchAsync(getPackagesCoach),
  createPackage: catchAsync(createPackage),
  deletePackage: catchAsync(deletePackage),
  getPackage: catchAsync(getPackage),
  updatePackage: catchAsync(updatePackage),
  getTopFivePackages: catchAsync(getTopFivePackages),
  getAvgPrice: catchAsync(getAvgPrice),
  toggleActiveState: catchAsync(toggleActiveState),
  getPackagesDetails: catchAsync(getPackagesDetails),
};

// /packages
// users/:id/packages
