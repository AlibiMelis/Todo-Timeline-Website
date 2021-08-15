const emailLbl = document.getElementById('email');
const passwordLbl = document.getElementById('password');
const signInBtn = document.getElementById('signIn');
// const signUpBtn = document.getElementById('signUp');
// const logOutBtn = document.getElementById('logOut');

var flag = false;

signInBtn.addEventListener('click', e => {
    const email = emailLbl.value;
    const password = passwordLbl.value;

    if (email == '' || password == '') {
        alert('Email and Password fields must not be empty');
    } else {
        flag = true;
        startLoadingAnim();
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
        console.log(promise);
    }
});

function startLoadingAnim() {
    const login = document.getElementById('login');
    const loading = document.getElementById('load');

    login.classList.add('hidden');
    loading.classList.remove('hidden');
}

// signUpBtn.addEventListener('click', e => {
// 	const email = emailLbl.value;
// 	const password = passwordLbl.value;

// 	if (email == '' || password == '') {
// 		alert('Email and Password fields must not be empty');
// 	} else {
// 		const auth = firebase.auth();
// 		const promise = auth.createUserWithEmailAndPassword(email, password);
// 		promise.catch(e => console.log(e.message));
// 	}
// });

// logOutBtn.addEventListener('click', e => {
// 	const auth = firebase.auth();
// 	auth.signOut();
// });

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        // logOutBtn.classList.remove('hide');
        if (!flag) {
            location.href = 'modules/home/home.html'
        } else {
            location.href = 'modules/welcome/welcome.html';
        }
    } else {
        console.log('not signed in');
        // logOutBtn.classList.add('hide');
    }
});