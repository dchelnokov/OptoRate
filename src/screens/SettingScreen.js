import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DropDownLocations from "../ui/DropDownLocations";
import {deleteAllRatings} from '../../api/storage_expo';
import { useLocation } from "../hooks/ContextProvider";




const SettingScreen = ({ navigation }) => {
  // STARTS HERE *****************
  const [isDeleted, setIsDeleted] = useState('');

  const deleteAllData = async () =>{
    try {
      await deleteAllRatings();
    setIsDeleted('Erfolgreich gelöscht! Das Diagramm wird sich erst nach der nächsten Stimmenabgabe aktualisieren');
    }
    catch (error) {setIsDeleted(`Fehler beim Löschen.`);}
  }

  const [preselectedLocation, setPreselectedLocation] = useState("");
  const { location, setLocation, locations, setLocations, getLocationsList } =
    useLocation();

  
  const applyLocation = (val) => {
    console.log(`preselected location was "${val}"`);
    if (val.trim() && locations.indexOf(val) === -1) {
      setLocations([val, ...locations]);
    }
    if (preselectedLocation !== location) {
      setLocation(val);
    }
  };
  if (navigation.getParam("title") === "Ort einstellen 🗺️") {
    // *********************  LOCATION ************************** ///
    return (
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() =>
            navigation.navigate("Result", {
              selectedLocation: preselectedLocation,
            })
          }
        >
          <Text style={styles.menuItem}>🔙 Results</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{navigation.getParam("title")}</Text>
        <View style={styles.ParaContainer}>
          <Text style={styles.ParaText}>
            Hier können Sie den Standort einstellen. Damit können Sie später die
            Ergebnisse nach dem Standort filtern.
          </Text>
          <Text style={styles.ParaText}></Text>
          <Text style={styles.ParaText}>
            Wählen Sie aus den vorhandenen (früher gespeicherten) Optionen, oder
            geben einen neuen Standort ein.
          </Text>
          <View style={styles.SettingsGroup}>
            <Text style={styles.ParaText}>
              Alle neuen Bewertungen speichern für:{" "}
            </Text>
            <DropDownLocations
              navigation={navigation}
              locations={locations}
              setSelectedLocation={setLocation}
              selectedLocation={location}
              setLocations={setLocations}
              getLocationsList={getLocationsList}
            />
            <Text style={styles.ParaText}>
              oder einen neuen Standort Angeben:{" "}
            </Text>
            <TextInput
              style={styles.optionEntryItem}
              autoCapitalize="none"
              value={preselectedLocation}
              onChangeText={(value) => setPreselectedLocation(value)}
              onEndEditing={(value) => setPreselectedLocation(value)}
            ></TextInput>
          </View>
          <TouchableOpacity style={styles.subButton}>
            <Text
              style={styles.subButtonText}
              onPress={() => {
                applyLocation(preselectedLocation);
              }}
            >
              Anwenden
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (navigation.getParam("title") === "Dateien verwalten 🗃️") {
    // ************************* MANAGE DATA ************************** //
    return (
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() =>
            navigation.navigate("Result",{
              selectedLocation: preselectedLocation,
            })
          }
        >
          <Text style={styles.menuItem}>🔙 Results</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{navigation.getParam("title")}</Text>
        <View style={styles.ParaContainer}>
          <Text style={styles.ParaText}>
            Hier können Sie alle Statistiken löschen.
          </Text>
          <Text style={styles.ParaText}></Text>
          <Text style={styles.ParaText}>
            Bitte, denken Sie daran, vor dem Löschen eine reserve Kopie der Dateien zu machen.
            Dieser Verfahren ist kann man nicht widerrufen.
          </Text>
          <View style={styles.SettingsGroup}>
            <Text style={styles.ParaText}>‼️ Alle Dateien endgültig Löschen: </Text>
            <TouchableOpacity style={styles.subButtonCritical}>
            <Text
              style={styles.subButtonCriticalText}
              onPress={() => { deleteAllData() }}
              
            >
              Alles löschen
            </Text>
          </TouchableOpacity>
          <Text style={styles.ParaText}>{isDeleted}</Text>
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
  headerText: {
    color: "rgb(45,41,38)",
    top: "5%",
    fontSize: 40,
    fontWeight: "600",
    alignSelf: "center",
  },
  ParaContainer: {
    position: "absolute",

    width: 600,
    height: 400,
    top: 150,
    left: 360,
    // borderWidth: 1,
    // borderColor: "red",
  },
  ParaText: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "300",
    color: "rgb(54,41,38)",
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
  SettingsGroup: {
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: "rgb(208,211,212)",
    borderColor: "rgb(141,144,147)",
    borderRadius: 10,
    padding: 10,
  },
  optionEntryItem: {
    width: "auto",
    alignContent: "stretch",
    backgroundColor: "rgb(113,197,232)",
  },
  subButton: {
    margin: 2,
    width: 100,
    height: 50,
    borderColor: "rgb(113,197,232)",
    backgroundColor: "rgb(113,197,232)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    zIndex: 2,
    elevation: 2,

    justifyContent: "center",
    textAlignVertical: "center",
    alignItems: "center",
    verticalAlign: "middle",
    textAlign: "center",
  },
  subButtonText: {
    color: "rgb(45,41,38)",
  },
  subButtonCritical: {
    margin: 2,
    width: 100,
    height: 50,
    borderColor: "rgb(225,0,152)",
    backgroundColor: "rgb(225,0,152)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    zIndex: 2,
    elevation: 2,

    justifyContent: "center",
    textAlignVertical: "center",
    alignItems: "center",
    verticalAlign: "middle",
    textAlign: "center",
  },
  subButtonCriticalText: {
    color: "rgb(113,197,232)",
    fontWeight:'500',
    textTransform:'uppercase',
    textAlign:'center',
  },
});

export default SettingScreen;
