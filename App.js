import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions } from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

const STORAGE_KEY1 = "@toDos"
const STORAGE_KEY2 = "@saveTheState"
const FUNCBTN_WIDTH = Dimensions.get('window').width
export default function App() {
  const [working, setWorking] = useState(true)
  const [text, setText] = useState('')
  const [toDos, setToDos] = useState({})

  useEffect(() => {
    loadToDos(),
      loadHeaders()
  }, [])

  useEffect(() => {
    saveTheState()
  }, [working])


  const travel = () => {
    setWorking(false)
    saveTheState(false)
  }
  const work = () => {
    setWorking(true)
    saveTheState(true)
  }
  const onChangeText = (payload) => setText(payload)


  const deleteTodo = async (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos }
          delete newToDos[key]
          setToDos(newToDos)
          saveToDos(newToDos)
        }
      }
    ])
  }

  const editTodo = async (key) => {

  }

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
    try {
      await AsyncStorage.setItem(STORAGE_KEY1, JSON.stringify(toSave))
    }
    catch (err) {
      console.log(err)
    }
  }
  const saveTheState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY2, JSON.stringify(working))
    }
    catch (err) {
      console.log(err)
    }
  }
  const loadToDos = async () => {
    try {
      const list = await AsyncStorage.getItem(STORAGE_KEY1)
      setToDos(JSON.parse(list))
    }
    catch (err) {
      console.log(err)
    }
  }
  const loadHeaders = async () => {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEY2)
      state !== null ? setWorking(JSON.parse(state)) : null
    }
    catch (err) {
      console.log(err)
    }
  }


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
        maxLength={50}
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
                  <View style={styles.funcBtn}>

                    <TouchableOpacity onPress={() => editTodo(key)}>
                      <Text>
                        <FontAwesome5 name="edit" size={16} color="white" />
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => deleteTodo(key)}>
                      <Text>
                        <FontAwesome5 name="trash-alt" size={14} color='white' />
                      </Text>
                    </TouchableOpacity>

                  </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  funcBtn: {
    width: FUNCBTN_WIDTH / 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
