import "./styles/stylesheet.css";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAWgyV7syIIbKPZIMoHIU1M91jJ4ukwBUA",
  authDomain: "library-2ac65.firebaseapp.com",
  projectId: "library-2ac65",
  storageBucket: "library-2ac65.appspot.com",
  messagingSenderId: "1009268868829",
  appId: "1:1009268868829:web:3a2eb5ea4df6764ad27d34",
};

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

const hobbit = new bookInfo("The Hobbit", "J.R.R. Tolkien", "295", "read");
const seveneves = new bookInfo("Seveneves", " Neal Stephenson", "880", "read");
const elantris = new bookInfo("Elantris", "Brandon Sanderson", "638", "read");
const hyperion = new bookInfo("Hyperion", "Dan Simmons", "482", "read");
const thehumancondition = new bookInfo(
  "The Human Condition",
  "Hannah Arendt",
  "349",
  "not read"
);
const thebelljar = new bookInfo(
  "The Bell Jar",
  "Sylvia Plath",
  "249",
  "not read"
);

let bookCollection = [
  hobbit,
  seveneves,
  thehumancondition,
  elantris,
  hyperion,
  thebelljar,
];
const collection = document.getElementById("collection");

function displayCollection(array) {
  for (let i = 0; i < array.length; i++) {
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
    newDiv.classList.add("bookButtons");
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
  newDiv.classList.add("bookButtons");
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
  numberofbooks(bookCollection.length);
}

function removeBookButton(index, newDiv) {
  const newButton = document.createElement("button");
  newButton.textContent = "×";
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
  localStorage.removeItem("title" + index);
  localStorage.removeItem("author" + index);
  localStorage.removeItem("pages" + index);
  localStorage.removeItem("status" + index);
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
    const currentBookListItemStatus =
      currentBookList.querySelector("[data-bookstatus]");
    const span = currentBookList.querySelector("span");
    currentBookListItemStatus.textContent = "Status: read";
    event.target.textContent = "Mark as not read";
    span.textContent = "read";
    span.classList.remove("statusNot");
    span.classList.add("statusRead");
    const storageStatusNot = "status" + index;
    localStorage.setItem(storageStatusNot, "Status: read");
  } else {
    bookCollection[index].status = "Status: not read";
    const currentBookList = document.getElementById("book" + index);
    const currentBookListItemStatus =
      currentBookList.querySelector("[data-bookstatus]");
    const span = currentBookList.querySelector("span");
    currentBookListItemStatus.textContent = "Status: not read";
    event.target.textContent = "Mark as read";
    span.textContent = "not read";
    span.classList.remove("statusRead");
    span.classList.add("statusNot");
    const storageStatus = "status" + index;
    localStorage.setItem(storageStatus, "Status: not read");
  }
}

function populateStorage(array, index) {
  localStorage.setItem("title" + index, array[index].title);
  localStorage.setItem("author" + index, array[index].author);
  localStorage.setItem("pages" + index, array[index].pages);
  localStorage.setItem("status" + index, array[index].status);
}

function localStorageCheck() {
  if (localStorage.length > 24) {
    // initial storage
    const initalBookCollection = bookCollection.length;
    const completeCollection = Number(localStorage.length / 4);
    for (let i = initalBookCollection; i < completeCollection; i++) {
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
    numberofbooks(completeCollection);
  } else {
    numberofbooks(bookCollection.length);
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
    span.addEventListener("click", function (event) {
      const bookId = "book" + bookIndex;
      const listUl = document.getElementById(bookId);
      let li = listUl.childNodes;
      li.forEach(function (element) {
        let classes = element.classList;
        classes.toggle("visibleClass");
      });
    });
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

const litotal = document.getElementById("totalnumberofbooks");
const liread = document.getElementById("numberreadbooks");
const liunread = document.getElementById("numberofunreadbooks");
const buttoni = document.getElementById("buttoni");
const paraProjectInfo = document.getElementById("projectinfo");
const paraProjectInfoClose = document.getElementById("closeinfo");

buttoni.addEventListener("click", function () {
  paraProjectInfo.style.visibility = "visible";
  paraProjectInfoClose.style.visibility = "visible";
  buttoni.style.visibility = "hidden";
});

paraProjectInfoClose.addEventListener("click", function () {
  paraProjectInfo.style.visibility = "hidden";
  paraProjectInfoClose.style.visibility = "hidden";
  buttoni.style.visibility = "visible";
});

function numberofbooks(arraylength) {
  let read = 0;
  let unread = 0;
  bookCollection.forEach(function (obj) {
    if (obj.status === "Status: read") {
      read += 1;
    } else {
      unread += 1;
    }
  });
  let numberofbooks = arraylength;
  litotal.textContent = "Number of books: " + numberofbooks;
  liread.textContent = "Books read: " + read;
  liunread.textContent = "Want to read: " + unread;
}
displayCollection(bookCollection);

window.onload = function () {
  const titleLi = document.querySelectorAll("[data-booktitle]");
  hideLi(titleLi);
  localStorageCheck();
};

export { addBookToCollection };
