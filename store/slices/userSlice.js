import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if available
let savedUser = null;
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem("user");
    if (stored) savedUser = JSON.parse(stored);
  } catch (err) {
    console.error("LocalStorage parse error:", err);
  }
}

const initialState = {
  user: savedUser || null,
  role: savedUser?.role || null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, role } = action.payload;
       
      state.user = user;
      state.role = role;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ user, role }));
      }
    },
    clearUser(state) {
      state.user = null;
      state.role = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
