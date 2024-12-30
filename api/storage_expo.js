import * as SQLite from "expo-sqlite";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";

const requestPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  if (status !== "granted") {
    alert("Permission to access media library is required!");
    return false;
  }
  return true;
};

const showToast = async (message) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: " ",
      body: message,
    },
    trigger: null,
  });
};

const saveFile = async (text) => {
  const hasPermission = await requestPermission();
  if (!hasPermission) {
    console.error("Error obtaining storage permission");
    return;
  }
  const fileName = `}${dateTimeString}.csv`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  try {
    const dataString = await exportToCSV();
    await FileSystem.writeAsStringAsync(fileUri, dataString);
    const successMsg = `File '${fileName}' saved successfully at '${FileSystem.documentDirectory}'.`;
    console.log(successMsg);
    await showToast(successMsg);
  } catch (error) {
    console.error(
      `Error saving to '${FileSystem.documentDirectory}' : `,
      error
    );
  }
};

const tableName = "rates";
const dbName = "ratings.db";
const RATING_MIN = 1;
const RATING_MAX = 5;

const dateTimeString = () => {
  const dNow = new Date();
  const yy = dNow.getFullYear();
  const mm = ("0" + (new Number(dNow.getMonth()) + 1)).slice(-2);
  const dd = ("0" + dNow.getDay()).slice(-2);
  const hh = ("0" + dNow.getHours()).slice(-2);
  const min = ("0" + dNow.getMinutes()).slice(-2);
  const sec = ("0" + dNow.getSeconds()).slice(-2);
  const msec = ("000" + dNow.getMilliseconds()).slice(-3);

  return [yy, mm, dd].join("-") + "_-_" + [hh, min, sec, msec].join("-");
};

const sanitizeInput = (input) => {
  // Basic example of sanitization: escape quotes and dangerous characters.
  return input.replace(/'/g, "''");
};

let db;

const initializeDatabase = async () => {
  if (!db) {
    db = await openDatabase();
  }
};

const openDatabase = async () => {
  try {
    const dbInstance = await SQLite.openDatabaseAsync(dbName);
    // console.log("Database path: ", dbInstance._db._dbFilename);
    return dbInstance;
  } catch (error) {
    console.error(`Error opening database ${dbName}: `, error);
    throw error;
  }
};

// Initialise the database
export const createTableAsync = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(
      `PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      location VARCHAR(256) DEFAULT 'unnamed location',
      rating INTEGER NOT NULL CHECK (rating >= ${RATING_MIN} AND rating <= ${RATING_MAX})
    )`
    );
    console.log(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.log(`Error creating table ${tableName}:`, error);
    throw error;
  }
};

// Function to insert a rating
export const insertRating = async (location, rating) => {
  await initializeDatabase();

  const si = sanitizeInput;
  try {
    await db.execAsync(
      `INSERT INTO ${tableName} (location, rating) VALUES ('${si(
        location
      )}', ${rating})`
    );
    console.log("Rating inserted successfully");
  } catch (error) {
    console.log("Error inserting rating: ", error);
    throw error;
  }
};

// Function to fetch all ratings
export const getAllRatings = async () => {
  await initializeDatabase();
  try {
    const result = await db.execAsync(`SELECT * FROM ${tableName}`);
    let ratings = result.rows._array || [];
    return ratings;
  } catch (error) {
    console.log("Error fetching ratings: ", error);
    throw error;
  }
};

// Function to delete all ratings
export const deleteAllRatings = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(`DELETE FROM ${tableName}`);
    console.log(`All rows have been removed from ${tableName}. Success.`);
    return;
  } catch (error) {
    console.error(
      `Error deleting all rows from the table ${tableName}: `,
      error
    );
    throw error;
  }
};

// Function to export ratings to CSV
export const exportToCSV = async () => {
  await initializeDatabase();
  let csvContent = "ID;Timestamp;Location;Rating\n";
  try {
    const result = await db.execAsync(`SELECT * FROM ${tableName}`);
    result.rows._array.forEach((row) => {
      csvContent += `${row.id};${row.timestamp};${row.location};${row.rating}\n`;
    });
    return csvContent;
  } catch (error) {
    console.error("Failed to fetch data from the database.");
    throw error;
  }
};

// Function to get the time span of ratings
export const getRatingsTimeSpan = async () => {
  await initializeDatabase();
  try {
    const result = await db.execAsync(
      `SELECT MIN(timestamp) AS earliest,
      MAX(timestamp) AS latest FROM ${tableName}`
    );
    if (result.length > 0) {
      const earliest = result.item(0).earliest;
      const latest = result.item(0).latest;
      return [earliest, latest];
    } else {
      return [null, null];
    }
  } catch (error) {
    console.log("Error fetching time span: ", error);
  }
};

// format Timestamp to match the SQLite Timestamp format
const formatTimestamp = (time) => {
  const date = new Date(time);
  return date.toISOString().slice(0, 19).replace("T", " "); // Format as 'YYYY-MM-DD HH:MM:SS'
};

// polls database for all entered locations
export const listAllLocations = async() => {
  await initializeDatabase();
  let locations = [];
  const query = `SELECT DISTINCT location FROM ${tableName}
                 ORDER BY location ASC;`;
  try {
    const response = await db.getAllAsync(query);
    for (let i = 0; i < response.length; i++) {
      const row = response[i];
      locations.push(row.location);
    }
    return locations;
  } catch (error) {console.error('Error fetching locations from the Database: ', error);
    throw error;
  }
}

// Function to count ratings within a time range
// arguments are fromTime - the beginning of the time range (if not set - the beginning of times)
// toTime - the end of the time range (if not set, using the current time)
// returns an array containing count of each note in the rating column,
// from the smalest (RATING_MIN) to the highest (RATING_MAX)
export const countRatings = async (fromTime = 0, toTime = Date.now()) => {
  await initializeDatabase();
  fromTime = formatTimestamp(fromTime);
  toTime = formatTimestamp(toTime);

  let counts = Array(RATING_MAX - RATING_MIN + 1).fill(0);
  const query = `SELECT rating, COUNT(rating) as count FROM ${tableName}
      WHERE timestamp >= '${fromTime}' AND timestamp <= '${toTime}'
      GROUP BY rating`;
  try {
    //console.log("DEBUG: *** db ***: ", db);
    //console.log("DEBUG: sending query: ", query);
    const result = await db.getAllAsync(query);
    //console.log("DEBUG: polling gave result=  ", result);
    for (let i = 0; i < result.length; i++) {
      const row = result[i];
      counts[row.rating - RATING_MIN] = row.count;
    }
    // console.log('DEBUG:*** counts = ', counts);
    // console.log('DEBUG:*** result = ', result);
    return counts;
  } catch (error) {
    console.error(
      `Error counting ratings for the time range ${fromTime} to ${toTime}: `,
      error
    );
    throw error;
  }
};

// Function that should delete the most recent record in case the users change their mind.
// returns true if success and false if the operation fails
export const deleteLast = async () => {
  await initializeDatabase();
  try {
    await db.execAsync(
      `DELETE FROM ${tableName}
      WHERE id = (SELECT id FROM ${tableName} ORDER BY timestamp DESC LIMIT 1)`
    );
    return true;
  } catch (error) {
    console.error("Failed to delete the latest record from the database");
    return false;
  }
};
