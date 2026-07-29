export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const authFetch = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("user");

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
};