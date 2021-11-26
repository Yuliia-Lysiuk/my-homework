import axios from 'axios';

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from "./js/fetchAPI";
import imgCard from "./templates/photo.hbs";


const refs = {
   form : document.querySelector("#search-form"),
 galleryConteiner : document.querySelector(".gallery"),
 loadMoreBtn : document.querySelector(".load-more"),
}

let gallery = new SimpleLightbox('.gallery a');
hideBtnLoadMore();
const newsApiService = new NewsApiService();

refs.form.addEventListener("submit", onSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMore);

function onSubmit(e) {
  e.preventDefault();
  
  newsApiService.query = e.currentTarget.elements.searchQuery.value;
  if (!newsApiService.query) {
    clearGalleryConteiner();
    hideBtnLoadMore();
    return Notify.warning("Enter your search query, please!");
  }
  clearGalleryConteiner();
  hideBtnLoadMore();
  newsApiService.resetPage();
  newsApiService.fetchPhoto().then(photo => {
    if (photo.total === 0) {
      clearGalleryConteiner();
      hideBtnLoadMore();
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    Notify.success(`Hooray! We found ${photo.totalHits} images.`);
    appendPhotoMarkup(photo);
    gallery.refresh();
    showBtnLoadMore();
  }
  );
  
  refs.form.reset()
}

function onLoadMore() {
hideBtnLoadMore();
  newsApiService.fetchPhoto().then(photo => {
    if (photo.hits < 40) {
      hideBtnLoadMore();
      return Notify.info("We're sorry, but you've reached the end of search results.");
    } 
    appendPhotoMarkup(photo);
    gallery.refresh();
    showBtnLoadMore();
  }
  );
}

function appendPhotoMarkup(photo) {
  console.log(photo);
   
  const items = photo.hits.map(imgCard).join('');
  refs.galleryConteiner.insertAdjacentHTML("beforeend", items)
}

function clearGalleryConteiner() {
    refs.galleryConteiner.innerHTML = '';
}

function hideBtnLoadMore() {
    refs.loadMoreBtn.classList.add('is-hidden');
}

function showBtnLoadMore() {
    refs.loadMoreBtn.classList.remove('is-hidden');
}








// const form = document.querySelector("#search-form");
// const galleryConteiner = document.querySelector(".gallery");
// const loadMoreBtn = document.querySelector(".load-more");

// hideBtnLoadMore()

// form.addEventListener("submit", onSubmit);

// let page = 1;

// let limit = 40;

// const totalPages = 500 / limit;

// let fetchItems;
// let gallery = new SimpleLightbox('.gallery a');
// async function onSubmit(e) {
//     e.preventDefault();
//     const inputValue = e.target.searchQuery.value;
//     if (!inputValue) {
//         clearGalleryConteiner();
//         hideBtnLoadMore();
//       return Notify.warning("Enter your search query, please!");
//     }
//     galleryConteiner.innerHTML = ''
//     page = 1
//     fetchItems = async function() {
//       try {
//         const photo = await fetchPhoto(inputValue);
//         renderPhoto(photo);
//           page += 1; 

//         loadMoreBtn.addEventListener("click", onLoadMore)
//         gallery.refresh();
//       } catch (error) {
//         console.dir(error);
//       }
//     }
//     fetchItems()
//     form.reset();
// }

// async function fetchPhoto(inputValue) {
//   try {
//     const response = await axios.get(`https://pixabay.com/api/?key=24419358-338d9960aaa56c480bc3e3cda&q=${inputValue}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true&webformatURL&largeImageURL&tags&likes&views&comments&downloads&per_page=40`);
//     return response.data
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// function renderPhoto(photos) {

    // if (photos.total === 0) {
    //     clearGalleryConteiner();
    //     hideBtnLoadMore();
    //     return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    // } else if (photos.total < 41) {

    //     showBtnLoadMore();
    //     loadMoreBtn.addEventListener("click", () => {
    //         loadMoreBtn.getAttribute('disabled')
    //         hideBtnLoadMore();
    //         Notify.info("We're sorry, but you've reached the end of search results.")
    //     }
    //     );
    // } 
//     showBtnLoadMore();

//         Notify.success(`Hooray! We found ${photos.totalHits} images.`);

//     const markup = photos.hits.map(({ tags, likes, webformatURL, comments, downloads, views, largeImageURL }) => {
//         return `<a href="${largeImageURL}" class="photo-card">
//             <img class="img" src="${webformatURL}" alt="${tags}" width="310" height="207" loading="lazy" />
//             <div class="info">
//                 <p class="info-item">
//                     <b>Likes</b>
//                     ${likes}
//                 </p>
//                 <p class="info-item">
//                     <b>Views</b>
//                     ${views}
//                 </p>
//                 <p class="info-item">
//                     <b>Comments</b>
//                     ${comments}
//                 </p>
//                 <p class="info-item">
//                     <b>Downloads</b>
//                     ${downloads}
//                 </p>
//             </div>
//         </a>`
//     }).join("");

//     return galleryConteiner.insertAdjacentHTML("beforeend", markup);


// }



// function hideBtnLoadMore() {
//     loadMoreBtn.classList.add('is-hidden');
// }

// function showBtnLoadMore() {
//     loadMoreBtn.classList.remove('is-hidden');
// }

// function onLoadMore() {
//   if (fetchItems) {
//       fetchItems();

//     }

// }
