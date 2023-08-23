import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");

const API_KEY = "38932513-f34158b41be609c43e0a8ac7b";
let currentPage = 1;
let currentQuery = "";

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentPage = 1;
  currentQuery = event.target.searchQuery.value;
  fetchImages();
});

loadMoreButton.addEventListener("click", fetchImages);

function fetchImages() {
  if (currentQuery === "") return;

  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (currentPage === 1) {
        gallery.innerHTML = "";
        const lightbox = new SimpleLightbox(".photo-card a");
      }

      data.hits.forEach((image) => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });

      if (data.totalHits > currentPage * 40) {
        loadMoreButton.style.display = "block";
      } else {
        loadMoreButton.style.display = "none";
      }

      currentPage += 1;
      scrollToNewImages();
    })
    .catch((error) => console.error("Error fetching images:", error));
}

function createImageCard(image) {
  const card = document.createElement("div");
  card.className = "photo-card";
  card.innerHTML = `
    <a href="${image.largeImageURL}" data-lightbox="image">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
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

function scrollToNewImages() {
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}