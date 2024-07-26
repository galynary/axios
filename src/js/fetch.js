import axios from 'axios';

export default async function cardFetchAxios(inputValue, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32196578-0357af1d01bd33a041e645ec2';
  const URL = `${BASE_URL}/?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios
    .get(`${URL}`)
    .then(response => {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
