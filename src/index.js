import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewImagesApiServise from './js/fetchImages';

const refs = {
  form: document.querySelector('.search-form'),
  galery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

const fetchesImages = new NewImagesApiServise();

refs.form.addEventListener('submit', A);

async function A(e) {
  e.preventDefault();
  reset();

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

  refs.loadMoreButton.classList.add('cls');

  fetchesImages.hitsTotal -= 40;
}

function reset() {
  refs.galery.innerHTML = '';
  refs.loadMoreButton.classList.remove('cls');
}

refs.loadMoreButton.addEventListener('click', B);

async function B() {
  fetchesImages.newPage += 1;

  const resolve = await fetchesImages.fetchImages();

  renderingAndAddingGalleries(resolve.hits);

  Notify.info(`Hooray! We found ${fetchesImages.hitsTotal} images.`);

  fetchesImages.hitsTotal -= 40;

  if (fetchesImages.hitsTotal <= 0) {
    refs.loadMoreButton.classList.remove('cls');

    setTimeout(f => {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }, 2000);
  }
}

function renderingAndAddingGalleries(arr) {
  refs.galery.innerHTML += arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <div class="thumb"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>

<div class="info">
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
