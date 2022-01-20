import { count } from "./secretSession";

const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

let count = 5;
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    hideLoader();
    count = 20;
  }
}

// helper function for setting attrbutes
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank"
    });

    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.description,
      title: photo.description
    });

    img.addEventListener("load", imageLoaded);

    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Loader functions
const showloaderOnScrollEnd = () => {
  loader.hidden = false;
  loader.classList.remove("page-loading");
};

const hideLoader = () => {
  loader.hidden = true;
};

//Get photos from unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
}

// EventListeners

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    return async () => {
      try {
        await getPhotos();
        showloaderOnScrollEnd();
      } catch (error) {
        console.error(error);
      } finally {
        hideLoader();
      }
    };
  }
});

getPhotos();
