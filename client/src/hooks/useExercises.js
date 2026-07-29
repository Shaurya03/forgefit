import { authFetch } from "../services/api";
import { useExerciseContext } from "./useExerciseContext";
import { useWorkoutContext } from "./useWorkoutContext";
import { useAuthContext } from "./useAuthContext";

export const useExercises = () => {
  const { exercises, dispatch } = useExerciseContext();
  const { dispatch: workoutDispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const fetchExercises = async () => {
    if (!user) return;

    const response = await authFetch("/api/exercises", {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({
        type: "SET_EXERCISES",
        payload: json
      });
    }
  };

  const createExercise = async (exerciseData) => {
    if (!user) return;

    const response = await authFetch("/api/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(exerciseData)
    });

    const json = await response.json();

    if (!response.ok) {
      throw json;
    }

    if (response.ok) {
      dispatch({
        type: "CREATE_EXERCISE",
        payload: json
      });

      return json;
    }
  };

  const updateExercise = async (id, exerciseData) => {
    if (!user) return;

    const response = await authFetch(`/api/exercises/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(exerciseData)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    dispatch({
      type: "UPDATE_EXERCISE",
      payload: json
    });

    return json;
  };

  const deleteExercise = async (id) => {
    if (!user) return;

    const response = await authFetch(`/api/exercises/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    const workoutsResponse = await authFetch("/api/workouts", {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const workouts = await workoutsResponse.json();

    if (workoutsResponse.ok) {
      workoutDispatch({
        type: "SET_WORKOUTS",
        payload: workouts
      });
    }

    dispatch({
      type: "DELETE_EXERCISE",
      payload: id
    });

    return json;
  };

  return {
    exercises,
    fetchExercises,
    createExercise,
    updateExercise,
    deleteExercise
  };
};
