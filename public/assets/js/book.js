function BookService() {
    this.books = YAML.load(BookService.FILE_URL);
}

BookService.FILE_URL = 'assets/data/books.yml'

BookService.prototype.getRandomBook = function() {
    var index = Math.floor(Math.random() * this.books.length);
    return this.books[index];
}