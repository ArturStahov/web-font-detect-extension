import axios from 'axios';

axios.defaults.baseURL = 'https://www.googleapis.com/webfonts/v1/webfonts';

const API_KEY = 'AIzaSyDWzjZ8YZ6ve6SQeC_pW8dXYnk0rKFfa0M';

const route = {
  base: `?key=${API_KEY}`
}

export function getFontsByFamily(family: string) {
  return axios.get(`${route.base}&family=${family}`).then(data => data);
}