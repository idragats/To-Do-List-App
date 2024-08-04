  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import {getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
  import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  import firebaseConfig  from './confing.js';

  // Your web app's Firebase configuration

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dataBase = getFirestore(app);

  //function show message after sign up

  // Function to show a message after sign-up
function showMessage(message, divId) {
    let messageSignup = document.getElementById(divId);
    messageSignup.style.display = "block";
    messageSignup.innerHTML = message;
    messageSignup.style.opacity = 1;
    setTimeout(() => {
        messageSignup.style.opacity = 0;
    }, 5000);
  }


  // Function to check if terms and conditions are accepted
function areTermsAccepted() {
    return document.getElementById('termsAndConditions').checked;
  }
  
  // Select the sign-up button
  const signUp = document.getElementById('btn-sign-up');
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
  
    // Get the variables email, password, and username
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmedPassword = document.getElementById('confirmedPassword').value;
  
    // Check if password matches confirmed password
    if (password !== confirmedPassword) {
      showMessage('Passwords do not match', 'unSuccessfulMessagePaswords');
      return;
    }


    if (!areTermsAccepted()) {
        showMessage('You must agree to the terms & conditions', 'unSuccessfulMessageTerms');
        return;
    }
  
  
    // Save user to dataBase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          username: username,
          email: email,
        };
  
        // Store user in database
        const docReference = doc(dataBase, "users", user.uid);
        setDoc(docReference, userData)
        .then(() => {
            window.location.href = 'successfullySignup.html';
        })
        .catch((error) => {
            console.error("error writing document", error);
        });

      })    
      .catch((error) =>{
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email address already exists', 'unSuccessfulMessageEmail');
        } else {
          showMessage('Unable to create user', 'unSuccessfulMessageUser');
        }
    })
        
});


//auth with google
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const googleBtn = document.getElementById('google-btn');
googleBtn.addEventListener('click', () =>{
  signInWithPopup(auth, provider)
  .then ((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = 'home.html'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  })
})