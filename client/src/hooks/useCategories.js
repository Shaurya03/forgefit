import { authFetch } from "../services/api";
import { useCategoryContext } from "./useCategoryContext";
import { useAuthContext } from "./useAuthContext";
import { API_BASE_URL } from "../services/api";

export const useCategories = () => {
  const { categories, dispatch } = useCategoryContext();
  const { user } = useAuthContext();

  const fetchCategories = async () => {
    if (!user) return;

    const response = await authFetch(`${API_BASE_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({
        type: "SET_CATEGORIES",
        payload: json
      });
    }
  };

  const createCategory = async (categoryData) => {
    if (!user) return;

    const response = await authFetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(categoryData)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    if (response.ok) {
      dispatch({
        type: "CREATE_CATEGORY",
        payload: json
      });

      return json;
    }
  };

  const updateCategory = async (id, categoryData) => {
    if (!user) return;

    const response = await authFetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(categoryData)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    dispatch({
      type: "UPDATE_CATEGORY",
      payload: json
    });

    return json;
  };

  const deleteCategory = async (id) => {
    if (!user) return;

    const response = await authFetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (!response.ok) {
      throw json;
    }

    dispatch({
      type: "DELETE_CATEGORY",
      payload: json
    });

    return json;
  };

  return {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
};