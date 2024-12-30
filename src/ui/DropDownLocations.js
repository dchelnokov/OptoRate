import ModalDropdown from "react-native-modal-dropdown";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { listAllLocations } from "../../api/storage_expo";
import location_states from "../hooks/location_states";

const DropDownLocations = ({
  navigation,
  locations,
  setLocations,
  getLocationsList,
  selectedLocation,
  setSelectedLocation
}) => {
  // const [locations, setLocations] = useState([]);

  // const getLocationsList = async () => {
  //   const locations = await listAllLocations();
  //   setLocations(locations);
  //   console.log('locations in Dropdown are: ', locations);
  // };

  return (
    <View>
      <ModalDropdown
        options={[...locations]}
        // initialScrollIndes={1}
        style={{ width:"auto", alignContent: "stretch", backgroundColor:'rgb(113,197,232)'}}
        dropdownStyle={{ width: 600, height: "auto" }}
        dropdownTextStyle={{ color: "rgb(45,41,38)", fontSize:20 }}
        dropdownTextHighlightStyle={{
          color: "rgb(228,0,43)",
          borderWidth: 1,
          borderColor: "rgb(242,169,0)",
        }}
        animated={true}
        saveScrollPosition={false}
        defaultIndex={locations.indexOf(selectedLocation)}
        defaultValue={`${selectedLocation} | Auswähl 🔽`}
        onSelect={(index, value) => {
          if (locations.indexOf(value) === -1) {
            setLocations([...locations, value]);
          }
          setSelectedLocation(value);
          console.log(`selection:  ${index} value ${value}`);
        }}
      />
    </View>
  );
};

export default DropDownLocations;
