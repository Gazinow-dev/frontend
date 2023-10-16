import { configureStore } from '@reduxjs/toolkit';

import auth from '@/store/modules/authModule';

const store = configureStore({
  reducer: {
    auth,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
