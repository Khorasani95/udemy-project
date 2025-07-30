// const axios = require('axios');
// const HttpError = require('../models/http-error');

// const API_KEY = 'AIzaSyDgLmMpKCzveJf1_yuA0WRChvZA';

async function getCoordsForAddress(address) {
    return {
       // this is for only if you dont have credit or debit card asked by google;
       lat: 40.7484474,
       lng: -73.9871516
   };
  // try {

  //   const response = await axios.get(
  //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  //   );
    
  //   const data = response.data;
    
  //   if (!data || data.status === 'ZERO_RESULTS') {
  //     const error = new HttpError(
  //       'Could not find location for the specified address.',
  //       422
  //     );
  //     throw error;
  //   }

  //   const coordinates = data.results[0].geometry.location;
  //   return coordinates;
  // } catch (err) {
  //   const error = new HttpError(
  //     'Failed to fetch coordinates. Please try again later.',
  //     500
  //   );
  //   throw error;
  // }
}

module.exports = getCoordsForAddress;