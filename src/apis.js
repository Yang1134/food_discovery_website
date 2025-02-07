import { db } from "../firebase.config";
import { collection, getDocs, doc, getDoc, query, where, setDoc } from "firebase/firestore";
import axios from "axios";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {calculateBounds, checkCoordsBounded} from "./utils.js";

export async function fetchRestaurants() {
  try {
    // Get all documents from the "Restaurants" collection
    const querySnapshot = await getDocs(collection(db, "Restaurants"));

    // Map through the querySnapshot to return the required fields
    const restaurants = querySnapshot.docs.map((doc) => ({
      resName: doc.id,
      name: doc.data().name,
      address: doc.data().address,        // Assuming address field exists
      category: doc.data().category,      // Assuming category field exists
      imgSrc: doc.data().thumb_img_url,  // Assuming thumb_img_url field exists
      tags: doc.data().tag || []
    }));

    return restaurants; // Return the array of restaurants with the desired fields
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;  // Rethrow the error to be handled in the calling code
  }
}

export async function fetchCategories() {
  try {
    const querySnapshot = await getDocs(collection(db, "Categories"));
    const categoryList = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(), // Include document data
    }));
    return categoryList;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}


export async function fetchTags() {
  try {
    // Get all documents from the "Tag" collection
    const querySnapshot = await getDocs(collection(db, "Tag"));

    // Map through the querySnapshot to extract the document IDs as tags
    const tags = querySnapshot.docs.map((doc) => doc.id);

    return tags; // Return an array of tag IDs
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;  // Rethrow the error to be handled in the calling code
  }
}

// For homepage recommended carousel
// search restauranr by category
export async function searchRestaurants(category, bounds) {
  if (!category) {
      console.error("Category is required.");
      return [];
  }

  try {
      // Query to fetch restaurants based on category and tag
      const q = query(
          collection(db, "Restaurants"),
          where("category", "==", category),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          const results = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));

          // Sort by rating in descending order
          results.sort((a, b) => b.rating - a.rating);

          // If we have the user's geolocation, filter restaurants based on bounds
          if (userLocation && userLocation.bounds) {
              const filteredResults = checkCoordsBounded(results, bounds);

              // If no restaurants within bounds, return an empty array
              if (filteredResults.length === 0) {
                  console.log("No restaurants found within bounds.");
                  return [];
              }

              return filteredResults.slice(0, 5);  // Return the top 5 restaurants within bounds
          } else {
              // If no user geolocation, randomly select the top 5 restaurants with the highest ratings
              let topResults = results.slice(0, 5);

              // If there are more than 5 documents with the highest rating, randomize them
              const highestRating = topResults[0]?.rating;
              const filteredResults = topResults.filter(doc => doc.rating === highestRating);

              if (filteredResults.length > 5) {
                  topResults = filteredResults.sort(() => 0.5 - Math.random()).slice(0, 5);
              }

              return topResults;
          }
      } else {
          console.log("No matching documents found.");
          return [];
      }
  } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
  }
}

