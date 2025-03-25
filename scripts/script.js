
// newSessionButton main.html
function displayLeaderboardTable() {
    console.log("Here is the leaderboard table, what's your rank"); // in future sprints, these will do something
}


const displayLeaderboard = document.getElementById('displayLeaderboard');
if (displayLeaderboard) { // check to see if button exists in that page
    displayLeaderboard.addEventListener('click', function () {
        displayLeaderboardTable()
    });
}

// newSessionButton main.html
function newSession() {
    console.log('Hello! A new session was made!'); // in future sprints, these will do something
}


const newSessionButton = document.getElementById('newSessionButton');
if (newSessionButton) { // check to see if button exists in that page
    newSessionButton.addEventListener('click', function () {
        newSession();
    });
}

// settingsButton profile.html and navbars
function goSettings() {
    console.log('You went to the settings!'); // in future sprints, these will do something
}

const settingsButton = document.getElementById('settingsButton');
if (settingsButton) {
    settingsButton.addEventListener('click', function () {
        goSettings();
    });
}


// logoutButton profile.html
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            firebase.auth().signOut().then(() => {
                console.log("User signed out.");
                window.location.href = "login.html"; // Redirect to login page
            }).catch((error) => {
                console.error("Error signing out:", error);
            });
        });
    }
});



// task in navbar
function showTaskList() {
    console.log('Here is your task list!'); // in future sprints, these will do something
}

const taskListNav = document.getElementById('taskListNav');
if (taskListNav) {
    taskListNav.addEventListener('click', function () {
        showTaskList();
    });
}


// timer in nav
function getTimer() {
    console.log('Here is a timer for your studies'); // in future sprints, these will do something
}

const timerNav = document.getElementById('timerNav');
if (timerNav) {
    timerNav.addEventListener('click', function () {
        getTimer();
    });
}



//  user stats nav
function showUserStats() {
    console.log('Here are your stats! Wow good job!'); // in future sprints, these will do something
}

const userStatsNav = document.getElementById('userStatsNav');
if (userStatsNav) {
    userStatsNav.addEventListener('click', function () {
        showUserStats();
    });
}


//  leaderboard
function showLeaderBoard() {
    console.log('Show leaderboard'); // in future sprints, these will do something
}

const leaderboardNav = document.getElementById('leaderboardNav');
if (leaderboardNav) {
    leaderboardNav.addEventListener('click', function () {
        showLeaderBoard();
    });
}

// opening task list 
function toggleTaskList() {
    var taskList = document.getElementById('taskList');
    taskList.classList.toggle('active');
}

// Star value checker
function getSelectedStarValue() {
    const selectedStar = document.querySelector('input[name="star"]:checked');
    if (selectedStar) {
        // Extract the star number from the ID (e.g., "star-3" -> 3)
        return parseInt(selectedStar.id.split('-')[1]);
    }
    return 1; 

}

// moving completed tasks to history
function removeTask(checkbox) {
    const taskItem = checkbox.parentElement;
    const taskName = taskItem.querySelector(".task-name"); // Select only the name
    const taskId = taskItem.getAttribute('data-task-id');
    const user = firebase.auth().currentUser;

    if (user && taskId) {
        if (checkbox.checked) {
            // ✅ MARK AS COMPLETE
            db.collection("users").doc(user.uid).collection("tasks").doc(taskId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const taskData = doc.data();

                        // Move task to history
                        const completedTask = {
                            ...taskData,
                            completedAt: firebase.firestore.FieldValue.serverTimestamp()
                        };

                        return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).set(completedTask);
                    }
                })
                .then(() => {
                    return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).delete();
                })
                .then(() => {
                    taskName.classList.add("completed-task"); // Apply strikethrough only to name
                })
                .catch((error) => {
                    console.error("Error moving task to history: ", error);
                });
        } else {
            // ✅ MOVE BACK TO ACTIVE TASKS
            db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const taskData = doc.data();

                        // Move task back to active
                        const activeTask = {
                            ...taskData,
                            completedAt: null // Reset completed timestamp
                        };

                        return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).set(activeTask);
                    }
                })
                .then(() => {
                    return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).delete();
                })
                .then(() => {
                    taskName.classList.remove("completed-task"); // Remove strikethrough from name
                })
                .catch((error) => {
                    console.error("Error moving task back to active: ", error);
                });
        }
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("exampleModal");
    const addTaskBtn = document.querySelector(".add-task-button button");
    const closeModal = document.querySelector(".close");

    if (addTaskBtn) { // Ensure the element exists before adding listener
        addTaskBtn.addEventListener("click", function () {
            modal.style.display = "block";
        });
    }

    if (closeModal) { // Ensure the element exists before adding listener
        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.getElementById('taskForm').reset();
        }
    });



