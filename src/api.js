import axios from 'axios';

const API_KEY = "38932513-f34158b41be609c43e0a8ac7b";

export async function fetchImages(currentPage, currentQuery) {
  if (currentQuery === "") return [];

  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  try {
    const response = await axios.get(url);
    return response.data.hits;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}