//any helper functions in the utils folder
const validator = require("validator");
const AppError = require("../utils/AppError");
const { hashPassword, validatePassword } = require("../utils/hashPassword");
const createToken = require("../utils/createToken");
const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const getUserById = async (req, res) => {
  const userId = req.params.userId;

  const user = await userModel.SelectUserById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    userId: userId,
    userName: user["first_name"] + " " + user["last_name"],
    userType: user["type"],
    userBio: user["bio"],
    userPhoto: user["photo"],
  });
};

const checkAuth = async (req, res) => {
  // Retrieve the token from the cookies
  const token = req.cookies.jwt;

  // If no token is found, return an error response
  if (!token) {
    return res.status(401).json({
      isAuthenticated: false,
      userId: "",
      userType: "",
      message: "No token provided",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const is_banned = await userModel.isBanned(decoded.user_id);
    // Extract userId and userType from the token payload
    const { user_id, type } = decoded;

    // Respond with user information
    return res.status(200).json({
      isAuthenticated: true,
      userId: user_id,
      userType: type,
      is_banned: is_banned,
    });
  } catch (err) {
    // Handle invalid or expired tokens
    console.error("Token verification failed:", err.message);
    return res.status(401).json({
      isAuthenticated: false,
      userId: "",
      userType: "",
      message: "Invalid or expired token",
    });
  }
};

// Log-In
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email))
    return next(new AppError("Please enter a valid Email", 400));

  const user = await userModel.SelectUserByEmail(email);

  if (!user) return next(new AppError("User not found", 404));

  if (!(await validatePassword(password, user["password"])))
    return next(new AppError("Incorrect password", 401));

  if (user.type === "Admin") {
    //jwt token by cookie
    const payload = {
      user_id: user.user_id,
      email: user.email,
      type: user.type,
    };

    const token = createToken(payload);
    res.cookie("jwt", token);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          ...user,
        },
        token: JSON.parse(atob(token.split(".")[1])),
      },
    });
    return;
  }
  const userRest = await userModel.SelectTraineeOrTrainerById(
    user.user_id,
    user.type.toLowerCase()
  );
  //jwt token by cookie
  const payload = {
    user_id: user.user_id,
    email: user.email,
    type: user.type,
  };

  const token = createToken(payload);
  res.cookie("jwt", token);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        ...user,
        ...userRest,
      },
      token: JSON.parse(atob(token.split(".")[1])),
    },
  });
};

