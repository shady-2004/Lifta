/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LoginForm from "./components/loginForm.jsx";
import SignUpForm from "./components/signUpForm.jsx";
import ProtectedLoggedRoute from "./ProtectedLoggedRoute.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UserProfile from "./components/Userprofile.jsx";
import ProfileSection from "./components/Profilesection.jsx";
import LandingPage from "./components/landingPage.jsx";
import Banned from "./pages/Banned.jsx";
import NotFound from "./pages/Notfound.jsx";
import BrowseCoaches from "./pages/BrowseCoaches.jsx";
import Footer from "./components/Footer.jsx";
import NavBar from "./components/Navbar.jsx";
import BrowseProtectedRoute from "./BrowseProtectedRoute.jsx";
import { TraineeExerciseCard } from "./components/trainee/traineeExerciseCard.jsx";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import "primeicons/primeicons.css";
import { TraineeCurrentWrokout } from "./components/trainee/traineCurrentWorkout.jsx";
import { TraineeMealCard } from "./components/trainee/traineeMealCard.jsx";
import { TraineeCurrentMeals } from "./components/trainee/traineeCurrentMeals.jsx";
import { PackageDashboard } from "./components/packageDashboard.jsx";
import IngredientForm from "./components/coach/IngredientForm.jsx";
import IngredientCard from "./components/coach/ingredientCard.jsx";
import WorkoutCard from "./components/coach/workoutCard.jsx";
import PackageForm from "./components/coach/packageForm.jsx";
import ExerciseForm from "./components/coach/exerciseForm.jsx";
import CreateWorkout from "./components/coach/createWorkout.jsx";
import CreateMeal from "./components/coach/createMeal.jsx";
import AssignWorkout from "./components/coach/assignWorkout.jsx";
import AssignMeal from "./components/coach/assignMeal.jsx";
import Meal from "./components/coach/mealCard.jsx";
import { PackageCard } from "./components/packageCard.jsx";
import { View } from "lucide-react";
import { TraineesList } from "./components/admin/traineesList.jsx";
import { CoachesList } from "./components/admin/coachesList.jsx";
import { AdminStatistics } from "./components/admin/adminStatistics.jsx";

import { ReviewModalForm } from "./components/trainee/reviewModalForm.jsx";
import { CoachReviewCard } from "./components/coach/coachReviewCard.jsx";
import { CoachReviewDashboard } from "./components/coach/coachReviewDashboard.jsx";
import { TraineeReviewCard } from "./components/trainee/traineeReviewCard.jsx";
import { TraineeReviewDashboard } from "./components/trainee/traineeReviewDashboard.jsx";

import AdminUserTypeForm from "./components/admin/adminUserTypeForm.jsx";
import { AdminsList } from "./components/admin/adminsList.jsx";
import Exercises from "./components/coach/Exercises.jsx";

import { PackagesList } from "./components/admin/packagesList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedLoggedRoute>
        <LandingPage />
      </ProtectedLoggedRoute>
    ),
  },
  {
    path: "log-in",
    element: (
      <ProtectedLoggedRoute>
        <LoginForm />
      </ProtectedLoggedRoute>
    ),
  },
  {
    path: "sign-up",
    element: (
      <ProtectedLoggedRoute>
        <SignUpForm isAdmin={0} />
      </ProtectedLoggedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "createWorkout",
    element: (
      <ProtectedRoute>
        <CreateWorkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "createMeal",
    element: (
      <ProtectedRoute>
        <CreateMeal />
      </ProtectedRoute>
    ),
  },
  {
    path: "browse",
    element: (
      <BrowseProtectedRoute>
        <PrimeReactProvider value={{ pt: Tailwind }}>
          <BrowseCoaches />
        </PrimeReactProvider>
      </BrowseProtectedRoute>
    ),
  },
  {
    path: "browse/:coach_id/packages",
    element: (
      <PrimeReactProvider value={{ pt: Tailwind }}>
        <BrowseProtectedRoute>
          <div>
            <NavBar pref="Trainee" />
            <PackageDashboard />
            <Footer />
          </div>
        </BrowseProtectedRoute>
      </PrimeReactProvider>
    ),
  },
  {
    path: "/coach/workouts",
    element: (
      <ProtectedRoute>
        <AssignWorkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/coach/meals",
    element: (
      <ProtectedRoute>
        <AssignMeal />
      </ProtectedRoute>
    ),
  },
  
  {
    path: ":coach_id/profile",
    element: (
        <BrowseProtectedRoute>
          <UserProfile />
        </BrowseProtectedRoute>
    ),
  },
  {
    path: "test",
    element: (
      <PrimeReactProvider value={{ pt: Tailwind }}>
        <PackagesList />
      </PrimeReactProvider>
    ),
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
