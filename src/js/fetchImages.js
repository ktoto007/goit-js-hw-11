export default class NewImagesApiServise {
  constructor() {
    this.searchParametr = '';
    this.page = 1;
    this.hitsTotal = 0;
  }
  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '34413243-16ff60e2bc0f88c81c09e023b';

    const resolve = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchParametr}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
    const images = await resolve.json();

    // console.log(images);
    return images;
  }

  get newParametr() {
    return this.searchParametr;
  }

  set newParametr(param) {
    this.searchParametr = param;
  }

  get newPage() {
    return this.page;
  }

  set newPage(page) {
    this.page = page;
  }

  get newTotal() {
    return this.hitsTotal;
  }

  set newTotal(total) {
    this.hitsTotal = total;
  }
}
