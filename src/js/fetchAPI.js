import axios from 'axios';

export default class NewsApiService {
    constructor (){
        this.searchQuery = "";
        this.page = 1;
}
    async fetchPhoto() {
        const URL = `https://pixabay.com/api/?key=24419358-338d9960aaa56c480bc3e3cda&q=${this.searchQuery}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true&webformatURL&largeImageURL&tags&likes&views&comments&downloads&page=${this.page}`
        const response = await axios.get(URL);
        this.page += 1;
        return response.data;      
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    resetPage() {
        this.page = 1;
    }

}