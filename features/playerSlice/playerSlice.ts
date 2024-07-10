import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  amIHost: boolean
}

const initialState: CounterState = {
  amIHost: false,
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    makeHost: (state) => {
      state.amIHost = true
    },
    makePlayer: (state) => {
      state.amIHost = false
    },
  },
})

export const { makeHost, makePlayer } = playerSlice.actions

export default playerSlice.reducer