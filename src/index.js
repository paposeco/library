import "./styles/stylesheet.css";
import {
  addBookToCollection,
  removeItemLocalStorage,
  displayCollection,
} from "./bookconstructor.js";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  where,
} from "firebase/firestore";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from 'firebase/storage';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: "AIzaSyAWgyV7syIIbKPZIMoHIU1M91jJ4ukwBUA",
  authDomain: "library-2ac65.firebaseapp.com",
  projectId: "library-2ac65",
  storageBucket: "library-2ac65.appspot.com",
  messagingSenderId: "1009268868829",
  appId: "1:1009268868829:web:3a2eb5ea4df6764ad27d34",
};

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
  if (inputTitle.value === "") {
    return;
  }
  event.preventDefault();
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
});

closeForm.addEventListener("click", function (event) {
  form.reset();
  formDiv.style.visibility = "hidden";
  showFormDiv.style.visibility = "visible";
});

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

const app = initializeApp(firebaseConfig);
const bookDatabase = getFirestore();

const auth = getAuth();
const signIn = async function () {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

const signOutUser = function () {
  signOut(auth);
};

//tracks login in changes
function initFirebaseAuth() {
  onAuthStateChanged(auth, authStateObserver);
}

const signinbutton = document.getElementById("authentication");
signinbutton.addEventListener("click", function () {
  if (auth.currentUser === null) {
    signIn();
  } else {
    signOutUser();
  }
});

const authStateObserver = function (user) {
  //signed in
  const profileDiv = document.getElementById("profile");
  const signinsuggestion = document.getElementById("signinsuggestion");
  if (user) {
    profileDiv.removeAttribute("hidden");
    signinbutton.textContent = "Sign Out";
    const namediv = document.createElement("p");
    namediv.textContent = getUserName();
    const profilephoto = document.createElement("img");
    profilephoto.src = getProfilePicUrl();
    profilephoto.alt = "profile pic";
    profileDiv.appendChild(profilephoto);
    profileDiv.appendChild(namediv);
    signinsuggestion.setAttribute("hidden", "true");
    moveBooksFromStorageToDB();
    retrieveBooksFromDB();
  } else {
    signinbutton.textContent = "Sign In";
    profileDiv.setAttribute("hidden", "true");
    signinsuggestion.removeAttribute("hidden");
  }
};

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

// Returns true if a user is signed-in.
// not used yet
function isUserSignedIn() {
  return !!getAuth().currentUser;
}

// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

//if logged in saves to cloud, else saves to local storage

// fazer um signout. o texto do botao tem de mudar quando o user esta loggedin

//save book to cloud
async function saveBook(bookinfo) {
  try {
    await addDoc(collection(bookDatabase, "books"), {
      title: bookinfo.title,
      author: bookinfo.author,
      pages: bookinfo.pages,
      status: bookinfo.status,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

const lookForTitleInObjectsArray = function (obj, title) {
  if (obj.title === title) {
    return true;
  } else {
    return false;
  }
};

const retrieveBooksFromDB = async function () {
  const getAllObjectsInDb = await getDocs(collection(bookDatabase, "books"));
  let arrayOfBooksInStorage = [];
  getAllObjectsInDb.forEach((doc) => {
    arrayOfBooksInStorage.push(doc.data());
  });
  displayCollection(arrayOfBooksInStorage);
};

const removeBookFromDB = async function (book) {
  const booksInStorage = collection(bookDatabase, "books");
  const booktodelete = query(booksInStorage, where("title", "==", book.title));
  const querySnapshot = await getDocs(booktodelete);
  querySnapshot.forEach((book) => {
    deleteDoc(doc(bookDatabase, "books", book.id));
  });
};

const changeBookStatusDB = async function (book) {
  const currentBookStatus = books.status;
  let newStatus = "";
  if (currentBookStatus === "Status: not read") {
    newStatus = "Status: read";
  } else {
    newStatus = "Status: not read";
  }
  const booksInStorage = collection(bookDatabase, "books");
  const booktochange = query(booksInStorage, where("title", "==", book.title));
  const querySnapshot = await getDocs(booktochange);
  querySnapshot.forEach((book) => {
    setDoc(doc(bookDatabase, "books", book.id), {
      title: book.title,
      author: book.author,
      pages: book.pages,
      status: newstatus,
    });
  });
};

const moveBooksFromStorageToDB = async function () {
  const booksInLocalStorage = localStorage;
  if (localStorage.length === 0) {
    return;
  }
  const getAllObjectsInDb = await getDocs(collection(bookDatabase, "books"));
  let arrayOfBooksInStorage = [];
  getAllObjectsInDb.forEach((doc) => {
    arrayOfBooksInStorage.push(doc.data());
  });

  const numberBooksToAdd = Number(localStorage.length / 4);
  for (let i = 0; i < numberBooksToAdd; i++) {
    const bookTitle = localStorage.getItem("title" + i);
    let bookfoundInDB = false;
    for (let j = 0; j < arrayOfBooksInStorage.length; j++) {
      const currentbook = arrayOfBooksInStorage[j];
      const bookAlreadyInDB = lookForTitleInObjectsArray(
        currentbook,
        bookTitle
      );
      if (bookAlreadyInDB) {
        bookfoundInDB = true;
        break;
      }
    }
    if (bookfoundInDB) {
      removeItemLocalStorage(i);
      continue;
    }
    const bookAuthor = localStorage.getItem("author" + i).slice(8);
    const bookPages = localStorage.getItem("pages" + i).slice(7);
    const bookStatus = localStorage.getItem("status" + i).slice(8);
    addBookToCollection(
      bookTitle,
      bookAuthor,
      bookPages,
      bookStatus,
      "newbook"
    );
    removeItemLocalStorage(i);
  }
};

initFirebaseAuth();

export { isUserSignedIn, saveBook, removeBookFromDB };

//on signin should add books to database maybe
// display collection on change in db
