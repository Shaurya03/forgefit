import { useReducer, useEffect } from "react";
import { authReducer } from "./authReducer";
import { authContext } from "./authContext";

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    dispatch({ type: "AUTH_IS_READY", payload: user });
  }, []);

  return (
    <authContext.Provider value={{ ...state, dispatch }}>
      {children}
    </authContext.Provider>
  );
};