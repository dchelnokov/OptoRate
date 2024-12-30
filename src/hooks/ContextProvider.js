import React, { createContext, useState, useContext, useEffect } from "react";
import { listAllLocations } from "../../api/storage_expo";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    console.log("LocationProvider: 1. init location(s) states");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  const getLocationsList = async () => {
    const fetchedLocations = await listAllLocations();
    setLocations(fetchedLocations);
  };

  useEffect(() => {
    getLocationsList();
  }, []);

  const value = {
    location,
    setLocation,
    locations,
    setLocations,
    getLocationsList,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
