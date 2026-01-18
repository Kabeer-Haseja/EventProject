import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  getInterestedEvents,
  addInterestedEvent as addToStorage,
  removeInterestedEvent as removeFromStorage,
} from '../../storage/storageService';

interface InterestedState {
  eventIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: InterestedState = {
  eventIds: [],
  loading: false,
  error: null,
};

export const loadInterestedEvents = createAsyncThunk(
  'interested/load',
  async () => {
    const events = await getInterestedEvents();
    return events.map(e => e.eventId);
  },
);

export const addInterestedEvent = createAsyncThunk(
  'interested/add',
  async (eventId: string) => {
    const success = await addToStorage(eventId);
    if (!success) {
      throw new Error('Failed to add event to interested list');
    }
    return eventId;
  },
);

export const removeInterestedEvent = createAsyncThunk(
  'interested/remove',
  async (eventId: string) => {
    const success = await removeFromStorage(eventId);
    if (!success) {
      throw new Error('Failed to remove event from interested list');
    }
    return eventId;
  },
);

const interestedSlice = createSlice({
  name: 'interested',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadInterestedEvents.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadInterestedEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.eventIds = action.payload;
    });
    builder.addCase(loadInterestedEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load interested events';
    });

    builder.addCase(addInterestedEvent.pending, state => {
      state.error = null;
    });
    builder.addCase(addInterestedEvent.fulfilled, (state, action) => {
      if (!state.eventIds.includes(action.payload)) {
        state.eventIds.push(action.payload);
      }
    });
    builder.addCase(addInterestedEvent.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to add interested event';
    });

    builder.addCase(removeInterestedEvent.pending, state => {
      state.error = null;
    });
    builder.addCase(removeInterestedEvent.fulfilled, (state, action) => {
      state.eventIds = state.eventIds.filter(id => id !== action.payload);
    });
    builder.addCase(removeInterestedEvent.rejected, (state, action) => {
      state.error =
        action.error.message || 'Failed to remove interested event';
    });
  },
});

export const {clearError} = interestedSlice.actions;
export default interestedSlice.reducer;