//
export async function searchRestaurantsByTags(tagInput, bounds) {
  if (!tagInput) {
    console.error("Tag input is required.");
    return [];
  }

  // Step 1: Split the tag input string into an array of tags
  const tagList = tagInput.split(' ').map(t => t.trim()).filter(t => t.length > 0); // Remove any empty strings

  console.log("Searching restaurants with tags:", tagList);

  try {
    // Step 2: Query restaurants that match any of the tags provided
    const q = query(
      collection(db, "Restaurants"),
      where("tag", "array-contains-any", tagList)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      // Step 3: Filter the results based on bounds
      const filteredResults = checkCoordsBounded(results, bounds);
              // If no restaurants within bounds, return an empty array
      if (filteredResults.length === 0) {
        console.log("No restaurants found within bounds.");
        return [];
      }
      // Step 4: Sort by rating in descending order
      filteredResults.sort((a, b) => b.rating - a.rating);

      return filteredResults;   // Return the results
    } else {
      console.log("No matching documents found.");
      return [];  // No restaurants found
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}

export async function searchRestaurantsByTagsAndCategories(category, tagInput, bounds) {
  if (!tagInput) {
    console.error("Tag input is required.");
    return [];
  }

  // Step 1: Split the tag input string into an array of tags
  const tagList = tagInput.split(' ').map(t => t.trim()).filter(t => t.length > 0); // Remove any empty strings

  console.log("Searching restaurants with tags:", tagList);

  try {
    // Step 2: Query restaurants that match any of the tags provided
    const q = query(
      collection(db, "Restaurants"),
      where("tag", "array-contains-any", tagList),
      where("category", "==", category),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      // Step 3: Filter the results based on bounds
      const filteredResults = checkCoordsBounded(results, bounds);
              // If no restaurants within bounds, return an empty array
      if (filteredResults.length === 0) {
        console.log("No restaurants found within bounds.");
        return [];
      }
      // Step 4: Sort by rating in descending order
      filteredResults.sort((a, b) => b.rating - a.rating);

      return filteredResults;   // Return the results
    } else {
      console.log("No matching documents found.");
      return [];  // No restaurants found
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }

}


/**
 * Function that returns all the category entries from firebase
 * @returns {Promise<any[]>}
 */
export async function getCategories() {
  const collectionRef = collection(db, "Categories");
  const docSnap = await getDocs(collectionRef);

  const data = docSnap.docs.map((doc) => doc.data().Category);

  return data;
}

/**
 * Function that returns a list of restaurant that are within bounds which fulfill either category or tag
 * @param bounds {List} North East and South West geometry
 * @param category {String} Restaurant category
 * @param tag {Array} Restaurant tags
 * @returns List of restaurant data that are within map bounds
 */
export async function getRestaurantsWithParam(bounds, category, tag) {
  const collectionRef = collection(db, "Restaurants");
  let restQuery
  let docSnap;

  if (tag.length > 0) {
    restQuery = query(collectionRef, where("tag", "array-contains-any", tag));
    docSnap = await getDocs(restQuery);
  }
  else if (category) {
    restQuery = query(collectionRef, where("category", "==", category));
    docSnap = await getDocs(restQuery);
  } else {
    docSnap = await getDocs(collectionRef);
  }

  const data = docSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Return restaurants that are within bounds
  return checkCoordsBounded(data, bounds)
}

/**
 * Function that returns the recommendation restaurants for the homepage
 * @param location {Object} location object
 * @param category {Array} user preference category list
 * @returns {Promise<(*&{id: *})[]|*[]>}
 */
export async function getRestaurantForHome(location = null, category = null) {
  const collectionRef = collection(db, "Restaurants");
  let docSnap;
  let data = [];

  if (category) {
    const restQuery = query(collectionRef, where("category", "in", category));
    docSnap = await getDocs(restQuery);
  } else {
    docSnap = await getDocs(collectionRef);
  }

  data = docSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  let res = [];

  if (category && location) {
    // Get response which are categorized and nearby location
    res = checkCoordsBounded(data, calculateBounds(location.lat, location.lng))
        .sort((a, b) => b.ratings - a.ratings)
        .slice(0, 5);

    if (res.length < 2) {
      // Response less than 2, get top 5 rating restaurant nearby location
      const fallbackDocSnap = await getDocs(collectionRef);
      const fallbackData = fallbackDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res = checkCoordsBounded(fallbackData, calculateBounds(location.lat, location.lng))
          .sort((a, b) => b.ratings - a.ratings)
          .slice(0, 5);

      if (res.length < 2) {
        // Response less than 2, get top 5 rating restaurant randomly
        res = fallbackData.sort((a, b) => b.ratings - a.ratings)
            .slice(0, 5);
      }
    }

  } else if (category) {
    // Get top 5 categorized restaurant
    res = data.sort((a, b) => b.ratings - a.ratings).slice(0, 5);

    if (res.length < 2) {
      // Response less than 2, get top 5 rating restaurant randomly
      const fallbackDocSnap = await getDocs(collectionRef);
      const fallbackData = fallbackDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res = fallbackData.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
  } else if (location) {
    // Get top 5 restaurant nearby location
    res = checkCoordsBounded(data, calculateBounds(location.lat, location.lng))
        .sort((a, b) => b.ratings - a.ratings)
        .slice(0, 5);

    if (res.length < 2) {
      // Response less than 2, get top 5 rating restaurant randomly
      const fallbackDocSnap = await getDocs(collectionRef);
      const fallbackData = fallbackDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res = fallbackData.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
  } else {
    // Random top 5 restaurant for (non-Auth users with no location)
    res = data.sort(() => 0.5 - Math.random()).slice(0, 5);
  }

  return res;
}

/**
 * Function that returns all the restaurant from the firebase
 * @returns {Promise<(*&{id: *})[]>}
 */
export async function getAllRestaurant() {
  try {
    const querySnapshot = await getDocs(collection(db, "Restaurants"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(), // Include document data
    }));
    return list;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}


export async function getRestaurantByName(name) {
  const collectionRef = collection(db, "Restaurants");
  const docSnap = await getDocs(collectionRef);

  const data = docSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((doc) => doc.name && doc.name.toLowerCase().includes(name.toLowerCase()));

  if (data.length > 0) {
    return data; // Return matching data
  } else {
    console.error("No matching documents!");
    return null;
  }
}

/**
 * Function that returns the restaurant info given restaurant id
 * @param id {string} id document for restaurant
 * @returns {Promise<{[p: string]: any, id: string}|null>}
 */
export async function getRestaurant(id) {
  const docRef = doc(db, "Restaurants", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = { id: docSnap.id, ...docSnap.data() };
    return data;
  } else {
    console.error("No such document!");
    return null;
  }
}

// Auth
/**
 * Function that creates a new user data entry in database who are authenticated
 * @param data {Object} Auth user object
 * @param name {String} Username
 * @returns {Promise<{success: boolean, data: null}|{success: boolean, data: {name: string, email, createdAt: string}}>}
 */
export async function createUserEntry(data, name = "Unknown") {
  try {
    const userData = {
      name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "Users", data.uid), userData);
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error creating user entry:", error);
    return { success: false, data: null };
  }
}

/**
 * Function that returns user data entry based on UID search
 * @param uid {String} User identifier
 * @returns {Promise<{[p: string]: any, id: string}|null>}
 */
export async function getUserEntry(uid) {
  try {
    const docRef = doc(db, "Users", uid); // Reference to the document with the given UID
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("No such UID!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user entry:", error);
    throw error;
  }
}

/**
 * Function that returns a formatted address given longitude and latitude
 * @param lat {Number} latitude
 * @param lng {Number} longitude
 * @returns {Promise<*>}
 */
export async function getGeocoding(lat, lng) {
  try {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${'AIzaSyDZPgJRnb1b33TXBq3trW_FPx8SRo9uF8Y'}`
    );
    return response.data.results[0]; // Return the results
  } catch (error) {
    console.error("Error getting geocode:", error);
    throw error; // Optionally rethrow the error to handle it in the calling code
  }
}

/**
 * Function that returns place object given id
 * @param id {String} place identifier string
 * @returns {Promise<*>}
 */
export async function getLocationWithId(id) {
  try {
    const response = await axios.get(
        `https://places.googleapis.com/v1/places/${id}?fields=formattedAddress,location&key=${'AIzaSyDZPgJRnb1b33TXBq3trW_FPx8SRo9uF8Y'}`,
    );
    return response.data
  } catch (error) {
    console.error("Error getting geocode:", error);
    throw error; // Optionally rethrow the error to handle it in the calling code
  }
}

/**
 * Function that returns a list of keywords and category based on prompt input
 * @param input {String} prompt input
 * @returns {Promise<any>}
 */
export async function getTagFromText(input) {
  const genAI = new GoogleGenerativeAI('AIzaSyCDb0rwd9aLJHldVSswemc3-lTHH9v6SrE');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt =
      `"${input}", from this sentence give me the food related keywords and category of the food if there are any 
      inside an array object with key of keywords and category. I do not want any code, just a direct response from 
      you. I do not want to see the word "food".`
  const result = await model.generateContent(prompt);
  const cleanedString = result.response.text()
      .replace(/```json/, '')  // Remove the opening ```json
      .replace(/```/, '')      // Remove the closing ```
      .trim();
  return JSON.parse(cleanedString);
}
