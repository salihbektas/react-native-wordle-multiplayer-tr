import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

export type ServerType = {
  isWaiting: boolean;
  playerCount: number;
  serverName: string;
  playerList: string[];
  turn: number;
  results: Record<string, [number,number]>
}

const firebaseConfig = {
  databaseURL: process.env.EXPO_PUBLIC_API_URL,
};

const app = initializeApp(firebaseConfig);

const dbRootRef = ref(getDatabase(app))

export default dbRootRef;