const auth = firebase.auth();
checkIfSignedIn(auth);

const today = get_today_string();
const todoRef = firebase.database().ref('todo/' + today);

const todo_form = document.getElementById('form-input-todo-item');
const todo_input = document.getElementById('todo-input');
const tasks_container = document.getElementById('tasks-container');
const task_template = document.getElementById('task-template')

const toast_container = document.getElementById('live-toast');
const toast_message = document.getElementById('message');

add_logout_listener();
add_todo_input_enter_listener();
add_database_listener(); // RETHINK: DON'T WANT TO CHANGE CONSTANTLY
add_task_done_listener();

// FUNCTIONS

function add_todo_item(todo_item) {
    const key = todoRef.push().key;
    todoRef.child(key).set({
        task: todo_item,
        done: false,
        confirmed: true,
    });
};

function add_database_listener() {
    todoRef.on('value', (snapshot) => {
        tasks_container.innerHTML = "";
        snapshot.forEach((item) => {
            const task = item.val();
            const id = item.key;
            const task_element = document.importNode(task_template.content, true);
            const checkbox = task_element.querySelector('input');
            checkbox.id = id;
            checkbox.checked = task.done;

            const label = task_element.querySelector('label');
            label.htmlFor = id;
            label.append(task.task);
            tasks_container.appendChild(task_element);
            if (task.done && !task.confirmed) {
                checkbox.checked = false;
                todoRef.child(id).child('done').set(false);
                triggerToastMessage(" You didn't " + task.task);
            }
        });
    });
}

function add_task_done_listener() {
    tasks_container.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'input') {
            const key = e.target.id;
            todoRef.child(key).child('done').set(e.target.checked);
        }
    })
}

function triggerToastMessage(message) {
    var toast = new bootstrap.Toast(toast_container);
    toast_message.innerText = message;
    toast.show();
}

// button events
function add_logout_listener() {
    const logout = document.getElementById('logout');
    logout.addEventListener('click', function() {
        auth.signOut();
    });
};

function add_todo_input_enter_listener() {
    todo_form.addEventListener('submit', e => {
        e.preventDefault();
        var input = todo_input.value;
        if (input == null || input.lenght == '') return
        add_todo_item(input);
        todo_input.value = "";
    });

    // todo_input.addEventListener('keypress', function(e) {
    //     if (e.key === 'Enter') {
    //         if (todo_input.value.length > 0) {
    //             add_todo_item(todo_input.value);
    //             todo_input.value = '';
    //         }
    //     }
    // });
};

// if unauthorised access redirect to login
function checkIfSignedIn(auth) {
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
            location.href = '../../index.html';
        }
    });
};

function get_today_string() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
}