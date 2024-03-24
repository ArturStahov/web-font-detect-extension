const baseURL = 'https://www.googleapis.com/webfonts/v1/webfonts';

const API_KEY = 'AIzaSyDWzjZ8YZ6ve6SQeC_pW8dXYnk0rKFfa0M';

const route = {
  base: `?key=${API_KEY}`
}

export async function getFontsByFamily(family: string) {
  const url = `${baseURL}${route.base}&family=${family}`;
  const res = await fetch(url, { method: "GET" });
  const data = await res.json();
  return data;
}
