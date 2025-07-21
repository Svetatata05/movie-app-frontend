import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

interface UserState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  token: null,
  loading: false,
  error: null,
};

interface RegisterParams {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  status: number;
}

// Реєстрація користувача
export const registerUser = createAsyncThunk<
  string,
  RegisterParams,
  { rejectValue: string }
>(
  'user/registerUser',
  async ({ email, name, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/users`, {
        email,
        name,
        password,
        confirmPassword,
      });

      // Перевіряємо, що токен є у відповіді
      if (!response.data.token) {
        return rejectWithValue('Токен не отримано');
      }

      return response.data.token;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message;
        return rejectWithValue(msg);
      }
      return rejectWithValue('Невідома помилка при реєстрації');
    }
  }
);

// Логін користувача — використовуємо /sessions
export const loginUser = createAsyncThunk<
  string,
  LoginParams,
  { rejectValue: string }
>(
  'user/loginUser',
  
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/sessions`, {
        email,
        password,
      });
      console.log('loginUser response:', response.data);

      if (!response.data.token) {
        return rejectWithValue('Токен не отримано');
      }

      return response.data.token;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message;
        return rejectWithValue(msg);
      }
      return rejectWithValue('Невідома помилка при логіні');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Реєстрація
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Помилка при реєстрації';
      })
      // Логін
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Помилка при логіні';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
