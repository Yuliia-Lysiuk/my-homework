
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

async function onSubmit(e) {
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
  const photo = await newsApiService.fetchPhoto();
    if (photo.total === 0) {
      clearGalleryConteiner();
      hideBtnLoadMore();
      refs.form.reset();
      return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    Notify.success(`Hooray! We found ${photo.totalHits} images.`);
    appendPhotoMarkup(photo);
    gallery.refresh();
    showBtnLoadMore();
  
  refs.form.reset();
}

async function onLoadMore() {
hideBtnLoadMore();
  const photo = await newsApiService.fetchPhoto();
    if (photo.hits < 40) {
      hideBtnLoadMore();
      return Notify.info("We're sorry, but you've reached the end of search results.");
    } 
    appendPhotoMarkup(photo);
    gallery.refresh();
    showBtnLoadMore();
}

function appendPhotoMarkup(photo) {
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

