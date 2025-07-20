import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '../../app/store';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const incrementAsync = createAsyncThunk(
  'counter/incrementAsync',
  async (amount: number) => {
    return new Promise<number>((resolve) =>
      setTimeout(() => resolve(amount), 1000)
    );
  }
);


export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const incrementIfOdd = (amount: number): any => (dispatch: AppDispatch, getState: () => RootState) => {
  const currentValue = getState().counter.value;
  if (currentValue % 2 !== 0) {
    dispatch(incrementByAmount(amount));
  }
};

export const { increment, decrement, incrementByAmount } = counterSlice.actions;


export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
