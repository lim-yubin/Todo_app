import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos"
export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState('')
  const [toDos, setToDos] = useState({})
  const travel = () => setWorking(false)
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload)

  const addToDo = async () => {
    if (text === '') {
      return
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working }
    }
    setToDos(newToDos)
    await saveToDos(newToDos)
    setText('')
  }
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s))
  }
  useEffect(() => {
    loadToDos()
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <TouchableOpacity onPress={work}>
          <Text style={{
            ...styles.btnText,
            color: working ? "white" : theme.grey
          }}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text style={{
            ...styles.btnText, color:
              !working ? "white" : theme.grey
          }}>Travel</Text>
        </TouchableOpacity>

      </View>
      <TextInput
        returnKeyType='done'
        onSubmitEditing={addToDo}
        value={text}
        onChangeText={onChangeText}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}>

      </TextInput>

      <ScrollView>
        {
          Object.keys(toDos).map(key =>
            toDos[key].working === working ?
              (
                <View style={styles.toDo} key={key}>
                  <Text style={styles.toDoText}>
                    {toDos[key].text}
                  </Text>
                </View>
              )
              : null)
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    flexDirection: 'row',
    marginTop: 100,
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600"

  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,

  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }
});
