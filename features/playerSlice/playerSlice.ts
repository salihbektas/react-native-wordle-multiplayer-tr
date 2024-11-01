import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerState {
  amIHost: boolean;
  playerName: string;
  dbRefName: string;
  answers: number[];
  numberOfGame: number;
  keyboardLayout: 'seperate' | 'flat';
}

const initialState: PlayerState = {
  amIHost: false,
  playerName: '',
  dbRefName: '',
  answers: [],
  numberOfGame: 5,
  keyboardLayout: 'seperate',
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
      AsyncStorage.setItem('playerName', action.payload);
    },
    changeKeyboardLayout: (
      state,
      action: PayloadAction<'seperate' | 'flat'>,
    ) => {
      state.keyboardLayout = action.payload;
      AsyncStorage.setItem('keyboardLayout', action.payload);
    },
    addDBRefName: (state, action: PayloadAction<string>) => {
      state.dbRefName = action.payload;
    },
    makeHost: (state) => {
      state.amIHost = true;
    },
    makePlayer: (state) => {
      state.amIHost = false;
    },
    addWords: (state, action: PayloadAction<number[]>) => {
      state.answers = action.payload;
    },
  },
});

export const {
  makeHost,
  makePlayer,
  addName,
  addDBRefName,
  addWords,
  changeKeyboardLayout,
} = playerSlice.actions;

export default playerSlice.reducer;