// Initialize Flatpickr for date-only pickers
    const deadlinePicker = flatpickr("#taskDeadlineInput", {
        enableTime: false,
        dateFormat: "F j, Y",
        minDate: "today",
        defaultDate: null
    });

    const reminderPicker = flatpickr("#taskReminderInput", {
        enableTime: false,
        dateFormat: "F j, Y",
        minDate: "today",
        defaultDate: null
    });

    // Toggle visibility for deadline date and time inputs
    const taskDeadlineCheckbox = document.getElementById('taskDeadlineCheckbox');
    const taskDeadlineInput = document.getElementById('taskDeadlineInput');
    const taskDeadlineTimeInput = document.getElementById('taskDeadlineTimeInput');
    taskDeadlineCheckbox.addEventListener('change', function () {
        const displayStyle = this.checked ? 'block' : 'none';
        taskDeadlineInput.style.display = displayStyle;
        taskDeadlineTimeInput.style.display = displayStyle;
        if (!this.checked) {
            deadlinePicker.clear();
            taskDeadlineTimeInput.value = ''; // Clear time input
        }
    });

    // Toggle visibility for reminder date and time inputs
    const taskReminderCheckbox = document.getElementById('taskReminderCheckbox');
    const taskReminderInput = document.getElementById('taskReminderInput');
    const taskReminderTimeInput = document.getElementById('taskReminderTimeInput');
    taskReminderCheckbox.addEventListener('change', function () {
        const displayStyle = this.checked ? 'block' : 'none';
        taskReminderInput.style.display = displayStyle;
        taskReminderTimeInput.style.display = displayStyle;
        if (!this.checked) {
            reminderPicker.clear();
            taskReminderTimeInput.value = ''; // Clear time input
        }
    });
    // Add task to task list when "add task" button is clicked
    document.getElementById('addTaskButton').addEventListener('click', function () {
        const taskName = document.getElementById('recipient-name').value;
        const taskDescription = document.getElementById('message-text').value;
        const taskDeadline = document.getElementById('taskDeadlineInput').value;
        const taskReminder = document.getElementById('taskReminderInput').value;
        const taskDeadlineTime = document.getElementById('taskDeadlineTimeInput').value;
        const taskReminderTime = document.getElementById('taskReminderTimeInput').value;
        const taskValue = getSelectedStarValue();

        if (taskName) {
            // Create task object
            const task = {
                name: taskName,
                description: taskDescription,
                deadline: taskDeadline, 
                deadlineTime: taskDeadlineTime,
                reminder: taskReminder, 
                reminderTime: taskReminderTime,
                completed: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                value: taskValue
            };

            // Get current user
            const user = firebase.auth().currentUser;
            if (user) {
                // Add task to Firestore
                db.collection("users").doc(user.uid).collection("tasks").add(task)
                    .then((docRef) => {
                        console.log("Task added with ID: ", docRef.id);

                        // Create task HTML structure with the document ID as data attribute
                        let taskHTML = `
                  <div class="task-item" data-task-id="${docRef.id}">
                      <input type="checkbox" class="my-3" onclick="removeTask(this)">
                      <label>${taskName}</label>
              `;
                        taskHTML += `</div>`;

                        // Append the new task HTML to the task list
                        document.getElementById('tasks').insertAdjacentHTML('beforeend', taskHTML);
                        document.getElementById('taskForm').reset();
                        document.getElementById('taskDeadlineInput').value = ''; 
                        document.getElementById('taskDeadlineInput').style.display = 'none';
                        document.getElementById('taskReminderInput').value = '';
                        document.getElementById('taskReminderInput').style.display = 'none';
                        

                        // Close the modal
                        var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
                        modal.hide();
                    })
                    .catch((error) => {
                        console.error("Error adding task: ", error);
                    });
            } else {
                console.log("No user is signed in.");
                // In case the user isn't signed in
            }
        }
    });
    // Reset the add task form whenever it is cancelled
    var exampleModalEl = document.getElementById('exampleModal');
    exampleModalEl.addEventListener('hidden.bs.modal', function () {
        document.getElementById('taskForm').reset();
        document.getElementById('taskDeadlineInput').value = ''; 
        document.getElementById('taskDeadlineInput').style.display = 'none';
        document.getElementById('taskDeadlineTimeInput').value = '';
        document.getElementById('taskReminderTimeInput').value = '';
        document.getElementById('taskDeadlineTimeInput').style.display = 'none';
        document.getElementById('taskReminderTimeInput').style.display = 'none';
        document.getElementById('taskReminderInput').value = '';
        document.getElementById('taskReminderInput').style.display = 'none';
        document.getElementById('taskDeadlineCheckbox').checked = false;
        document.getElementById('taskReminderCheckbox').checked = false;
    });
});

