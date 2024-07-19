import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PlayerState {
  amIHost: boolean;
  playerName: string;
  dbRefName: string;
  answers: number[];
  turn: number;
}

const initialState: PlayerState = {
  amIHost: false,
  playerName: '',
  dbRefName: '',
  answers: [],
  turn: 0,
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
    addWords: (state, action: PayloadAction<number[]>) => {
      state.answers = action.payload
    },
    increaseTurn: (state, action: PayloadAction<number>) => {
      state.turn = action.payload
    }
  },
})

export const { makeHost, makePlayer, addName, addDBRefName, addWords, increaseTurn } = playerSlice.actions

export default playerSlice.reducer