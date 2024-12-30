import { useEffect, useState } from "react";
import { countRatings } from "../../api/storage_expo";

const percentageCalculation = (rating) => {
  const max = Math.max(...rating);
  let maxPercentage = max > 0 ? 100 : 0;

  const mapped = [...rating].map((i) => {
    return max === i ? maxPercentage : Math.floor((i * 100) / (max || 1));
  });
  return mapped;
};

export default () => {
  
  const [pin, setPin] = useState("");
  const [barAval, setBarA] = useState("100%");
  const [barBval, setBarB] = useState("75%");
  const [barCval, setBarC] = useState("50%");
  const [barDval, setBarD] = useState("25%");
  const [barEval, setBarE] = useState("5%");
  const [rating, setRating] = useState([0, 0, 0, 0, 0]);
  const [ratingP, setRatingP] = useState([0, 0, 0, 0, 0]);
  // const [location, setLocation] = useState("Nordpark");
  const fetchRating = async () => {
    const ratingArray = await countRatings();
    setRating(ratingArray);
  };

  const updateAll = () => {
    const percentages = percentageCalculation(rating);
    setRatingP(percentages);
    setBarA(`${percentages[0]}%`);
    setBarB(`${percentages[1]}%`);
    setBarC(`${percentages[2]}%`);
    setBarD(`${percentages[3]}%`);
    setBarE(`${percentages[4]}%`);
  };

  const fetchAndUpdate = async () => {
    await fetchRating();
    updateAll();
  };

  useEffect(() => {
    fetchRating();
  }, []);

  useEffect(() => {
    updateAll()
  }, [rating]);

  return {
    barAval,
    barBval,
    barCval,
    barDval,
    barEval,
    pin,
    rating,
    // location,
    // setLocation,
    updateAll: () => updateAll,
    fetchAndUpdate: () => fetchAndUpdate,
  };
};
