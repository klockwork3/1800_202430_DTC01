let sessionListenerUnsubscribe = null;
let chatListenerUnsubscribe = null;
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

     // Close the offcanvas menu if open
  const offcanvas = document.querySelector('.offcanvas.show');
  if (offcanvas) {
    const instance = bootstrap.Offcanvas.getInstance(offcanvas);
    if (instance) {
      instance.hide();
    }
  }
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
    const taskInput = taskItem.querySelector(".task-name-input");
    const taskId = taskItem.getAttribute('data-task-id');
    const user = firebase.auth().currentUser;

    if (user && taskId) {
        if (checkbox.checked) {
            // ✅ MARK AS COMPLETE
    db.collection("users").doc(user.uid).collection("tasks").doc(taskId).get()
    .then((doc) => {
        if (doc.exists) {
            const taskData = doc.data();

            const completedTask = {
                ...taskData,
                completed: true,
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).set(completedTask)
                .then(() => {
                    return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).delete();
                })
                .then(() => {
                    taskItem.remove();
                    // 🔁 Re-fetch the stored version (with populated timestamp)
                    return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).get();
                })
                .then((doc) => {
                    if (doc.exists) {
                        addTaskToUI(taskId, doc.data(), true);
                    }
                });
            
        }
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
                            completed: false,
                            completedAt: null
                        };
                        

                        return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).set(activeTask);
                    }
                })
                .then(() => {
                    return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).get();
                })
                .then((doc) => {
                    if (doc.exists) {
                        const tasksContainer = document.getElementById('tasks');
                        const existingTask = tasksContainer.querySelector(`[data-task-id="${taskId}"]`);
                        if (existingTask) {
                            existingTask.remove();
                        }
                        addTaskToUI(taskId, doc.data(), false);
                    }
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
                    return docRef.get().then(doc => {
                      // If createdAt hasn't populated yet, wait and retry once
                      if (!doc.exists || !doc.data().createdAt) {
                        return new Promise(resolve => setTimeout(resolve, 500)).then(() => docRef.get());
                      }
                      return doc;
                    });
                  })
                  .then((doc) => {
                    if (doc.exists) {
                      const savedTask = doc.data();
                      addTaskToUI(doc.id, savedTask, false);
                    }

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
        <div class="task-item" data-task-id="${taskId}" style="border-bottom: 1px solid #ccc; padding: 8px;">
            <div class="d-flex align-items-center gap-2 mb-1">
                <input type="checkbox" class="form-check-input" onclick="removeTask(this)" ${isCompleted ? 'checked' : ''}>
                <input 
                    type="text" 
                    class="form-control form-control-sm task-name-input ${isCompleted ? 'completed-task' : ''}" 
                    value="${taskData.name}" 
                    data-task-id="${taskId}"
                    style="flex: 1;" 
                    ${isCompleted ? "readonly" : ""}
                />
            </div>
            <div class="task-details" style="display: none;">
                <p class="text-muted mb-1"><strong>Deadline:</strong> ${taskData.deadline || "None"}</p>
                <p class="text-muted mb-0"><strong>Difficulty:</strong> ${"⭐".repeat(taskData.value || 1)}</p>
            </div>
        </div>
    `;
    document.getElementById('tasks').insertAdjacentHTML('afterbegin', taskHTML);
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
function createStudySession() {
    const user = firebase.auth().currentUser;

// Check if user already has an active session
db.collection("users").doc(user.uid).get()
    .then((doc) => {
        if (doc.exists && doc.data().activeSessionId) {
            // User already has an active session, join that session
            const existingSessionId = doc.data().activeSessionId;
            joinStudySession(existingSessionId);
        } else {
            // Create a new session
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
                    // Store the session ID for current user in both localStorage and Firestore
                    localStorage.setItem('currentSessionId', newSessionRef.id);
                    
                    // Update user document with active session
                    return db.collection("users").doc(user.uid).set({
                        activeSessionId: newSessionRef.id
                    }, { merge: true });
                })
                .then(() => {
                    // Start listening to session changes
                    listenToSessionChanges(newSessionRef.id);
                    
                    console.log('Study session created with ID: ', newSessionRef.id);
                })
                .catch((error) => {
                    console.error("Error creating study session: ", error);
                });
        }
    })
    .catch((error) => {
        console.error("Error checking existing session: ", error);
    });

}function joinStudySession(sessionId) {
    const user = firebase.auth().currentUser;

// Use a transaction to ensure atomic updates
return db.runTransaction((transaction) => {
    const sessionRef = db.collection("studySessions").doc(sessionId);
    const userRef = db.collection("users").doc(user.uid);

    return transaction.get(sessionRef).then((sessionDoc) => {
        if (!sessionDoc.exists) {
            throw new Error('Session does not exist');
        }

        const sessionData = sessionDoc.data();
        const participants = sessionData.participants || [];
        
        // Ensure user is in the participants list
        if (!participants.includes(user.uid)) {
            transaction.update(sessionRef, {
                participants: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
        }

        // Remove any existing active session
        transaction.update(userRef, {
            activeSessionId: firebase.firestore.FieldValue.delete()
        });

        // Set the new session as active
        transaction.update(userRef, {
            activeSessionId: sessionId
        });

        return sessionId;
    });
})
.then((sessionId) => {
    // Store in localStorage
    localStorage.setItem('currentSessionId', sessionId);
    
    // Start listeners
    listenToSessionChanges(sessionId);
    loadChatMessages(sessionId);
    
    console.log('Joined/Rejoined study session:', sessionId);
    
    return sessionId;
})
.catch((error) => {
    console.error("Error joining study session:", error);
    throw error;
});

}
function endStudySession() {
    const user = firebase.auth().currentUser;
    const currentSessionId = localStorage.getItem('currentSessionId');

if (!user || !currentSessionId) {
    console.error("No user or session ID found");
    return;
}

if (justJoined) {
    console.log(`User ${user.uid} just joined, skipping endStudySession`);
    return;
}

db.collection("studySessions").doc(currentSessionId).get()
    .then((doc) => {
        if (doc.exists) {
            const sessionData = doc.data();
            const participants = sessionData.participants || [];
            const updatedParticipants = participants.filter(uid => uid !== user.uid);

            const notification = {
                type: 'user_left',
                message: `${user.displayName || 'Anonymous'} has left the session`,
                sessionId: currentSessionId,
                timestamp: new Date().toISOString(),
                except: user.uid
            };
            
            return db.collection("studySessions").doc(currentSessionId).update({
                participants: updatedParticipants,
                leftUsers: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(() => {
                notifyParticipants(currentSessionId, notification);
                return currentSessionId;
            });
        }
        throw new Error("Session does not exist");
    })
    .then((sessionId) => {
        return db.collection("users").doc(user.uid).update({
            activeSessionId: firebase.firestore.FieldValue.delete()
        }).then(() => sessionId);
    })
    .then((sessionId) => {
        localStorage.removeItem('currentSessionId');
        console.log('User left the study session');

        // Stop all listeners
        if (sessionListenerUnsubscribe) {
            sessionListenerUnsubscribe();
            sessionListenerUnsubscribe = null;
        }
        if (chatListenerUnsubscribe) {
            chatListenerUnsubscribe();
            chatListenerUnsubscribe = null;
        }

        document.getElementById("session").innerText = "Not started";
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        const chatInput = document.getElementById('chatMessageInput');
        const sendButton = document.getElementById('sendChatButton');
        if (chatInput) chatInput.disabled = true;
        if (sendButton) sendButton.disabled = true;
    })
    .catch((error) => {
        console.error("Error ending study session:", error);
    });

}function listenToSessionChanges(sessionId) {
    const user = firebase.auth().currentUser;
    if (!user) return;

// Stop any existing listener
if (sessionListenerUnsubscribe) {
    sessionListenerUnsubscribe();
    sessionListenerUnsubscribe = null;
}

sessionListenerUnsubscribe = db.collection("studySessions").doc(sessionId)
    .onSnapshot((doc) => {
        if (doc.exists) {
            const sessionData = doc.data();
            const participants = sessionData.participants || [];
            if (participants.includes(user.uid)) {
                console.log('Current session participants:', participants);
                loadChatMessages(sessionId);
            } else {
                // User is no longer a participant, stop listeners and clear UI
                if (sessionListenerUnsubscribe) {
                    sessionListenerUnsubscribe();
                    sessionListenerUnsubscribe = null;
                }
                if (chatListenerUnsubscribe) {
                    chatListenerUnsubscribe();
                    chatListenerUnsubscribe = null;
                }
                const messagesContainer = document.getElementById('chatMessages');
                if (messagesContainer) {
                    messagesContainer.innerHTML = '<p>You are no longer in this session.</p>';
                }
                localStorage.removeItem('currentSessionId');
                console.log(`User ${user.uid} no longer in session ${sessionId}`);
            }
        } else {
            // Session deleted, clean up
            if (sessionListenerUnsubscribe) {
                sessionListenerUnsubscribe();
                sessionListenerUnsubscribe = null;
            }
            if (chatListenerUnsubscribe) {
                chatListenerUnsubscribe();
                chatListenerUnsubscribe = null;
            }
            localStorage.removeItem('currentSessionId');
            console.log(`Session ${sessionId} does not exist`);
        }
    }, (error) => {
        console.error("Error in session listener:", error);
    });

}function sendMessage() {
    const messageInput = document.getElementById('chatMessageInput');
    const message = messageInput.value.trim();

if (message) {
    const user = firebase.auth().currentUser;
    const currentSessionId = localStorage.getItem('currentSessionId');

    // Check if user is still in the session
    db.collection("studySessions").doc(currentSessionId).get()
        .then((doc) => {
            if (doc.exists) {
                const sessionData = doc.data();
                const participants = sessionData.participants || [];
                
                if (participants.includes(user.uid)) {
                    // User is still in the session, send message
                    const chatMessage = {
                        text: message,
                        sender: user.uid,
                        senderName: user.displayName || 'Anonymous',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        sessionId: currentSessionId
                    };

                    return db.collection("chatMessages").add(chatMessage);
                } else {
                    throw new Error("Not a participant of this session");
                }
            }
            throw new Error("Session does not exist");
        })
        .then(() => {
            messageInput.value = ''; // Clear input after sending
        })
        .catch((error) => {
            console.error("Error sending message: ", error);
            alert('Cannot send message. You may have left the session.');
            
            // Disable chat input
            messageInput.disabled = true;
            const sendButton = document.getElementById('sendChatButton');
            if (sendButton) sendButton.disabled = true;
        });
}

}function loadChatMessages(sessionId) {
    const user = firebase.auth().currentUser;
    const messagesContainer = document.getElementById('chatMessages');

if (!messagesContainer || !user) return;

// Clear existing messages
messagesContainer.innerHTML = ''; 

// Stop any existing chat listener
if (chatListenerUnsubscribe) {
    chatListenerUnsubscribe();
    chatListenerUnsubscribe = null;
}

// Check if user is still a participant
db.collection("studySessions").doc(sessionId).get()
    .then((doc) => {
        if (doc.exists) {
            const sessionData = doc.data();
            const participants = sessionData.participants || [];
            
            if (!participants.includes(user.uid)) {
                messagesContainer.innerHTML = '<p>You are no longer in this session.</p>';
                const chatInput = document.getElementById('chatMessageInput');
                const sendButton = document.getElementById('sendChatButton');
                if (chatInput) chatInput.disabled = true;
                if (sendButton) sendButton.disabled = true;
                console.log(`User ${user.uid} not a participant in session ${sessionId}`);
                return;
            }

            // Real-time listener for chat messages
            chatListenerUnsubscribe = db.collection("chatMessages")
                .where("sessionId", "==", sessionId)
                .onSnapshot((querySnapshot) => {
                    messagesContainer.innerHTML = '';
                    const sortedMessages = querySnapshot.docs
                        .map(doc => doc.data())
                        .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

                    sortedMessages.forEach((messageData) => {
                        addMessageToUI(messageData);
                    });
                    console.log(`Chat updated for session ${sessionId}`);
                }, (error) => {
                    console.error("Error in chat messages snapshot: ", error);
                });
        } else {
            console.log(`Session ${sessionId} does not exist`);
        }
    })
    .catch((error) => {
        console.error("Error checking session for chat: ", error);
    });

}function addMessageToUI(messageData) {
    const messagesContainer = document.getElementById('chatMessages');
    const currentUser = firebase.auth().currentUser;

if (!messagesContainer || !currentUser) return;

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

// Auto-scroll to bottom
messagesContainer.scrollTop = messagesContainer.scrollHeight;

}function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString();
}// Getting current session ID
function getCurrentSessionId() {
    const sessionId = localStorage.getItem('currentSessionId');
    if (!sessionId) {
        console.warn('No active session found. Creating a new session...');
        createStudySession(); // Attempt to create a session if not exists
        return null;
    }
    return sessionId;
}// Modify the existing DOMContentLoaded listener
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        updateUserStatus(true);

    // Remove any lingering session first
    db.collection("users").doc(user.uid).update({
        activeSessionId: firebase.firestore.FieldValue.delete()
    })
    .then(() => {
        const sessionId = localStorage.getItem('currentSessionId');
        
        if (sessionId) {
            // Try to join the existing session
            return db.collection("studySessions").doc(sessionId).get()
                .then((doc) => {
                    if (doc.exists && doc.data().participants.includes(user.uid)) {
                        return joinStudySession(sessionId);
                    } else {
                        // Invalid session, create a new one
                        localStorage.removeItem('currentSessionId');
                        return createStudySession();
                    }
                });
        } else {
            // No existing session, create a new one
            return createStudySession();
        }
    })
    .then(() => {
        // Always listen for notifications
        listenForNotifications();
    })
    .catch((error) => {
        console.error("Error during authentication state change:", error);
        createStudySession();
    });
} else {
    window.location.href = 'login.html';
}

});
// Function to toggle chat list (similar to task list toggle)
function toggleChatList() {
    var chatList = document.getElementById('chatList');
    chatList.classList.toggle('active');
}
justJoined = false
// Function to add users to the session
function inviteUserToSession(invitedUserId) {
    const currentSessionId = localStorage.getItem('currentSessionId');
    const currentUser = firebase.auth().currentUser;

if (!currentUser || !currentSessionId) {
    console.error("No active session or user not logged in");
    return;
}

// Transaction to ensure atomic updates and prevent race conditions
db.runTransaction((transaction) => {
    const currentSessionRef = db.collection("studySessions").doc(currentSessionId);
    const invitedUserRef = db.collection("users").doc(invitedUserId);

    return transaction.get(currentSessionRef).then((sessionDoc) => {
        if (!sessionDoc.exists) {
            throw new Error("Session does not exist");
        }

        const sessionData = sessionDoc.data();
        const participants = sessionData.participants || [];

        // If user is already in the session, no need to add again
        if (participants.includes(invitedUserId)) {
            return;
        }

        // First, remove user from any existing active session
        transaction.update(invitedUserRef, {
            activeSessionId: firebase.firestore.FieldValue.delete()
        });

        // Add user to the new session
        transaction.update(currentSessionRef, {
            participants: firebase.firestore.FieldValue.arrayUnion(invitedUserId)
        });

        // Set the new session as active for the invited user
        transaction.update(invitedUserRef, {
            activeSessionId: currentSessionId
        });

        return currentSessionId;
    });
})
.then((sessionId) => {
    if (sessionId) {
        // Prepare and send notifications
        return db.collection("users").doc(invitedUserId).get()
            .then((userDoc) => {
                const invitedUserName = userDoc.exists ? userDoc.data().displayName || 'Anonymous' : 'Anonymous';
                const timestamp = new Date().toISOString();

                // Notification for other participants
                const joinNotification = {
                    type: 'user_joined',
                    message: `${invitedUserName} has joined the session`,
                    sessionId: sessionId,
                    timestamp: timestamp,
                    except: invitedUserId
                };
                notifyParticipants(sessionId, joinNotification);

                // Notification for the invited user
                const inviteNotification = {
                    type: 'join_session',
                    message: `You have been invited to a study session!`,
                    sessionId: sessionId,
                    timestamp: timestamp,
                    except: currentUser.uid
                };

                return db.collection("users").doc(invitedUserId).update({
                    notifications: firebase.firestore.FieldValue.arrayUnion(inviteNotification)
                });
            });
    }
})
.then(() => {
    alert(`User invited successfully!`);
    toggleUserList();
})
.catch((error) => {
    console.error("Error inviting user:", error);
    alert("Failed to invite user. Please try again.");
});

}function toggleUserList() {
    const userList = document.getElementById('userList');
    userList.classList.toggle('active');
    if (userList.classList.contains('active')) {
        loadOnlineUsers(); // Load users when opening the modal
    }
}
// Fetch and display online users
function loadOnlineUsers() {
    const onlineUsersContainer = document.getElementById('onlineUsers');
    if (!onlineUsersContainer) return;

onlineUsersContainer.innerHTML = '<p>Loading users...</p>'; // Loading indicator

// Fetch all users and filter for online status
db.collection("users").where("isOnline", "==", true).get()
    .then((querySnapshot) => {
        onlineUsersContainer.innerHTML = ''; // Clear loading message
        if (querySnapshot.empty) {
            onlineUsersContainer.innerHTML = '<p>No users online</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userId = doc.id;
            const currentUser = firebase.auth().currentUser;

            // Don't show the current user in the list
            if (userId === currentUser.uid) return;

            const userHTML = `
                <div class="user-item d-flex justify-content-between align-items-center mb-2" data-user-id="${userId}">
                    <span>${userData.displayName || 'Anonymous'}</span>
                    <button class="btn btn-sm btn-success add-user-btn" onclick="inviteUserToSession('${userId}')">
                        Add to Session
                    </button>
                </div>
            `;
            onlineUsersContainer.insertAdjacentHTML('beforeend', userHTML);
        });
    })
    .catch((error) => {
        console.error("Error loading online users:", error);
        onlineUsersContainer.innerHTML = '<p>Error loading users</p>';
    });

}// Update user online status
function updateUserStatus(isOnline) {
    const user = firebase.auth().currentUser;
    if (!user) return;

db.collection("users").doc(user.uid).set({
    isOnline: isOnline,
    displayName: user.displayName || 'Anonymous', // Ensure displayName is stored
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
}, { merge: true })
.catch((error) => {
    console.error("Error updating user status:", error);
});

}firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        updateUserStatus(true);
        const sessionId = localStorage.getItem('currentSessionId');
        if (sessionId) {
            db.collection("studySessions").doc(sessionId).get()
                .then((doc) => {
                    if (doc.exists && doc.data().participants.includes(user.uid)) {
                        joinStudySession(sessionId);
                    } else {
                        createStudySession();
                    }
                })
                .catch((error) => {
                    console.error("Error checking session:", error);
                    createStudySession();
                });
        } else {
            createStudySession();
        }
    } else {
        window.location.href = 'login.html';
    }
});// Handle logout to set user offline
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const user = firebase.auth().currentUser;
            if (user) {
                updateUserStatus(false); // Set user offline before signing out
            }
            firebase.auth().signOut().then(() => {
                console.log("User signed out.");
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("Error signing out:", error);
            });
        });
    }
});function notifyParticipants(sessionId, notification) {
    db.collection("studySessions").doc(sessionId).get()
        .then((doc) => {
            if (doc.exists) {
                const sessionData = doc.data();
                const participants = sessionData.participants || [];

            // Send notification to all participants except the one specified in notification.except
            participants.forEach((participantId) => {
                if (participantId !== notification.except) {
                    db.collection("users").doc(participantId).update({
                        notifications: firebase.firestore.FieldValue.arrayUnion(notification)
                    })
                    .catch((error) => {
                        console.error("Error sending notification to user:", participantId, error);
                    });
                }
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching session for notification:", error);
    });

}
// Listen for notifications
function listenForNotifications() {
    const user = firebase.auth().currentUser;
    if (!user) return;

db.collection("users").doc(user.uid).onSnapshot((doc) => {
    if (doc.exists) {
        const userData = doc.data();
        const notifications = userData.notifications || [];

        notifications.forEach((notification) => {
            // Focus on join session notifications
            if (notification.type === 'join_session' && notification.sessionId) {
                // Remove any existing active session first
                db.collection("users").doc(user.uid).update({
                    activeSessionId: firebase.firestore.FieldValue.delete()
                })
                .then(() => {
                    // Join the new session
                    return joinStudySession(notification.sessionId);
                })
                .then(() => {
                    // Remove the notification after processing
                    return db.collection("users").doc(user.uid).update({
                        notifications: firebase.firestore.FieldValue.arrayRemove(notification)
                    });
                })
                .catch((error) => {
                    console.error("Error processing join session notification:", error);
                });
            }
        });
    }
}, (error) => {
    console.error("Error listening to notifications:", error);
});

}
// Function to display notifications
function showNotification(notification) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'notification alert alert-info position-fixed bottom-0 end-0 m-3';
    notificationDiv.style.zIndex = '1050';
    notificationDiv.setAttribute('data-timestamp', notification.timestamp || '');
    notificationDiv.innerHTML =        ` <p>${notification.message}</p>         <button class="btn btn-secondary btn-sm" onclick="dismissNotification(this, '${notification.timestamp}')">Dismiss</button> `   ;
    document.body.appendChild(notificationDiv);

// Auto-dismiss after 5 seconds
setTimeout(() => {
    if (notificationDiv.parentNode) {
        notificationDiv.parentNode.removeChild(notificationDiv);
    }
}, 5000);

}
// Function to dismiss notification and remove it from Firestore
function dismissNotification(button, timestamp) {
    const user = firebase.auth().currentUser;
    if (!user) return;

const notificationDiv = button.parentElement;
if (notificationDiv.parentNode) {
    notificationDiv.parentNode.removeChild(notificationDiv);
}

db.collection("users").doc(user.uid).update({
    notifications: firebase.firestore.FieldValue.arrayRemove(
        ...getNotification(user.uid, timestamp)
    )
})
.catch((error) => {
    console.error("Error removing notification:", error);
});

}// Helper function to get specific notification to remove
function getNotification(userId, timestamp) {
    return new Promise((resolve) => {
        db.collection("users").doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const notifications = doc.data().notifications || [];
                    const notificationToRemove = notifications.filter(
                        n => n.timestamp === timestamp
                    );
                    resolve(notificationToRemove);
                } else {
                    resolve([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
                resolve([]);
            });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById('sendChatButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Optionally, allow sending with the Enter key
    const chatInput = document.getElementById('chatMessageInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});