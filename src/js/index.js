import Notiflix from 'notiflix';
import fetchData from './fetchData';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  formInput: document.querySelector('.search-form__input'),
};

const failedInput = () => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

const noMoreHits = () => {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
};

const amountOfImages = amount => {
  Notiflix.Notify.success(`Hooray! We found ${amount} images.`);
};

const renderMarkup = image => {
  return image.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}"><div class="photo-card">
        <div class="gallery__thumb">
  <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
  <div class="gallery-info__box">
    <p class="gallery-info__item">
      <b>Likes: <br>${likes}</b>
    </p>
    <p class="gallery-info__item">
      <b>Views: <br>${views}</b>
    </p>
    <p class="gallery-info__item">
      <b>Comments: <br>${comments}</b>
    </p>
    <p class="gallery-info__item">
      <b>Downloads:<br> ${downloads}</b>
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
};

const insertContent = data => {
  refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(data));
};

let value = null;
let page = 1;

const onSubmit = e => {
  e.preventDefault();
  value = refs.formInput.value;

  fetchData(value, page)
    .then(response => {
      refs.gallery.innerHTML = '';
      if (response.data.hits == 0 || value == '') {
        failedInput();
        refs.loadMoreBtn.classList.add('is-hidden');
        return;
      }

      const photoPerPage = 40;
      const dataTotalHits = response.data.totalHits;

      if (dataTotalHits > photoPerPage) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      } else {
        refs.loadMoreBtn.classList.add('is-hidden');
      }

      insertContent(response);
      amountOfImages(dataTotalHits);
    })
    .catch(error => console.log(error));
};

const onClickLoadMore = (response, page) => {
  const totalHits = response.data.totalHits;
  const hits = response.data.hits;
  let totalPages = totalHits / 40;
  console.log(hits);

  if (page > totalPages) {
    refs.loadMoreBtn.classList.add('is-hidden');
    noMoreHits();
  }

  insertContent(response);
};

const loadNewPosts = async () => {
  page += 1;
  fetchData(value, page)
    .then(data => onClickLoadMore(data, page))
    .catch(error => console.log(error));
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', loadNewPosts);
