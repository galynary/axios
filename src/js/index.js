import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import cardTemplates from './templates';
import cardFetchAxios from './fetch';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('.search-form input'),
  btnLoadMoreEl: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
  infoTextEl: document.querySelector('.info-text'),
};

let pageNumber = 1;
let inputValue = '';
let totalHits = 0;
let inputSpace = '';

refs.formEl.addEventListener('submit', onFormElSubmit);
refs.btnLoadMoreEl.addEventListener('click', onBtnLoadMoreElClick);

refs.formEl.addEventListener('keydown', e => {
  inputSpace = e.code;
});

async function onFormElSubmit(e) {
  e.preventDefault();
  inputValue = e.currentTarget.searchQuery.value;

  pageNumber = 1;
  refs.galleryEl.innerHTML = '';

  if (inputValue === '' || inputSpace === 'Space') {
    return;
  }

  const results = await cardFetchAxios(inputValue, pageNumber);
  totalHits = results.totalHits;
  if (results.totalHits < 40) {
    refs.btnLoadMoreEl.classList.add('is-hidden');
    refs.infoTextEl.classList.remove('is-hidden');
  } else {
    refs.btnLoadMoreEl.classList.remove('is-hidden');
    refs.infoTextEl.classList.add('is-hidden');
  }

  try {
    cardCreate(results.hits);

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (totalHits >= 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      loadingLazy();
    }
    pageNumber += 1;
  } catch (error) {
    console.log(error);
  }
}

async function onBtnLoadMoreElClick(e) {
  const results = await cardFetchAxios(inputValue, pageNumber);

  try {
    cardCreate(results.hits);
    pageNumber += 1;
    let remainder = results.totalHits - 40 * (pageNumber - 2);
    if (remainder < 40) {
      refs.btnLoadMoreEl.classList.add('is-hidden');
      refs.infoTextEl.classList.remove('is-hidden');
    } else {
      refs.btnLoadMoreEl.classList.remove('is-hidden');
      refs.infoTextEl.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

function cardCreate(imgs) {
  const markup = imgs.map(img => cardTemplates(img)).join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);

  // підключаємо бібліотеку SimpleLightbox
  const lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsDelay: 250,
  });

  lightbox.refresh();
}

function loadingLazy() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * -1,
    behavior: 'smooth',
  });
}
