import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions, Platform } from 'react-native';
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
  const [isChecked, setIsChecked] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [editKey, setEditKey] = useState('')

  const onChangeText = (payload) => setText(payload)
  const onChangeEditText = (payload) => setEditText(payload)

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
  const deleteTodo = async (key) => {
    if (Platform.OS === 'web') {
      const ok = confirm("Do you want delete this To Do?")
      if (ok) {
        const newToDos = { ...toDos }
        delete newToDos[key]
        setToDos(newToDos)
        saveToDos(newToDos)
      }
    }
    else {
      try {
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
      catch (err) {
        console.log(err)
      }
    }

  }
  const editTodo = async (key) => {
    setEditing(true)
    setEditText((toDos[key].text))
    setEditKey(key)
  }
  const editConfirm = async () => {
    if (Platform.OS === 'web') {
      const ok = confirm("Do you want edit this To Do?")
      if (ok) {
        const newToDos = {
          ...toDos
        }
        if (editText === '') {
          setText('')
          setEditing(false)
        }
        else (
          newToDos[editKey].text = editText)
        setToDos(newToDos)
        saveToDos(newToDos)
        setText('')
        setEditing(false)
      }
    }
    else {
      try {
        Alert.alert("Edit To Do?", "Are you sure?", [
          { text: "Cancel" },
          {
            text: "I'm Sure",
            style: "destructive",
            onPress: async () => {
              const newToDos = {
                ...toDos
              }
              if (editText === '') {
                setText('')
                setEditing(false)
              }
              else (
                newToDos[editKey].text = editText)
              setToDos(newToDos)
              await saveToDos(newToDos)
              setText('')
              setEditing(false)
            }
          }
        ])
      }
      catch (err) {
        console.log(err)
      }

    }




  }
  const addToDo = async () => {
    try {
      if (text === '') {
        return
      }
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working, isChecked }
      }
      setToDos(newToDos)
      await saveToDos(newToDos)
      setText('')
    }
    catch (err) {
      console.log(err)
    }

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
  const checkTodo = async (key) => {
    try {
      const newToDos = { ...toDos }
      if (newToDos[key].isChecked === false) {
        newToDos[key].isChecked = true
      }
      else {
        newToDos[key].isChecked = false
      }

      setToDos(newToDos)
      await saveToDos(newToDos)

      console.log(newToDos[key].isChecked)

    }
    catch (err) {
      console.log(err)
    }

  }
  const loadToDos = async () => {
    try {
      const list = await AsyncStorage.getItem(STORAGE_KEY1)
      if (list) setToDos(JSON.parse(list))

    }
    catch (err) {
      console.log(err)
    }
  }
  const loadHeaders = async () => {
    try {
      const state = await AsyncStorage.getItem(STORAGE_KEY2)
      // state !== null ? setWorking(JSON.parse(state)) : null
      if (state) setWorking(JSON.parse(state))
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
            fontSize: 44,
            fontWeight: "600",
            color: !working ? "#C3E9E8" : theme.grey
          }}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          <Text style={{
            fontSize: 44,
            fontWeight: "600", color:
              working ? "#C3E9E8" : theme.grey
          }}>Travel</Text>
        </TouchableOpacity>

      </View>
      {!editing ? (<TextInput
        maxLength={50}
        returnKeyType='done'
        onSubmitEditing={addToDo}
        value={text}
        onChangeText={onChangeText}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        placeholderTextColor="#5497A7"
        style={styles.input}>
      </TextInput>)
        :
        (<TextInput
          maxLength={50}
          returnKeyType='done'
          onSubmitEditing={editConfirm}
          value={editText}
          onChangeText={onChangeEditText}
          style={styles.input}>
        </TextInput>)}


      <ScrollView>
        {
          Object.keys(toDos).map(key =>
            toDos[key].working === working ?
              (
                <View style={styles.toDo} key={key}>
                  <TouchableOpacity onPress={() => checkTodo(key)}>
                    <Text>
                      {
                        toDos[key].isChecked ?
                          (<FontAwesome5 name="check-circle" size={20} color="#5497A7" />)
                          :
                          (<FontAwesome5 name="circle" size={20} color="#5497A7" />)
                      }
                    </Text>
                  </TouchableOpacity>

                  <Text style={{
                    ...styles.toDoText,
                    textDecorationLine: toDos[key].isChecked ? theme.lineThrough : 'none'
                  }}>
                    {toDos[key].text}
                  </Text>
                  <View style={styles.funcBtn}>

                    <TouchableOpacity onPress={() => editTodo(key)}>
                      <Text>
                        <FontAwesome5 name="edit" size={16} color="#5497A7" />
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => deleteTodo(key)}>
                      <Text>
                        <FontAwesome5 name="trash-alt" size={14} color='#5497A7' />
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
    paddingHorizontal: 4,
    paddingVertical: 10
  },
  header: {
    flexDirection: 'row',
    marginTop: 100,
    justifyContent: "space-between",
    paddingHorizontal: 20
  },
  btnText: {


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
    flex: 0.9,
    color: "#5497A7",
    fontSize: 18,
    fontWeight: "500",
  },
  funcBtn: {
    width: FUNCBTN_WIDTH / 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkBtn: {
    justifyContent: 'center',
    alignItems: 'center',

  }
});



