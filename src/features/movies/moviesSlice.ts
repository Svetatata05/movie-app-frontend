import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import { Movie, NewMovie } from './types';

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

interface ApiError {
  status?: number;
  error?: {
    message?: string;
    [key: string]: any;
  };
}

export const fetchMovies = createAsyncThunk<Movie[], void, { rejectValue: string }>(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/movies');
      const rawData = res.data;

      if ((rawData as ApiError).status === 0) {
        return rejectWithValue((rawData as ApiError).error?.message || 'Помилка сервера');
      }

      const rawMovies = Array.isArray(rawData.data) ? rawData.data : [];

      if (!Array.isArray(rawMovies)) {
        return rejectWithValue('Невірний формат даних фільмів');
      }

      const movies: Movie[] = rawMovies.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        format: movie.format,
        actors: Array.isArray(movie.actors) ? movie.actors : [],
      }));

      return movies.sort((a, b) => a.title.localeCompare(b.title));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue('Невідома помилка при завантаженні фільмів');
    }
  }
);

export const addMovie = createAsyncThunk<Movie, NewMovie, { rejectValue: string }>(
  'movies/addMovie',
  async (newMovie, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/movies', newMovie);
      const data = res.data;

      if ((data as ApiError).status === 0) {
        return rejectWithValue((data as ApiError).error?.message || 'Помилка сервера');
      }

      const addedMovieRaw = data.data;

      const addedMovie: Movie = {
        id: addedMovieRaw.id,
        title: addedMovieRaw.title,
        year: addedMovieRaw.year,
        format: addedMovieRaw.format,
        actors: Array.isArray(addedMovieRaw.actors)
          ? addedMovieRaw.actors.map((actor: any) => actor.name)
          : [],
      };

      return addedMovie;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue('Невідома помилка при додаванні фільму');
    }
  }
);

export const deleteMovie = createAsyncThunk<number, number, { rejectValue: string }>(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/movies/${id}`);
      return id;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue('Невідома помилка при видаленні фільму');
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Помилка завантаження фільмів';
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        const exists = state.movies.find(m => m.id === action.payload.id);
        if (!exists) {
          state.movies.push(action.payload);
          state.movies.sort((a, b) => a.title.localeCompare(b.title));
        }
      })
      
      .addCase(addMovie.rejected, (state, action) => {
        state.error = action.payload || 'Помилка додавання фільму';
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.error = action.payload || 'Помилка видалення фільму';
      });
  },
});

export default moviesSlice.reducer;
