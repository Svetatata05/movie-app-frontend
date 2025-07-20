import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import moviesReducer from '../features/movies/moviesSlice';
import userReducer from '../features/user/userSlice';

// Додаємо явну типізацію для кореневого стану
export interface RootState {
  movies: ReturnType<typeof moviesReducer>;
  counter: ReturnType<typeof counterReducer>;
  user: ReturnType<typeof userReducer>;
}

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    counter: counterReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;