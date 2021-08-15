const auth = firebase.auth();
var signedIn = false;
const firebaseRef = firebase.database().ref('letters');

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
const form = document.getElementsByTagName('form')[0];
logout.addEventListener('click', function() {
    auth.signOut();
});

const sendLetterButton = document.getElementById('send-letter');

sendLetterButton.addEventListener('click', (e) => {
    const letter = document.getElementById('message-text');
    const receiver = document.getElementById('recipient-name');
    const key = firebaseRef.push().key;
    firebaseRef.child(key).set({
        receiver: receiver.value,
        content: letter.value,
        date: new Date(),
    });
    form.reset();
});