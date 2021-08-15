const auth = firebase.auth();
var signedIn = false;

auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        signedIn = true;
        console.log(firebaseUser);
    } else {
        if (!signedIn) {
            alert('Access Denied!');
        }
        console.log('not signed in');
        location.href = '/Website/index.html';
    }
})

const logout = document.getElementById('logout');
logout.addEventListener('click', function() {
    auth.signOut();
})