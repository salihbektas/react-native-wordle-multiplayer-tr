import { colors } from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";


const firebaseConfig = {
  databaseURL: process.env.EXPO_PUBLIC_API_URL,
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

get(dbRef).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

export default function multiplayer() {

  return(
    <View style={styles.main}>
      <Text style={styles.text}>Multiplayer page</Text>
    </View>
  )
    
  
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center'
  },

  text: {
    color: colors.white,
    fontSize: 30
  }
})