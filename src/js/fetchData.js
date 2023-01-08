import axios from 'axios';
const API_KEY = '29201085-7477c32838621bab778d592ef';

const fetchData = async (value, page) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${value}&per_page=40&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default fetchData;