// Firebase auth state listener
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in, load their tasks
        loadTasks();
    } else {
        // No user is signed in, clear tasks
        document.getElementById('tasks').innerHTML = '';
    }
});

// Load account-specific tasks from Firestore when you log in
function loadTasks() {
    const user = firebase.auth().currentUser;
    if (user) {
        const tasksContainer = document.getElementById('tasks');
        tasksContainer.innerHTML = ''; // Clear task list

        // Fetch active tasks
        db.collection("users").doc(user.uid).collection("tasks")
            .orderBy("createdAt", "desc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const taskData = doc.data();
                    addTaskToUI(doc.id, taskData, false); // false = not completed
                });
            })
            .catch((error) => {
                console.log("Error getting active tasks: ", error);
            });

        // Fetch completed tasks from history
        db.collection("users").doc(user.uid).collection("taskHistory")
            .orderBy("completedAt", "desc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const taskData = doc.data();
                    addTaskToUI(doc.id, taskData, true); // true = completed
                });
            })
            .catch((error) => {
                console.log("Error getting completed tasks: ", error);
            });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("tasks").addEventListener("click", function (event) {
        if (event.target.classList.contains("toggle-details")) {
            let details = event.target.nextElementSibling;
            if (details.style.display === "none") {
                details.style.display = "block";
                event.target.textContent = "Hide Details";
            } else {
                details.style.display = "none";
                event.target.textContent = "Show Details";
            }
        }
    });
});


function addTaskToUI(taskId, taskData, isCompleted) {
    let taskHTML = `
        <div class="task-item" data-task-id="${taskId}" 
             style="border-bottom: 1px solid #ccc; padding: 8px;">
            
            <input type="checkbox" class="my-3" onclick="removeTask(this)" ${isCompleted ? 'checked' : ''}>
            <label class="fw-bold task-name ${isCompleted ? 'completed-task' : ''}">${taskData.name}</label>
            
            <p class="text-muted mb-1"><strong>Deadline:</strong> ${taskData.deadline || "None"}</p>
            <p class="text-muted mb-0"><strong>Difficulty:</strong> ${"⭐".repeat(taskData.value || 1)}</p>
        </div>
    `;

    document.getElementById('tasks').insertAdjacentHTML('beforeend', taskHTML);
}




document.addEventListener("DOMContentLoaded", function () {
    // Toggle task completion (strikethrough & gray-out)
    document.getElementById("tasks").addEventListener("change", function (event) {
        if (event.target.type === "checkbox") {
            let taskLabel = event.target.nextElementSibling;
            if (event.target.checked) {
                taskLabel.classList.add("completed-task");
            } else {
                taskLabel.classList.remove("completed-task");
            }
        }
    });
});

//************************************************************************************************ */
//AI Assisted - Chat box functionality .

// Chat system implementation for CheckMate
// In newSession.html or wherever you create a new session
function createStudySession() {
    const user = firebase.auth().currentUser;
    
    // Create a new session document
    const newSessionRef = db.collection("studySessions").doc();
    
    const sessionData = {
        host: user.uid,
        hostName: user.displayName || 'Anonymous',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'active',
        participants: [user.uid]
    };

    newSessionRef.set(sessionData)
        .then(() => {
            // Store the session ID for current user
            localStorage.setItem('currentSessionId', newSessionRef.id);
            // Update UI to show session started
            document.getElementById('session').innerText = 'Active';
            
            // Start listening to session changes
            listenToSessionChanges(newSessionRef.id);
        });
}

