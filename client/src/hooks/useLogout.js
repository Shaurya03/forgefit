import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useSettingsContext } from "./useSettingsContext";
import { useWorkoutContext } from "./useWorkoutContext";
import { useCategoryContext } from "./useCategoryContext";
import { useExerciseContext } from "./useExerciseContext";
import { SESSION_CATEGORY_KEY, SESSION_EXERCISE_KEY } from "../pages/Exercises";

export const useLogout = () => {
  const navigate = useNavigate();
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: settingsDispatch } = useSettingsContext();
  const { dispatch: workoutDispatch } = useWorkoutContext();
  const { dispatch: categoryDispatch } = useCategoryContext();
  const { dispatch: exerciseDispatch } = useExerciseContext();

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem(SESSION_CATEGORY_KEY);
    sessionStorage.removeItem(SESSION_EXERCISE_KEY);

    document.documentElement.removeAttribute('data-theme');

    authDispatch({ type: 'LOGOUT' });

    settingsDispatch({
      type: "SET_SETTINGS",
      payload: null
    });

    workoutDispatch({
      type: "SET_WORKOUTS",
      payload: []
    });

    categoryDispatch({
      type: "SET_CATEGORIES",
      payload: []
    });

    exerciseDispatch({
      type: "SET_EXERCISES",
      payload: []
    });

    navigate('/');
  };

  return { logout };
};