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
const collection = document.getElementById("collection");

function displayCollection(array) {
  for (i = 0; i < array.length; i++) {
    const newUl = document.createElement("ul");
    newUl.setAttribute("id", "book" + i);
    collection.appendChild(newUl);
    let bookTitle = array[i].title;
    let bookAuthor = array[i].author;
    let bookPages = array[i].pages;
    let bookStatus = array[i].status;
    createLi(newUl, bookTitle, i, "booktitle");
    createLi(newUl, bookAuthor, i, "bookauthor");
    createLi(newUl, bookPages, i, "bookpages");
    createLi(newUl, bookStatus, i, "bookstatus");
    removeBookButton(i, newUl);
    changeStatusButton(i, newUl, bookStatus);
    populateStorage(array, i);
  }
}

function addBookToCollection(title, author, pages, status, booksource) {
  let newBook = new bookInfo(title, author, pages, status);
  bookCollection.push(newBook);
  let currentIndex = bookCollection.length - 1;
  const newUl = document.createElement("ul");
  newUl.setAttribute("id", "book" + currentIndex);
  collection.appendChild(newUl);
  createLi(newUl, newBook.title, currentIndex, "booktitle");
  createLi(newUl, newBook.author, currentIndex, "bookauthor");
  createLi(newUl, newBook.pages, currentIndex, "bookpages");
  createLi(newUl, newBook.status, currentIndex, "bookstatus");
  removeBookButton(currentIndex, newUl);
  changeStatusButton(currentIndex, newUl, newBook.status);
  if (booksource === "newbook") {
    populateStorage(bookCollection, currentIndex);
  }
}

function removeBookButton(index, newUl) {
  const newButton = document.createElement("button");
  newButton.textContent = "Remove Book";
  let currentID = "bookremoval" + index;
  newButton.setAttribute("id", currentID);
  newButton.setAttribute("name", currentID);
  newButton.setAttribute("class", "bookRemoval");
  newUl.appendChild(newButton);
  newButton.addEventListener("click", function () {
    bookCollection.splice(index, 1);
    collection.innerHTML = "";
    displayCollection(bookCollection);
    removeItemLocalStorage(index);
  });
}

function removeItemLocalStorage(index) {
  localStorage.removeItem("title" + i);
  localStorage.removeItem("author" + i);
  localStorage.removeItem("pages" + i);
  localStorage.removeItem("status" + i);
}

function createLi(newUl, information, i, typelististem) {
  const newListItem = document.createElement("li");
  newListItem.textContent = information;
  newListItem.setAttribute("data-" + typelististem, typelististem + i);
  return newUl.appendChild(newListItem);
}

function changeStatusButton(index, newUl, bookstatus) {
  const newButton = document.createElement("button");
  let currentID = "markasread" + index;
  newButton.setAttribute("id", currentID);
  newButton.setAttribute("name", currentID);
  newButton.setAttribute("class", "changestatus");
  if (bookstatus === "Status: not read") {
    newButton.textContent = "Mark as read";
  } else {
    newButton.textContent = "Mark as not read";
  }
  newUl.appendChild(newButton);
  newButton.addEventListener("click", function (event) {
    changeStatus(event, index);
  });
}

function changeStatus(event, index) {
  bookStatus = bookCollection[index].status;
  if (bookStatus === "Status: not read") {
    bookCollection[index].status = "Status: read";
    const currentBookList = document.getElementById("book" + index);
    const currentBookListItemStatus = currentBookList.querySelector(
      "[data-bookstatus]"
    );
    currentBookListItemStatus.textContent = "Status: read";
    event.target.textContent = "Mark as not read";
    localStorage.setItem("status" + index, "read");
  } else {
    bookCollection[index].status = "Status: not read";
    const currentBookList = document.getElementById("book" + index);
    const currentBookListItemStatus = currentBookList.querySelector(
      "[data-bookstatus]"
    );
    currentBookListItemStatus.textContent = "Status: not read";
    event.target.textContent = "Mark as read";
    const storageStatus = "status" + index;
    localStorage.setItem("status" + index, "not read");
  }
}

const formDiv = document.getElementById("formdiv");
const showFormButton = document.getElementById("bringform");
const showFormDiv = document.getElementById("bringformbutton");
const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
const inputStatus = document.getElementById("status");
const form = document.getElementById("newbook");
const closeForm = document.getElementById("closeform");

window.onload = function () {
  displayCollection(bookCollection);
  console.log(bookCollection);
  localStorageCheck();
  console.log(bookCollection);
};

showFormButton.addEventListener("click", function (event) {
  formDiv.style.visibility = "visible";
  showFormDiv.style.visibility = "hidden";
});

form.addEventListener("submit", function (event) {
  addBookToCollection(
    inputTitle.value,
    inputAuthor.value,
    inputPages.value,
    inputStatus.value,
    "newbook"
  );
  formDiv.style.visibility = "hidden";
  showFormDiv.style.visibility = "visible";
  form.reset();
  event.preventDefault();
});

closeForm.addEventListener("click", function (event) {
  form.reset();
  formDiv.style.visibility = "hidden";
  showFormDiv.style.visibility = "visible";
});

function populateStorage(array, index) {
  localStorage.setItem("title" + index, array[index].title);
  localStorage.setItem("author" + index, array[index].author);
  localStorage.setItem("pages" + index, array[index].pages);
  localStorage.setItem("status" + index, array[index].status);
}

function localStorageCheck() {
  if (localStorage.length > 16) {
    const initalBookCollection = bookCollection.length;
    const completeCollection = Number(localStorage.length / 4);
    //const newBooks = completeCollection-initalBookCollection;
    for (i = initalBookCollection; i < completeCollection; i++) {
      let bookTitle = localStorage.getItem("title" + i);
      let bookAuthor = localStorage.getItem("author" + i);
      let bookPages = localStorage.getItem("pages" + i).slice(7);
      let bookStatus = localStorage.getItem("status" + i).slice(8);
      addBookToCollection(
        bookTitle,
        bookAuthor,
        bookPages,
        bookStatus,
        "fromstorage"
      );
    }
  } else {
    return;
  }
}
