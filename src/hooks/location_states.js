import { useEffect, useState } from "react";
import { listAllLocations } from "../../api/storage_expo";

export default location_states = () => {
  // const [location, setLocation] = useState('Köln - Test'); // location - selected location
  // const [locations, setLocations] = useState([]);  // locations - is a list of locations
  // the above is moved to the ContextProvider. (I will delete the above lines after testing.)

  const getLocationsList = async () => {
    const locations = await listAllLocations();
    if (locations.findIndex((itm)=> itm == location) < 0){
      setLocations([location, ...locations]);
    }
    else {
      setLocations(locations);
    }
    console.log("locations in Dropdown are: ", locations);
  };
  useEffect(() => {
    getLocationsList();
  }, []);

  return {
    location,
    locations,
    setLocation,
    setLocations: () => setLocations,
    getLocationsList: () => getLocationsList,
  };
};
