import * as FileSystem from "expo-file-system";
import { insertPlace, fetchPlaces } from "../helpers/db";
export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = 'SET_PLACES';
import ENV from '../env';

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
 let address;
  const response  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`);
  //console.log(response);
  if(!response.ok) {
    throw new Error ('Something went wrong, address was not returned from google reverse geocoding.');
  } 

  if(response.ok){
    const resData = await response.json();

 if(!resData.results){
  throw new Error ('Something went wrong with resData');

 }
 if(resData.results[0].formatted_address) { address = resData.results[0].formatted_address;}
 
  }
  
 if(!address) address = 'Geocode of address is: ' + location.lat+', ' + location.lng;

  const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;
    

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });

      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      //console.log(dbResult);

      dispatch({
        type: ADD_PLACE,
        placeData: {
            id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng
          }
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }

    
  };
};

export const loadPlaces = () => {
   
  return async dispatch => {
    try{ 
      const dbResult =  await fetchPlaces();

      //console.log(dbResult);

      dispatch({
        type: SET_PLACES,
        places:dbResult.rows._array
      });
 
    }catch (err) {
      throw err;
    }
    
    
  }
};