function joinStudySession(sessionId) {
    const user = firebase.auth().currentUser;
    
    db.collection("studySessions").doc(sessionId).update({
        participants: firebase.firestore.FieldValue.arrayUnion(user.uid),
        status: 'active'
    }).then(() => {
        localStorage.setItem('currentSessionId', sessionId);
        // Redirect or update UI
    });
}
function listenToSessionChanges(sessionId) {
    db.collection("studySessions").doc(sessionId)
        .onSnapshot((doc) => {
            const sessionData = doc.data();
            if (sessionData.status === 'active') {
                // Start chat, timer, etc.
                loadChatMessages(sessionId);
            }
        });
}

// Function to toggle chat list (similar to task list toggle)
function toggleChatList() {
    var chatList = document.getElementById('chatList');
    chatList.classList.toggle('active');
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('chatMessageInput');
    const message = messageInput.value.trim();

    if (message) {
        const user = firebase.auth().currentUser;
        const currentSessionId = getCurrentSessionId();

        if (user && currentSessionId) {
            const chatMessage = {
                text: message,
                sender: user.uid,
                senderName: user.displayName || 'Anonymous',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sessionId: currentSessionId
            };

            db.collection("chatMessages").add(chatMessage)
                .then(() => {
                    messageInput.value = ''; // Clear input after sending
                    // Optional: scroll to bottom of chat
                    const messagesContainer = document.getElementById('chatMessages');
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                })
                .catch((error) => {
                    console.error("Error sending message: ", error);
                    // Optional: show error to user
                });
        } else {
            // Prompt user to start/join a session
            alert('Please start or join a study session first.');
        }
    }
}

// Function to load chat messages for a specific session
function loadChatMessages(sessionId) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Clear existing messages
    messagesContainer.innerHTML = ''; 

    // Ensure we have a valid session ID
    if (!sessionId) {
        console.warn('No session ID provided');
        return;
    }

    // Real-time listener for chat messages
    db.collection("chatMessages")
        .where("sessionId", "==", sessionId)
        .get()  // Use .get() instead of .onSnapshot() if index creation is problematic
        .then((querySnapshot) => {
            // Sort messages client-side
            const messages = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => 
                    (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)
                );

            messages.forEach(messageData => {
                addMessageToUI(messageData);
            });

            // Scroll to bottom of messages
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch((error) => {
            console.error("Error loading chat messages: ", error);
        });

    // Optional: Set up a real-time listener after initial load
    db.collection("chatMessages")
        .where("sessionId", "==", sessionId)
        .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const messageData = change.doc.data();
                    addMessageToUI(messageData);
                }
            });

            // Scroll to bottom of messages
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, (error) => {
            console.error("Error in chat messages snapshot: ", error);
        });
}

// Function to add a message to the UI
function addMessageToUI(messageData) {
    const messagesContainer = document.getElementById('chatMessages');
    const currentUser = firebase.auth().currentUser;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    
    // Differentiate between sent and received messages
    if (messageData.sender === currentUser.uid) {
        messageDiv.classList.add('sent-message');
    } else {
        messageDiv.classList.add('received-message');
    }

    messageDiv.innerHTML = `
        <strong>${messageData.senderName}</strong>
        <p>${messageData.text}</p>
        <small>${formatTimestamp(messageData.timestamp)}</small>
    `;

    messagesContainer.appendChild(messageDiv);
    
    // Auto-scroll to bottom of messages
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Utility function to format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString();
}

// Placeholder for getting current session ID
function getCurrentSessionId() {
    const sessionId = localStorage.getItem('currentSessionId');
    if (!sessionId) {
        console.warn('No active session found. Creating a new session...');
        createStudySession(); // Attempt to create a session if not exists
        return null;
    }
    return sessionId;
}

document.addEventListener("DOMContentLoaded", function() {
    const sendChatButton = document.getElementById('sendChatButton');
    const chatMessageInput = document.getElementById('chatMessageInput');
    const chatListToggle = document.getElementById('chatListNav'); // Assuming you have a nav item to toggle chat

    if (sendChatButton) {
        sendChatButton.addEventListener('click', sendMessage);
    }

    // Allow sending message by pressing Enter
    if (chatMessageInput) {
        chatMessageInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Optional: Toggle chat list
    if (chatListToggle) {
        chatListToggle.addEventListener('click', toggleChatList);
    }
});