import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PlayerState {
  amIHost: boolean;
  playerName: string;
  dbRefName: string;
  answers: string[];
}

const initialState: PlayerState = {
  amIHost: false,
  playerName: '',
  dbRefName: '',
  answers: [],
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload
    },
    addDBRefName: (state, action: PayloadAction<string>) => {
      state.dbRefName = action.payload
    },
    makeHost: (state) => {
      state.amIHost = true
    },
    makePlayer: (state) => {
      state.amIHost = false
    },
    addWords: (state, actionion: PayloadAction<string[]>) => {
      state.answers = actionion.payload
    }
  },
})

export const { makeHost, makePlayer, addName, addDBRefName, addWords } = playerSlice.actions

export default playerSlice.reducer