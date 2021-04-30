function bookInfo(title, author, pages, status) {
  this.title = title;
  this.author = "Author: " + author;
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

const hobbit = new bookInfo("The Hobbit", "J.R.R. Tolkien", "295", "not read");
const seveneves = new bookInfo("Seveneves", " Neal Stephenson", "880", "read");
const tombombadil = new bookInfo(
  "The Adventures of Tom Bombadil",
  "J.R.R. Tolkien",
  "75",
  "not read"
);
const hyperion = new bookInfo("Hyperion", "Dan Simmons", "482", "read");

let bookCollection = [
  hobbit,
  seveneves,
  tombombadil,
  hyperion,
  hobbit,
  seveneves,
  tombombadil,
  hyperion,
  hobbit,
  seveneves,
  tombombadil,
  hyperion,
  hobbit,
  seveneves,
  tombombadil,
  hyperion,
  tombombadil,
  hyperion,
  hobbit,
  seveneves,
  tombombadil,
  hyperion,
  tombombadil,
  hyperion,
  hobbit,
  seveneves,
  tombombadil,
  hyperion,
];
const collection = document.getElementById("collection");

function displayCollection(array) {
  for (i = 0; i < array.length; i++) {
    const newDivOut = document.createElement("div");
    newDivOut.classList.add("book");
    collection.appendChild(newDivOut);
    const newUl = document.createElement("ul");
    newUl.setAttribute("id", "book" + i);
    newDivOut.appendChild(newUl);
    let bookTitle = array[i].title;
    let bookAuthor = array[i].author;
    let bookPages = array[i].pages;
    let bookStatus = array[i].status;
    createLi(newUl, bookTitle, i, "booktitle");
    createLi(newUl, bookAuthor, i, "bookauthor");
    createLi(newUl, bookPages, i, "bookpages");
    createLi(newUl, bookStatus, i, "bookstatus");
    const newDiv = document.createElement("div");
    newUl.appendChild(newDiv);
    removeBookButton(i, newDiv);
    changeStatusButton(i, newDiv, bookStatus);
    populateStorage(array, i);
  }
}

function addBookToCollection(title, author, pages, status, booksource) {
  let newBook = new bookInfo(title, author, pages, status);
  bookCollection.push(newBook);
  let currentIndex = bookCollection.length - 1;
  const newDivOut = document.createElement("div");
  newDivOut.classList.add("book");
  collection.appendChild(newDivOut);
  const newUl = document.createElement("ul");
  newUl.setAttribute("id", "book" + currentIndex);
  newDivOut.appendChild(newUl);
  const liTitle = createLi(newUl, newBook.title, currentIndex, "booktitle");
  const span = document.createElement("span");
  createLi(newUl, newBook.author, currentIndex, "bookauthor");
  createLi(newUl, newBook.pages, currentIndex, "bookpages");
  createLi(newUl, newBook.status, currentIndex, "bookstatus");
  if (newBook.status.slice(8) === "read") {
    span.classList.add("statusRead");
  } else {
    span.classList.add("statusNot");
  }
  span.textContent = newBook.status.slice(8);
  liTitle.appendChild(span);
  const newDiv = document.createElement("div");
  newUl.appendChild(newDiv);
  removeBookButton(currentIndex, newDiv);
  changeStatusButton(currentIndex, newDiv, newBook.status);
  // toggles visibility
  liTitle.addEventListener("click", function () {
    const li = newUl.childNodes;
    li.forEach(function (element) {
      let classes = element.classList;
      classes.toggle("visibleClass");
    });
  });
  if (booksource === "newbook") {
    populateStorage(bookCollection, currentIndex);
  }
}

function removeBookButton(index, newDiv) {
  const newButton = document.createElement("button");
  newButton.textContent = "X";
  let currentID = "bookremoval" + index;
  newButton.setAttribute("id", currentID);
  newButton.setAttribute("name", currentID);
  newButton.setAttribute("title", "Remove Book");
  newButton.setAttribute("class", "bookRemoval");
  newDiv.appendChild(newButton);
  newButton.addEventListener("click", function () {
    bookCollection.splice(index, 1);
    collection.innerHTML = "";
    displayCollection(bookCollection);
    removeItemLocalStorage(index);
    const titleLi = document.querySelectorAll("[data-booktitle]");
    hideLi(titleLi);
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

function changeStatusButton(index, newDiv, bookstatus) {
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
  newDiv.appendChild(newButton);
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
    const span = currentBookList.querySelector("span");
    currentBookListItemStatus.textContent = "Status: read";
    event.target.textContent = "Mark as not read";
    span.textContent = "read";
    span.classList.remove("statusNot");
    span.classList.add("statusRead");
    localStorage.setItem("status" + index, "read");
  } else {
    bookCollection[index].status = "Status: not read";
    const currentBookList = document.getElementById("book" + index);
    const currentBookListItemStatus = currentBookList.querySelector(
      "[data-bookstatus]"
    );
    const span = currentBookList.querySelector("span");
    currentBookListItemStatus.textContent = "Status: not read";
    event.target.textContent = "Mark as read";
    span.textContent = "not read";
    span.classList.remove("statusRead");
    span.classList.add("statusNot");
    const storageStatus = "status" + index;
    localStorage.setItem("status" + index, "not read");
  }
}

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
    for (i = initalBookCollection; i < completeCollection; i++) {
      let bookTitle = localStorage.getItem("title" + i);
      let bookAuthor = localStorage.getItem("author" + i).slice(8);
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

function hideLi(titleLi) {
  titleLi.forEach(function (title) {
    title.addEventListener("click", function (event) {
      const bookIndex = event.target.getAttribute("data-booktitle").slice(9);
      const bookId = "book" + bookIndex;
      const listUl = document.getElementById(bookId);
      let li = listUl.childNodes;
      li.forEach(function (element) {
        let classes = element.classList;
        classes.toggle("visibleClass");
      });
    });
    const span = document.createElement("span");
    const bookIndex = title.getAttribute("data-booktitle").slice(9);
    const bookStatus = bookCollection[bookIndex].status.slice(8);
    if (bookStatus === "read") {
      span.classList.add("statusRead");
    } else {
      span.classList.add("statusNot");
    }
    span.textContent = bookStatus;
    title.appendChild(span);
  });
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
  const titleLi = document.querySelectorAll("[data-booktitle]");
  hideLi(titleLi);
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

displayCollection(bookCollection);
localStorageCheck();
