export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload
      };

    case "LOGOUT":
      return {
        user: null
      };

    case "AUTH_IS_READY":
      return {
        ...state,
        user: action.payload,
        authIsReady: true
      };

    default:
      return state;
  }
};