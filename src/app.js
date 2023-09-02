import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");

const API_KEY = "38932513-f34158b41be609c43e0a8ac7b";
let currentPage = 1;
let currentQuery = "";
let loading = false;

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.target.searchQuery.value;
  fetchImages();
});

function fetchImages() {
  if (currentQuery === "" || loading) return;
  
  loading = true;
  
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (currentPage === 1) {
        gallery.innerHTML = "";
      }

      if (data.hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        loading = false;
        return;
      }

      data.hits.forEach((image) => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });

      if (data.totalHits > currentPage * 40) {
        currentPage += 1;
      } else {
        Notiflix.Notify.info("No more images to load.");
      }

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      const lightbox = new SimpleLightbox(".photo-card a");
      lightbox.refresh();

      loading = false;
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      loading = false;
    });
}

function createImageCard(image) {
  const card = document.createElement("div");
  card.className = "photo-card";
  card.innerHTML = `
    <a href="${image.largeImageURL}" data-lightbox="image">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" data-source="${image.largeImageURL}">
    </a>
    <div class="info">
      <p><b>Likes:</b> ${image.likes}</p>
      <p><b>Views:</b> ${image.views}</p>
      <p><b>Comments:</b> ${image.comments}</p>
      <p><b>Downloads:</b> ${image.downloads}</p>
    </div>
  `;
  return card;
}


window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchImages();
  }
});