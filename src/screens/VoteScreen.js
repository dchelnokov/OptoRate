import React, { useEffect, useRef, useState, createContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Video } from "expo-av";

import { createTableAsync, insertRating } from "../../api/storage_expo";
import OptomaLogo from "../components/OptomaLogo";
import states from "../hooks/states";
import { useLocation, Lo } from "../hooks/ContextProvider";

const init = () => {
  useEffect(() => {
    const initializeTable = async () => {
      await createTableAsync();
    };
    initializeTable();
  }, []);
};

// const test = async () => {
//   try {
//     console.log("test function is started.");
//     return true;
//   } catch (error) {
//     console.error("Error importing storage module:", error);
//   }
// };

const VoteScreen = ({ navigation }) => {

  const { location, setLocation, locations, getLocationsList } = useLocation();
  // useEffect(() => {
  //   let selectedLocation = navigation.getParam("selectedLocation");
  //   if (selectedLocation) {
  //     setLocation(selectedLocation);
  //   }
  // }, [navigation]);


  let selectedLocation = navigation.getParam("selectedLocation");
  if (selectedLocation) {
    setLocation(selectedLocation);
  }

  console.log("default location will be set to ", location);
  useEffect(() => {
    getLocationsList();
  }, []);
  const activeElementRef = useRef(null);
  // redifine in states.js const [location, setLocation] = useState("Nordpark");

  const [lastRate, setLastRate] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const [thanksIsOn, setThanksState] = useState(false);

  const videoRef = React.useRef(null);
  // const background = require("../../assets/blurred_blue.mp4");
  const background = require("../../assets/oleg_lehnitsky_8419658-hd_1080_1080_30fps.mp4");

  const produceSecondLine = (rate) => {
    const reactions = ["😕", "🥱", "😐", "😊", "🤩"];
    if (thanksIsOn) {
      return (
        <>
          <Text style={styles.thankYouMessage}>
            Danke! {`(${reactions[rate - 1]}  )`}
          </Text>
          <Text style={styles.thankYouMsgInner}>+1</Text>
        </>
      );
    } else {
      return <Text style={styles.rateYourExp}>Wie fandest Du uns heute?</Text>;
    }
  };

  const [secondLine, setSecondLine] = useState(produceSecondLine(6));
  const giveRate = (rate) => {
    setLastRate(rate);
    setThanksState(true);
    setTimeout(() => {
      setThanksState(false);
    }, 3000);

    console.log(`Rated as: ${rate}`);
    const addRate = async (location, rate) => {
      console.log(`Attempt to insert location=${location} and rate=${rate}`);
      await insertRating(location, rate);
    };
    addRate(location, rate);
  };

  useEffect(() => {
    setSecondLine(produceSecondLine(lastRate));
  }, [thanksIsOn]);

  const halfTime = 5000; // animation time for one direction
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const loopingV = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: -20,
          duration: halfTime,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: halfTime,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: halfTime,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(loopingV, [translateYAnim]);

  init(); // initalize db.

  return (
    <View style={styles.videoContainer}>
      <TouchableOpacity nextFocusForward={1}></TouchableOpacity>
      <Video
        style={styles.videoElement}
        ref={videoRef}
        source={background}
        shouldPlay
        isLooping
        resizeMode="stretch"
        rate={0.6}
      />
      <Animated.View
        style={[
          {
            ...styles.mainMessageBlock,
            transform: [{ translateX: translateYAnim }],
          },
        ]}
      >
        <Text
          style={{
            ...styles.rateYourExp,
            display: thanksIsOn ? "none" : "true",
          }}
        >
          Deine Meinung ist wichtig!{" "}
        </Text>
        {secondLine}
      </Animated.View>
      <Animated.View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuButton, isFocused && styles.focusedLogo]}
          onPress={() => navigation.navigate("Result")}
        >
          <OptomaLogo />
        </TouchableOpacity>
      </Animated.View>
      <View
        style={{ ...styles.voteOptions, display: thanksIsOn ? "none" : "true" }}
      >
        <Animated.View
          style={[{ transform: [{ translateY: translateYAnim }] }]}
        >
          <TouchableOpacity
            onLayout={() => {
              activeElementRef.current.focus();
            }}
            style={styles.touchElement}
            onPress={() => {
              giveRate(1);
            }}
            activeOpacity={1}
          >
            <Text style={styles.optionEmojiText}>😕</Text>
            <Text style={styles.optionText}>hää?</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[{ transform: [{ translateY: translateYAnim }] }]}
        >
          <TouchableOpacity
            style={styles.touchElement}
            onPress={() => {
              giveRate(2);
            }}
          >
            <Text style={styles.optionEmojiText}>🥱</Text>
            <Text style={styles.optionText}>träge</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[{ transform: [{ translateY: translateYAnim }] }]}
        >
          <TouchableOpacity
            style={styles.touchElement}
            onPress={() => {
              giveRate(3);
            }}
            activeOpacity={1}
          >
            <Text style={styles.optionEmojiText}>😐</Text>
            <Text style={styles.optionText}>geht..</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[{ transform: [{ translateY: translateYAnim }] }]}
        >
          <TouchableOpacity
            style={styles.touchElement}
            onPress={() => {
              giveRate(4);
            }}
            activeOpacity={1}
          >
            <Text style={styles.optionEmojiText}>😊</Text>
            <Text style={styles.optionText}>schön</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[{ transform: [{ translateY: translateYAnim }] }]}
        >
          <TouchableOpacity
            key={5}
            style={styles.touchElement}
            onPress={() => {
              giveRate(5);
            }}
          >
            <Text style={styles.optionEmojiText}>🤩</Text>
            <Text style={styles.optionText}>Super!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <TouchableOpacity
        key={2}
        ref={activeElementRef}
        hasTVPreferredFocus={true}
      ></TouchableOpacity>
    </View>
  );
};

