import "./styles/stylesheet.css";
import { addBookToCollection } from "./bookconstructor.js";
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
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
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

const signIn = async function () {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
};

const signOutUser = function () {
  signOut(getAuth());
};

//check if user is loggedin
function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), authStateObserver);
}

const signinbutton = document.getElementById("signin");
signinbutton.addEventListener("click", signIn);
//if logged in saves to cloud, else saves to local storage

const app = initializeApp(firebaseConfig);

// fazer um signout. o texto do botao tem de mudar quando o user esta loggedin
