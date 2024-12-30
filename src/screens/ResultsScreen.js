import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// import {useFocusEffect} from '@react-navigation/native';
import states from "../hooks/states";
import SettingsMenu from "../components/SettingsMenu";

const ResultScreen = ({ navigation }) => {
  const {
    pin,
    barAval,
    barBval,
    barCval,
    barDval,
    barEval,
    rating,
    updateAll,
    fetchAndUpdate,
  } = states();
  const [sumOfVotes, setSumOfVotes] = useState(0);
  const sumArray = (numbers) => {
    let sum = 0;
    if (typeof numbers === typeof []) {
      numbers.forEach((element) => {
        sum += element;
      });
    }
    setSumOfVotes(sum);
  };

  useEffect(() => {
    updateAll();
  }, [navigation]);

  // useFocusEffect(
  //   React.useCallback(() => {updateAll();}, [])
  // );

  useEffect(() => sumArray(rating), [rating]);

  const checkIfYouNeedToUpdate = () => {
    let updateCommand = navigation.getParam("updateCommand");
    console.log(' Results Screen:  ~~~checking for update');
    if (updateCommand && updateCommand === "doUpdate") {
      console.log(" Results Screen:  ~~~RECEIVED COMMAND to update");
      fetchAndUpdate();
      updateAll();
      return ('Die Dateien wurden gelöscht.');
    }
    return "";
  };

  if (pin.length > 0) {
    return (
      <View style={styles.body}>
        <Text style={styles.headerText}>PIN:</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => {
            navigation.navigate("Vote", {
              selectedLocation: navigation.getParam("selectedLocation"),
            });
          }}
        >
          <Text style={styles.menuItem}>to Vote</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Ergebnisse: (
          {`${sumOfVotes} Stimme${
            sumOfVotes != 1 ? "n" : ""
          } `}
          )
        </Text>

        <SettingsMenu navigation={navigation}></SettingsMenu>

        <View style={styles.diagramContainer}>
          <View style={styles.diagramBody}>
            <View
              style={{ ...styles.barA, ...styles.barGeneral, height: barAval }}
            >
              <Text style={styles.emoji}>😕</Text>
              <Text style={styles.votesCount}>
                ({rating[0]} {`vote${rating[0] !== 1 ? "s" : ""}`})
              </Text>
            </View>
            <View
              style={{ ...styles.barB, ...styles.barGeneral, height: barBval }}
            >
              <Text style={styles.emoji}>🥱</Text>
              <Text style={styles.votesCount}>
                ({rating[1]} {`vote${rating[1] !== 1 ? "s" : ""}`})
              </Text>
            </View>
            <View
              style={{ ...styles.barC, ...styles.barGeneral, height: barCval }}
            >
              <Text style={styles.emoji}>😐</Text>
              <Text style={styles.votesCount}>
                ({rating[2]} {`vote${rating[2] !== 1 ? "s" : ""}`})
              </Text>
            </View>
            <View
              style={{ ...styles.barD, ...styles.barGeneral, height: barDval }}
            >
              <Text style={styles.emoji}>😊</Text>
              <Text style={styles.votesCount}>
                ({rating[3]} {`vote${rating[3] !== 1 ? "s" : ""}`})
              </Text>
            </View>
            <View
              style={{ ...styles.barE, ...styles.barGeneral, height: barEval }}
            >
              <Text style={styles.emoji}>🤩</Text>
              <Text style={styles.votesCount}>
                ({rating[4]} {`vote${rating[4] !== 1 ? "s" : ""}`})
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "rgb(50,90,139)",
    color: "rgb(228,0,43)",
  },
  popupMsg: {
    left: "30%",
    top: '8%',
    color: "rgb(228,0,43)",
    fontSize: 20,
  },

  headerText: {
    color: "rgb(45,41,38)",
    top: "5%",
    fontSize: 40,
    fontWeight: "600",
    alignSelf: "center",
  },
  menu: {
    borderRadius: 10,
    position: "absolute",
    zIndex: 6,
    borderWidth: 1,
    borderColor: "rgb(91,103,112)",
    color: "rgb(228,0,43)",
    backgroundColor: "rgb(91,103,112)",
    top: "5%",
    left: "5%",
    width: 210,
    height: 80,
  },
  menuItem: {
    flex: 1,
    color: "rgb(228,0,43)",
    backgroundColor: "rgb(91,103,112)",
    alignSelf: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  emoji: {
    fontSize: 40,
  },
  votesCount: {
    fontSize: 20,
    fontWeight: "500",
  },

  diagramContainer: {
    position: "absolute",
    width: 600,
    height: 400,
    top: 150,
    left: 360,
    // borderWidth: 1,
    // borderColor: "red",
  },
  diagramBody: {
    backgroundColor: "rgba(120,120,120,0.2)",
    flexDirection: "row",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: "100%",
    width: "100%",
  },
  barGeneral: {
    flex: 1,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "baseline",
  },
  barA: { backgroundColor: "rgb(23,134,255)", borderBottomStartRadius: 5 },
  barB: { backgroundColor: "rgb(141,144,147)" },
  barC: { backgroundColor: "rgb(242,169,0)" },
  barD: { backgroundColor: "rgb(0,199,177)" },
  barE: { backgroundColor: "rgb(120,190,32)", borderBottomEndRadius: 5 },
});

export default ResultScreen;
