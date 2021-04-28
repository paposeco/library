function bookInfo(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
  this.info = function () {
    if (status === "read") {
      return `${title} by ${author}, ${pages} pages, ${status}`;
    } else {
      return `${title} by ${author}, ${pages} pages, ${status} yet`;
    }
  };
}

const hobbit = new bookInfo("The Hobbit", "J.R.R. Tolkien", "295", "read");
const seveneves = new bookInfo("Seveneves", " Neal Stephenson", "880", "read");
const tombombadil = new bookInfo(
  "The Adventures of Tom Bombadil ",
  "J.R.R. Tolkien",
  "75",
  "not read"
);
const hyperion = new bookInfo("Hyperion", "Dan Simmons", "482", "read");

let bookCollection = [hobbit, seveneves, tombombadil, hyperion];

function addBookToLibrary(title, author, pages, status) {
  let newBook = new bookInfo(title, author, pages, status);
  return bookCollection.push(newBook);
}

const collection = document.getElementById("collection");

function displayCollection() {
  for (i = 0; i < bookCollection.length; i++) {
    const newUl = document.createElement("ul");
    collection.appendChild(newUl);
    let bookTitle = bookCollection[i].title;
    let bookAuthor = bookCollection[i].author;
    let bookPages = bookCollection[i].pages;
    let bookStatus = bookCollection[i].status;
    createLi(newUl, bookTitle);
    createLi(newUl, bookAuthor);
    createLi(newUl, bookPages);
    createLi(newUl, bookStatus);
  }
}

function createLi(newUl, information) {
  const newListItem = document.createElement("li");
  newListItem.textContent = information;
  return newUl.appendChild(newListItem);
}

//collection.appendChild(list);
displayCollection();
