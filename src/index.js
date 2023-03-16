import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewImagesApiServise from './js/fetchImages';

const refs = {
  form: document.querySelector('.search-form'),
  galery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

const fetchesImages = new NewImagesApiServise();

var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

refs.form.addEventListener('submit', galleryLogic);

async function galleryLogic(e) {
  e.preventDefault();
  resetSearchResults();

  fetchesImages.newParametr = refs.form.searchQuery.value;
  fetchesImages.newPage = 1;

  const resolve = await fetchesImages.fetchImages();

  if (resolve.hits.length == 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  fetchesImages.hitsTotal = resolve.totalHits;
  Notify.info(`Hooray! We found ${fetchesImages.hitsTotal} images.`);

  renderingAndAddingGalleries(resolve.hits);
  sideScrolling();

  // ПОЧАТОК
  refs.loadMoreButton.classList.add('cls');
  // КІНЕЦЬ

  fetchesImages.hitsTotal -= 40;
  lightbox.refresh();
}

function resetSearchResults() {
  refs.galery.innerHTML = '';
  refs.loadMoreButton.classList.remove('cls');
}
// ПОЧАТОК
refs.loadMoreButton.addEventListener('click', loadMoreBtnLogic);

async function loadMoreBtnLogic() {
  fetchesImages.newPage += 1;

  const resolve = await fetchesImages.fetchImages();

  renderingAndAddingGalleries(resolve.hits);

  sideScrolling();

  Notify.info(`Hooray! We found ${fetchesImages.hitsTotal} images.`);

  fetchesImages.hitsTotal -= 40;

  if (fetchesImages.hitsTotal <= 0) {
    refs.loadMoreButton.classList.remove('cls');

    setTimeout(f => {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }, 2000);
  }

  lightbox.refresh();
}
// КІНЕЦЬ

function renderingAndAddingGalleries(arr) {
  refs.galery.innerHTML += arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}"> <div class="thumb"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div></a> <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
      </div>`
    )
    .join('');
}

function sideScrolling() {
  const { height: cardHeight } =
    refs.galery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Реалізація Нескінченного скролу треба розкоментувати його і закоментувати в виділених місцях

// window.addEventListener('scroll', () => {
//   if (fetchesImages.hitsTotal < 0) {
//     return;
//   }
//   infiniteScroll();
// });

// async function infiniteScroll() {
//   const rootElement = document.documentElement;
//   const { bottom } = rootElement.getBoundingClientRect();
//   console.log(bottom);
//   if (bottom < rootElement.clientHeight + 1) {
//     console.log('DONEEEEE');
//     fetchesImages.newPage += 1;

//     const resolve = await fetchesImages.fetchImages();

//     renderingAndAddingGalleries(resolve.hits);
//     sideScrolling();

//     Notify.info(`Hooray! We found ${fetchesImages.hitsTotal} images.`);

//     fetchesImages.hitsTotal -= 40;
//     lightbox.refresh();
//     if (fetchesImages.hitsTotal < 0) {
//       setTimeout(f => {
//         Notify.info(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }, 2000);
//     }
//   }
// }
