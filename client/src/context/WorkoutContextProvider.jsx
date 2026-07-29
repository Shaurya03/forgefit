import { useEffect, useReducer } from "react";
import { workoutReducer } from "./workoutReducer";
import { workoutContext } from "./workoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL, authFetch } from "../services/api";

export const WorkoutContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, {
    workouts: [],
    isLoading: false,
    error: null
  });
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {

      dispatch({
        type: "SET_WORKOUTS",
        payload: []
      });

      return;
    }

    dispatch({ type: "SET_LOADING" });

    const fetchWorkouts = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/workouts`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const json = await response.json();

        if (!response.ok) {
          dispatch({
            type: "SET_ERROR",
            payload: json.error
          });

          return;
        }

        dispatch({
          type: "SET_WORKOUTS",
          payload: json
        });

      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to fetch workouts"
        });
      }
    }

    fetchWorkouts();
  }, [user, dispatch]);

  return (
    <workoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </workoutContext.Provider>
  );
};