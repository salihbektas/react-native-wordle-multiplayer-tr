import { colors } from "@/constants/Colors"
import { Pressable, StyleSheet, Text, View } from "react-native"


export default function lobby() {


  return(
    <View style={styles.main}>
      <Text style={styles.text}>Oyun Lobisi</Text>

      <Text style={styles.text}>Oyuncu Listesi</Text>

      <View style={styles.listContainer}>
      {
        <Text style={styles.text} >Oyuncular...</Text>

      }

      </View>

      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Başlat</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Odayı Dağıt</Text>
      </Pressable>
    </View>
  )
    
  
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    padding: 16,
  },

  text: {
    color: colors.white,
    fontSize: 30
  },

  listContainer:{
    flex:1,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },

  listRow: {
    padding: 4,
    marginVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.lightGray,
    flexDirection: 'row',
  },

  button: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },

  buttonText: {
    color: colors.black,
    fontSize: 24,
  }
})