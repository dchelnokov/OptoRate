import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SettingsMenu = ({navigation}) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuHeader}>Menü</Text>
      <View style={styles.menuItemsContainer}>
        <TouchableOpacity style={styles.menuItemButton}
        onPress={()=> navigation.navigate('Settings', {title:'Ort einstellen 🗺️'})}>
          <Text style={styles.menuItemText}>Ort einstellen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemButton}>
          <Text style={{...styles.menuItemText, display:'none'}}>PIN Einstellen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemButton}>
          <Text style={styles.menuItemText}>Als CSV exportieren</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemButton}>
          <Text style={styles.menuItemText}
           onPress={()=> navigation.navigate('Settings', {title:'Dateien verwalten 🗃️'})}>Dateien verwalten</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 10,
    position: "absolute",
    top: 150,
    width: 210,
    left: "5%",
    backgroundColor: "rgba(91,103,112,0.9)",
    justifyContent: "space-evenly",
  },
  menuHeader: {
    width: "100%",
    height: 60,
    fontSize: 35,
    fontWeight: "400",
    color: "rgb(228,0,43)",
    backgroundColor: "rgb(45,41,38)",
    textAlign: "center",
    textAlignVertical: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius:10,
    // borderWidth: 1,

    // borderColor: "red",
    fontFamily: "System",
  },
  menuItemsContainer: {
    position: "relative",
    color: "rgb(228,0,43)",
  },
  menuItemButton: {
    flex: 1,
    borderWidth: 2,
    paddingLeft: "5%",
    borderColor: "rgb(100,100,255)",
    color: "rgb(228,0,43)",
    backgroundColor: "rgb(76,64,132)",
    paddingVertical: "5%",
  },
  menuItemText: {
    paddingHorizontal:"2%",
    paddingVertical:"1%",
    backgroundColor:"rgb",
    flex: 1,
    fontSize: 20,
    // borderWidth: 1,
    // borderColor: "rgb(100,255,100)",
  },
});

export default SettingsMenu;
