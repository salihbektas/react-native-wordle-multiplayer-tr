import { initializeApp } from "firebase/app";

export type ServerType = {
  isWaiting: boolean;
  playerCount: number;
  serverName: string;
  playerList: string[];
}

const firebaseConfig = {
  databaseURL: process.env.EXPO_PUBLIC_API_URL,
};

const app = initializeApp(firebaseConfig);

export default app;