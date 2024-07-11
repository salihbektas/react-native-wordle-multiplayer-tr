import { initializeApp } from "firebase/app";

const firebaseConfig = {
  databaseURL: process.env.EXPO_PUBLIC_API_URL,
};

const app = initializeApp(firebaseConfig);

export default app;