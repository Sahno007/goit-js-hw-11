import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchImages } from './api';

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
let currentPage = 1;
let currentQuery = "";
let displayedImageUrls = [];
let loading = false;
let notificationDisplayed = false;
let lastPageLoaded = false;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  currentQuery = event.target.searchQuery.value.trim();
  if (currentQuery === "") {
    Notiflix.Notify.failure("Please enter a valid search query.");
    return;
  }

  currentPage = 1;
  displayedImageUrls = [];
  gallery.innerHTML = "";
  notificationDisplayed = false;
  lastPageLoaded = false;
  await loadImages();
});

async function loadImages() {
  if (loading) return;
  loading = true;

  const images = await fetchImages(currentPage, currentQuery);


  if (images.length === 0) {
    if (currentPage === 1) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      if (!lastPageLoaded) {
        Notiflix.Notify.info("No more images to load.");
        lastPageLoaded = true;
      }
    }
    loading = false;
    return;
  }

  const newImages = images.filter((image) => {
    const imageUrl = image.largeImageURL;
    if (!displayedImageUrls.includes(imageUrl)) {
      displayedImageUrls.push(imageUrl);
      return true;
    }
    return false;
  });

  const imageCards = newImages.map((image) => {
    return `
      <div class="photo-card">
        <a href="${image.largeImageURL}" data-lightbox="image" data-title="${image.tags}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" data-source="${image.largeImageURL}">
        </a>
        <div class="info">
          <p><b>Likes:</b> ${image.likes}</p>
          <p><b>Views:</b> ${image.views}</p>
          <p><b>Comments:</b> ${image.comments}</p>
          <p><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `;
  });

  gallery.innerHTML += imageCards.join('');

  if (newImages.length === 40) {
    currentPage += 1;
  } else {
    lastPageLoaded = true;
  }


  if (!notificationDisplayed) {
    Notiflix.Notify.success(`Hooray! We found ${displayedImageUrls.length} images.`);
    notificationDisplayed = true;
  }

  const lightbox = new SimpleLightbox(".photo-card a");
  lightbox.refresh();

  loading = false;
}

window.addEventListener("scroll", () => {
  if (!lastPageLoaded && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadImages();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = new SimpleLightbox(".photo-card a", {
    captionsData: "alt",
    captionDelay: 250,
  });
});