// Sign-Up
const signup = async (req, res, next) => {
  const {
    email,
    first_name,
    last_name,
    password,
    gender,
    bio,
    phone_number,
    type,
    photo,
    birth_date,
  } = req.body;
  if (
    !first_name ||
    first_name.trim().length < 3 ||
    first_name.trim().length > 30 ||
    !validator.isAlpha(first_name.trim().replace(/\s/g, ""))
  ) {
    return next(
      new AppError(
        "First name should contain only letters and be 3-30 characters",
        400
      )
    );
  }

  if (
    !last_name ||
    last_name.trim().length < 3 ||
    last_name.trim().length > 30 ||
    !validator.isAlpha(last_name.trim().replace(/\s/g, ""))
  ) {
    return next(
      new AppError(
        "Last name should contain only letters and be 3-30 characters",
        400
      )
    );
  }

  // Phone number validation

  const phoneRegex = /^01\d{9}$/;

  if (!phoneRegex.test(phone_number)) {
    return next(
      new AppError(
        "Phone number should be exactly 11 digits and start with '01'",
        400
      )
    );
  }

  const age = moment().diff(moment(birth_date, "YYYY-MM-DD"), "years");

  if (age < 18) {
    return next(new AppError("You must be at least 18 years old", 400));
  }

  let food_allergies,
    workout_preferences,
    weight,
    height,
    goal,
    experience_years,
    client_limit,
    title,
    certificate_photo,
    description,
    date_issued;

  if (type === "Trainee") {
    ({ food_allergies, workout_preferences, weight, height, goal } = req.body);
    if (isNaN(weight) || weight <= 30 || weight > 300) {
      return next(
        new AppError("Weight must be a valid number between 30 and 300", 400)
      );
    }

    if (isNaN(height) || height <= 100 || height > 220) {
      return next(
        new AppError(
          "Height must be a valid number between 100 and 220 cm",
          400
        )
      );
    }
  } else {
    ({
      experience_years,
      client_limit,
      title,
      certificate_photo,
      description,
      date_issued,
    } = req.body);

    if (
      isNaN(experience_years) ||
      experience_years < 0 ||
      experience_years > 30
    ) {
      return next(
        new AppError(
          "Experience years must be a valid number between 0 and 30",
          400
        )
      );
    }

    // Validate client_limit
    if (isNaN(client_limit) || client_limit < 1 || client_limit > 99) {
      return next(
        new AppError(
          "Client limit must be a valid number between 1 and 99",
          400
        )
      );
    }
    if (
      title &&
      (title.trim().length < 3 ||
        title.trim().length > 25 ||
        !validator.isAlpha(title.trim().replace(/\s/g, "")))
    ) {
      return next(
        new AppError(
          "Certificate Title name should contain only letters and be 3-25 characters",
          400
        )
      );
    }
  }

  if (!validator.isEmail(email))
    return next(new AppError("Please enter a valid Email", 400));

  const passwordHashed = await hashPassword(password);
  const values = [
    email,
    first_name,
    last_name,
    passwordHashed,
    gender,
    bio,
    phone_number,
    type,
    photo,
    birth_date,
  ];
  type === "Trainee"
    ? values.push(food_allergies, weight, height, goal, workout_preferences)
    : values.push(
        experience_years,
        client_limit,
        title,
        certificate_photo,
        description,
        date_issued
      );
  const userId = await userModel.AddUser(values);

  //jwt token by cookie
  const payload = {
    user_id: userId,
    email: email,
    type: type,
  };

  const token = createToken(payload);
  res.cookie("jwt", token);

  res.status(200).json({
    status: "success",
    data: {
      token: JSON.parse(atob(token.split(".")[1])),
    },
  });
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const {
    email,
    first_name,
    last_name,
    password,
    oldPassword,
    newPassword,
    bio,
    phone_number,
    type,
    photo,
  } = req.body;

  let food_allergies,
    workout_preferences,
    weight,
    height,
    goal,
    experience_years,
    client_limit;
  if (type === "Trainee") {
    ({ food_allergies, workout_preferences, weight, height, goal } = req.body);
  } else if (type === "Trainer") {
    ({ experience_years, client_limit } = req.body);
    if (experience_years === "") experience_years = 0;
    if (client_limit === "" || client_limit <= 0) {
      return next(new AppError("Please enter a positive Number", 400));
    }
  }
  const phoneRegex = /^01\d{9}$/; // Matches "01" followed by 9 digits (11 total)

  if (!phoneRegex.test(phone_number)) {
    return next(new AppError("Numbers from 0 to 9 and start by '01'", 400));
  }
  if (!validator.isEmail(email))
    return next(new AppError("Please enter a valid Email", 400));

  if (oldPassword && !(await validatePassword(oldPassword, password)))
    return next(new AppError("Incorrect password", 401));
  const passwordHashed = oldPassword
    ? await hashPassword(newPassword)
    : password;

  const values = [
    email,
    first_name,
    last_name,
    passwordHashed,
    bio,
    phone_number,
    photo,
    type,
    userId,
  ];
  type === "Trainee"
    ? values.push(food_allergies, weight, height, goal, workout_preferences)
    : type === "Trainer"
      ? values.push(experience_years, client_limit)
      : values;

  const user = await userModel.updateUser(values);

  res.status(200).json({
    status: "success",
    user: user,
  });
};

//Create Account for Admin only

const createAccount = async (req, res, next) => {
  const {
    email,
    first_name,
    last_name,
    password,
    gender,
    bio,
    phone_number,
    type,
    photo,
    birth_date,
  } = req.body;

  if (!validator.isAlpha(first_name.replace(/\s/g, ""))) {
    return next(new AppError("First name should contain only letters", 400));
  }

  if (!validator.isAlpha(last_name.replace(/\s/g, ""))) {
    return next(new AppError("Last name should contain only letters", 400));
  }

  // Phone number validation
  const phoneRegex = /^01\d{9}$/;
  if (!phoneRegex.test(phone_number)) {
    return next(new AppError("Numbers from 0 to 9 and start by '01'", 400));
  }

  let food_allergies,
    workout_preferences,
    weight,
    height,
    goal,
    experience_years,
    client_limit,
    title,
    certificate_photo,
    description,
    date_issued;
  if (type === "Trainee") {
    ({ food_allergies, workout_preferences, weight, height, goal } = req.body);
  } else if (type === "Trainer") {
    ({
      experience_years,
      client_limit,
      title,
      certificate_photo,
      description,
      date_issued,
    } = req.body);

    if (title && !validator.isAlpha(title.replace(/\s/g, ""))) {
      return next(
        new AppError("Certificate Title name should contain only letters", 400)
      );
    }
  }

  if (!validator.isEmail(email))
    return next(new AppError("Please enter a valid Email", 400));

  const passwordHashed = await hashPassword(password);
  const values = [
    email,
    first_name,
    last_name,
    passwordHashed,
    gender,
    bio,
    phone_number,
    type,
    photo,
    birth_date,
  ];

  if (type === "Trainee") {
    values.push(food_allergies, weight, height, goal, workout_preferences);
  } else if (type === "Trainer") {
    values.push(
      experience_years,
      client_limit,
      title,
      certificate_photo,
      description,
      date_issued
    );
  }

  const userId = await userModel.AddUser(values);

  res.status(200).json({
    status: "success",
    data: {
      userId,
    },
  });
};

// Log-out => Reset Cookie

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/users");
};

module.exports = {
  getUserById,
  checkAuth,
  login: catchAsync(login),
  signup: catchAsync(signup),
  updateUser: catchAsync(updateUser),
  createAccount: catchAsync(createAccount),
  logout,
};
