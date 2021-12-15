import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, StyleSheet, ScrollView, ImageBackground, Button, Animated, TouchableOpacity } from 'react-native';
import HealthBar from '../components/healthBar';
import Tasks from '../components/tasks'
import Logs from '../components/logs';
import Players from '../components/players';
import LevelBar from '../components/levelBar';
import AddTaskModal from '../components/addTaskModal'
import FastImage from 'react-native-fast-image';
import { gifs, images } from '../images';
import { randomId } from '../randomId'
import { conversion } from '../conversion'

const Quest = ({ navigation }) => {
  const [ tasks, setTasks ] = useState([]);
  const [ logs, setLogs ] = useState([
    {
      id: 3,
      time: '2021-11-2 08:54:04',
      text: 'toolpanda completed task "implement a modal in the Q&A widget" and dealt 25 damage!'
    },
    {
      id: 2,
      time: '2021-11-2 08:02:45',
      text: 'summyking completed "achieved 100% test coverage in Overview widget" and dealt 100 damage!'
    },
    {
      id: 1,
      time: '2021-10-30 11:54:37',
      text: 'mediocrekick completed task "implement photo uploads feature" and dealt 50 damage!'
    }
  ]);
  const [ players, setPlayers ] = useState([
    {
      id: 1,
      name: 'mediocrekick',
      level: 3,
      photo: 'fake-person-1.jpg',
      quests: [],
    },
    {
      id: 2,
      name: 'sunnyking',
      level: 3,
      photo: 'fake-person-2.jpg',
      quests: [],
    },
    {
      id: 3,
      name: 'toolpanda',
      level: 3,
      photo: 'fake-person-3.jpg',
      quests: [],
    }
  ])
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ taskModalOpen, setTaskModalOpen ] = useState(false);
  const [ selectedPlayer, setSelectedPlayer ] = useState({});
  const [ quest, setQuest ] = useState({});
  const [ leftValue,] = useState(new Animated.Value(10));
  const [ topValue,] = useState(new Animated.Value(0));
  const [ opacityValue,] = useState(new Animated.Value(1));
  const [ heightValue, ] = useState(new Animated.Value(60));
  const [ widthValue, ] = useState(new Animated.Value(60));
  let treasureClicked = false;

  const animateTreasure = () => {
    if (!treasureClicked) {
      Animated.timing(leftValue, {
        toValue: 70,
        duration: 1000,
        useNativeDriver: false
      }).start()
      Animated.timing(topValue, {
        toValue: 50,
        duration: 1000,
        useNativeDriver: false
      }).start()
      Animated.timing(heightValue, {
        toValue: 200,
        duration: 1000,
        useNativeDriver: false
      }).start()
      Animated.timing(widthValue, {
        toValue: 200,
        duration: 1000,
        useNativeDriver: false
      }).start()

      treasureClicked = true;
    } else {
      if (quest.currentHealth > 0) {
        Animated.timing(leftValue, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: false
        }).start()
        Animated.timing(topValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false
        }).start()
        Animated.timing(heightValue, {
          toValue: 60,
          duration: 1000,
          useNativeDriver: false
        }).start()
        Animated.timing(widthValue, {
          toValue: 60,
          duration: 1000,
          useNativeDriver: false
        }).start()

        treasureClicked = false;
      } else {
        //if boss has no health,
      }
    }
  }

  const fadeOutBoss = () => {
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false
    }).start()
  };

  const completeTaskHandler = (task) => {

    function getFormattedDate(){
      var d = new Date();

      d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

      return d;
  }

    let copy = quest;

    copy.currentHealth = copy.currentHealth - conversion[task.size]

    if (copy.currentHealth < 1) {
      fadeOutBoss();
      animateTreasure();
    }

    setQuest({...copy});

    const log = {
      id: randomId(),
      time: getFormattedDate(),
      text: `User completed task "${task.title}" and dealt ${conversion[task.size]} damage!`
    }

    setLogs([log, ...logs])

    let newTasks = [];

    tasks.forEach( item => {
      if (item.id !== task.id) {
        newTasks.push(item);
      }
    });

    setTasks(newTasks)
  };

  const pressPlayerIconHandler = (player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
  };

  const createTaskHandler = () => {
    setTaskModalOpen(true);
  };

  const addTaskHandler = (taskForm, value) => {
    taskForm.size = value;
    taskForm.id = randomId();

    let taskFormCopy = {...taskForm};

    tasks.push(taskFormCopy);

    setTasks(tasks);

    setTaskModalOpen(false);
  };

  const closeTaskModalHandler = () => {
    setTaskModalOpen(false);
  };

  useEffect(() => {
    const quest = navigation.getParam('item');
    console.log(quest)
    console.log('PLAYERS ' + quest.players)
    setQuest(quest)
    setPlayers(quest.players)
    setTasks(quest.tasks)
  }, []);

  const healthPercent = quest.currentHealth/quest.health * 100;

  return (
    <View style = {styles.view}>
      <ImageBackground
          style = {styles.stage}
          source = {images.grassTowerBackground2}
      >
        {/* <ScrollView> */}

          <Modal visible={modalOpen} animationType='slide'>
            <View style = {styles.modalContent}>
              <Text style = {styles.name} >{selectedPlayer.name}</Text>
              <Image style = {styles.portrait} source = {{uri: `/Users/jonhi1/Desktop/MVP/mvp/images/portraits/${selectedPlayer.photo}`}} />
              <Text style = {styles.level} >Level {selectedPlayer.level}</Text>
              <View style = {styles.expBar}>
                <LevelBar currentHealth = {2025} health = {2900} height = {15} healthPercent = {70}/>
              </View>
              <Button onPress={()=> setModalOpen(false)} title='Close' style={styles.Close}/>
            </View>
          </Modal>

          <AddTaskModal modalOpen = {taskModalOpen} addTaskHandler = {addTaskHandler} closeTaskModalHandler = {closeTaskModalHandler}/>

          <View style = {styles.screen}>
            <ImageBackground
              style = {styles.stage}
              source = {images[quest.stage]}
            >
              <Animated.View
                style={
                  {
                    width: widthValue,
                    height: heightValue,
                    marginLeft: leftValue,
                    marginTop: topValue,
                    borderRadius: 100/2,
                    position: 'absolute',
                    // backgroundColor: 'red',
                    // opacity: opacityValue,
                    flex: 1,
                    zIndex: 1
                  }
                }
              >
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    height: '100%',
                    width: '100%',
                    aspectRatio: 1,
                    marginLeft: '3%',
                    position: 'absolute'
                 }}
                 onPress={animateTreasure}
                >
                  {quest.currentHealth > 0 ?
                    <Image
                      style = {styles.treasureIcon}
                      source={images.treasure}
                      resizeMode= {'cover'}
                    />
                    :<Image
                      style = {styles.treasureGif}
                      source={gifs.treasure}
                      resizeMode= {'cover'}
                      />
                    }
                </TouchableOpacity>
              </Animated.View>
              <View style = {styles.healthBar}>
                <HealthBar currentHealth = {quest.currentHealth} health = {quest.health} height = {15} healthPercent = {healthPercent} />
              </View>
              <Animated.View
                style = {{
                  alignSelf: 'center',
                  maxHeight: 180,
                  maxWidth: 180,
                  opacity: opacityValue
                }}
              >
                <Image
                  style = {styles.bossSprite}
                  source = {gifs[quest.boss]}
                />
              </Animated.View>
              <View>
                <View style = {styles.playersBackground}>
                </View>
                <Players players = { players } pressPlayerIconHandler={pressPlayerIconHandler}/>
              </View>
        </ImageBackground>
      </View>
      <ScrollView>
        <Tasks tasks = {tasks} completeTaskHandler = {completeTaskHandler} createTaskHandler={createTaskHandler}/>
        <Logs logs = {logs}/>

        </ScrollView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    // backgroundColor: "rgb(180, 216, 74)",
    width: '100%',
  },
  logContainer: {
    width: '100%',
    height: '66%',
    // justifyContent: 'center',
    alignItems: 'center'
  },
  screen: {
    marginTop: '3%',
    alignSelf: 'center',
    borderWidth: 5,
    width: '96%',
    maxHeight: '42%',
  },
  treasureIcon: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    aspectRatio: 1,
    marginLeft: '3%',
    position: 'absolute'
  },
  treasureGif: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    aspectRatio: 1,
    marginLeft: '3%',
    position: 'absolute'
  },
  stage: {
    maxHeight: '100%'
  },
  bossSprite: {
    alignSelf: 'center',
    maxHeight: 180,
    maxWidth: 180
  },
  healthBar: {
    alignSelf: 'center',
    paddingTop: '2%',
    width: 200,
    backgroundColor: 'white',
    opacity: 0.7,
    borderRadius: 10,
    margin: 5,
    padding: 5
  },
  playersBackground: {
    backgroundColor: 'white',
    opacity: 0.7,
    borderRadius: 10,
    // borderWidth: 1,
    position: 'absolute',
    height: '100%',
    width: '70%',
    alignSelf: 'center'
  },
  tasksHeader: {
    fontFamily: 'Menlo',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  modalContent:{
    marginTop: '25%'
  },
  portrait: {
    width: 150,
    height: 150,
    // borderRadius: 1,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center'
  },
  name: {
    fontFamily: 'Menlo',
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  level: {
    fontFamily: 'Menlo',
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center'
  },
  expBar: {
    alignSelf: 'center',
    width: '80%',
  }
})

export default Quest;