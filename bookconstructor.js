function bookInfo(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = "Pages: " + pages;
  this.status = "Status: " + status;
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
  bookCollection.push(newBook);
  return bookCollection;
}

const collection = document.getElementById("collection");

function displayCollection(array) {
  for (i = 0; i < array.length; i++) {
    const newUl = document.createElement("ul");
    newUl.setAttribute("data-attribute", "book" + i);
    collection.appendChild(newUl);
    let bookTitle = array[i].title;
    let bookAuthor = array[i].author;
    let bookPages = array[i].pages;
    let bookStatus = array[i].status;
    createLi(newUl, bookTitle);
    createLi(newUl, bookAuthor);
    createLi(newUl, bookPages);
    createLi(newUl, bookStatus);
    removeBookButton(i, newUl);
  }
}

function addToCollection() {
  const newUl = document.createElement("ul");
  newUl.setAttribute("data-attribute", "book" + (bookCollection.length - 1));
  collection.appendChild(newUl);
  let bookTitle = bookCollection[bookCollection.length - 1].title;
  let bookAuthor = bookCollection[bookCollection.length - 1].author;
  let bookPages = bookCollection[bookCollection.length - 1].pages;
  let bookStatus = bookCollection[bookCollection.length - 1].status;
  createLi(newUl, bookTitle);
  createLi(newUl, bookAuthor);
  createLi(newUl, bookPages);
  createLi(newUl, bookStatus);
  removeBookButton(bookCollection.length - 1, newUl);
}

function removeBookButton(index, newUl) {
  const newButton = document.createElement("button");
  newButton.textContent = "Remove Book";
  let currentID = "book" + index;
  newButton.setAttribute("id", currentID);
  newButton.setAttribute("name", currentID);
  newButton.setAttribute("class", "bookRemoval");
  newUl.appendChild(newButton);
  newButton.addEventListener("click", function () {
    bookCollection.splice(index, 1);
    collection.innerHTML = "";
    displayCollection(bookCollection);
  });
}

function createLi(newUl, information) {
  const newListItem = document.createElement("li");
  newListItem.textContent = information;
  return newUl.appendChild(newListItem);
}
window.onload = displayCollection(bookCollection);

const formDiv = document.getElementById("formdiv");
const showFormButton = document.getElementById("bringform");
const showFormDiv = document.getElementById("bringformbutton");
const addbookButton = document.getElementById("addbookbutton");

const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
const inputStatus = document.getElementById("status");
const form = document.getElementById("newbook");
const allInputs = document.querySelectorAll("input");
const closeForm = document.getElementById("closeform");
const bookRemoval = document.querySelectorAll(".bookRemoval");

showFormButton.addEventListener("click", function (event) {
  formDiv.style.visibility = "visible";
  showFormDiv.style.visibility = "hidden";
});

addbookButton.addEventListener("click", function (event) {
  let bookTitle = inputTitle.value;
  let bookAuthor = inputAuthor.value;
  let bookPages = inputPages.value;
  let bookStatus = inputStatus.value;
  addBookToLibrary(bookTitle, bookAuthor, bookPages, bookStatus);
  addToCollection();
  formDiv.style.visibility = "hidden";
  showFormDiv.style.visibility = "visible";
  form.reset();
  event.preventDefault(); //it would refresh after submitting without this
});

closeForm.addEventListener("click", function (event) {
  form.reset();
  formDiv.style.visibility = "hidden";
  showFormDiv.style.visibility = "visible";
});

// bookRemoval.forEach(function (button) {
//   button.addEventListener("click", function (target) {
//     let buttonID = target.id;
//     let arrayIndex = buttonID.split(5);
//     console.log(arrayIndex);
//   });
// });
