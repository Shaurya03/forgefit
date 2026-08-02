import { useSettingsContext } from "./useSettingsContext";
import { authFetch } from "../services/api";
import { useAuthContext } from "./useAuthContext";
import { API_BASE_URL } from "../services/api";

export const useSettings = () => {

  const {
    settings,
    dispatch
  } = useSettingsContext();

  const { user } = useAuthContext();

  const applyTheme = (theme) => {

    if (theme === "light") {

      document.documentElement.setAttribute(
        "data-theme",
        "light"
      );
    } else {

      document.documentElement.removeAttribute(
        "data-theme"
      );
    }
  };

  const fetchSettings = async () => {

    if (!user) return;

    const response = await authFetch(
      `${API_BASE_URL}/settings`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const json = await response.json();

    if (response.ok) {

      applyTheme(json.theme);

      dispatch({
        type: "SET_SETTINGS",
        payload: json
      });

    }

  };

  const updateSettings = async (
    settingsData
  ) => {

    if (!user) return;

    const response = await authFetch(
      `${API_BASE_URL}/settings`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(
          settingsData
        )
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    applyTheme(json.theme);

    dispatch({
      type: "UPDATE_SETTINGS",
      payload: json
    });

    return json;

  };

  return {
    settings,
    fetchSettings,
    updateSettings
  };

};