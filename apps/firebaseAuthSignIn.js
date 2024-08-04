  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
  import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  import firebaseConfig  from './confing.js';

  // Your web app's Firebase configuration
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const dataBase = getFirestore();

  //function show message after sign up

  // Function to show a message after sign-up
function showMessage(message, divId) {
    let messageSignin = document.getElementById(divId);
    messageSignin.style.display = "block";
    messageSignin.innerHTML = message;
    messageSignin.style.opacity = 1;
    setTimeout(() => {
        messageSignin.style.opacity = 0;
    }, 5000);
  }


  function rememberMe() {
    return document.getElementById('rememberMe').checked;
  }


//for sign in form 

const signIn = document.getElementById('btn-sign-in');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth = getAuth();

    if (rememberMe()) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    }else{
      localStorage.removeItem('email');
      localStorage.removeItem('password');

    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'home.html'
    })
    .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-credential' ){
            showMessage('Incorrect email or Password', 'signInMessageNoValidValues');
        }
        else{
            showMessage('Account does not exists', 'signInMessage' );

        }
    })
})



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