// Later on in your styles..
var styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
  },
  videoElement: {
    //top: -180,
    position: "absolute",
    width: 1920,
    height: 1080,
    zIndex: 1,
  },
  mainMessageBlock: {
    position: "absolute",
    alignSelf: "center",
    //height: "20%",
    top: "30%",
    // borderWidth: 1,
    // borderColor: "red",
    zIndex: 2,
  },
  rateYourExp: {
    // Welcome TEXT
    fontWeight: "500",
    fontSize: 60,
    // color: "rgba(240,250,250,0.45)",
    color: "black",
    textShadowColor: "black",
    // textShadowRadius: 22,
    // textShadowOffset: { width: 2, height: 2 },
    padding: 20,
  },
  voteOptions: {
    top: 540,
    width: "50%",
    // top: 100,
    //left: 395,
    position: "absolute",
    flexDirection: "row",
    zIndex: 5,
    elevation: 5,
    alignSelf: "center",
    justifyContent: "center",
  },
  menu: {
    backgroundColor: "rgba(200,200,200,0.0)",
    position: "absolute",
    zIndex: 6,
    borderWidth: 3,
    borderColor: "rgba(200,200,200,0.05)",
    borderRadius: 20,
    top: 20,
    left: 45,
    width: 220,
    height: 100,
    paddingHorizontal: 20,
  },
  focusedLogo: {
    backgroundColor: "rgba(200,200,200,0.0)",
    borderWidth: 1,
    borderColor: "red",
  },
  menuButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,2550, 0.0)",
  },

  touchElement: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginHorizontal: 5,
    borderRadius: 40,
    borderWidth: 5,
    backgroundColor: "rgba(100,100,100,0.2)",
    borderColor: "rgba(100,100,100,0.1)",
  },
  optionText: {
    fontSize: 20,
  },
  optionEmojiText: { fontSize: 40 },
  thankYouMessage: {
    // ThankYou TEXT
    alignSelf: "center",
    fontWeight: "500",
    fontSize: 60,
    color: "rgba(0,0,80,0.95)",
    backgroundColor: "rgba(50,50,50,0.3)",
    borderRadius: 20,
    padding: 20,
  },
  thankYouMsgInner: {
    // +1

    bottom: 125,
    left: "-5.2%",
    textAlign: "right",
    fontWeight: "500",
    fontSize: 30,
    color: "rgba(0,0,80,0.95)",
    borderRadius: 20,
    padding: 20,
  },
});
export default VoteScreen;
