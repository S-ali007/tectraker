import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  runningProjectId: null,
  startTime: null,
  timer: 0,
  timerId: null,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setStartTimer(state, action) {
      state.startTime = action.payload.startTime;
      state.runningProjectId = action.payload.projectId;
      state.timer = 0;
    },
    incrementTimer(state) {
      state.timer += 1;
    },
    setTimerId(state, action) {
      state.timerId = action.payload;
    },

    setRunningProjectId(state, action) {
      state.runningProjectId = action.payload;
    },
    setStartTime(state, action) {
      state.startTime = action.payload;
    },
    clearTimer(state) {
      clearInterval(state.timerId);
      state.timerId = null;
      state.timer = 0;
      state.startTime = null;
      state.runningProjectId = null;
    },
  },
});

export const {
  setStartTimer,
  incrementTimer,
  setTimerId,
  clearTimer,
  setRunningProjectId,
} = timerSlice.actions;
export default timerSlice.reducer;
