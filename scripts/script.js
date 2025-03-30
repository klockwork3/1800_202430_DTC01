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
    console.log("removeTask triggered with checkbox:", checkbox);

    const taskItem = checkbox.parentElement.parentElement;
    console.log("taskItem:", taskItem);

    const taskId = taskItem.getAttribute('data-task-id');
    console.log("taskId:", taskId);

    const user = firebase.auth().currentUser;
    console.log("user:", user ? user.uid : "No user");

    if (!user || !taskId) {
        console.error("No user or task ID available - user:", user, "taskId:", taskId);
        return;
    }

    if (checkbox.checked) {
        // ✅ MARK AS COMPLETE
        console.log(`Attempting to complete task ${taskId} for user ${user.uid}`);
        
        db.collection("users").doc(user.uid).collection("tasks").doc(taskId).get()
            .then((doc) => {
                if (!doc.exists) {
                    console.error(`Task ${taskId} does not exist`);
                    return;
                }

                const taskData = doc.data();
                console.log("Task data:", taskData);

                const completedTask = {
                    ...taskData,
                    completed: true,
                    completedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).set(completedTask)
                    .then(() => {
                        console.log(`Task ${taskId} moved to history`);
                        return db.collection("users").doc(user.uid).update({
                            StatPoints: firebase.firestore.FieldValue.increment(taskData.value || 1)
                        });
                    })
                    .then(() => {
                        console.log(`StatPoints incremented by ${taskData.value || 1}`);
                        return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).delete();
                    })
                    .then(() => {
                        console.log(`Task ${taskId} deleted from active tasks`);
                        taskItem.remove();
                        return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).get();
                    })
                    .then((doc) => {
                        if (doc.exists) {
                            console.log("Re-fetched task from history:", doc.data());
                            addTaskToUI(taskId, doc.data(), true);
                        }
                    });
            })
            .catch((error) => {
                console.error("Error in task completion process:", error);
            });
    } else {
        // ✅ MOVE BACK TO ACTIVE TASKS
        console.log(`Attempting to un-complete task ${taskId}`);
        
        db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).get()
            .then((doc) => {
                if (!doc.exists) {
                    console.error(`Task ${taskId} not found in history`);
                    return;
                }

                const taskData = doc.data();
                const activeTask = {
                    ...taskData,
                    completed: false,
                    completedAt: null
                };

                return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).set(activeTask)
                    .then(() => {
                        console.log(`Task ${taskId} moved back to active tasks`);
                        // Decrement StatPoints by the same value
                        return db.collection("users").doc(user.uid).update({
                            StatPoints: firebase.firestore.FieldValue.increment(-(taskData.value || 1))
                        });
                    })
                    .then(() => {
                        console.log(`StatPoints decremented by ${taskData.value || 1}`);
                        return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).delete();
                    })
                    .then(() => {
                        console.log(`Task ${taskId} removed from history`);
                        const tasksContainer = document.getElementById('tasks');
                        const existingTask = tasksContainer.querySelector(`[data-task-id="${taskId}"]`);
                        if (existingTask) existingTask.remove();
                        addTaskToUI(taskId, activeTask, false);
                    });
            })
            .catch((error) => {
                console.error("Error moving task back to active:", error);
            });
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
        // Toggle all task details
        const toggleAllBtn = document.getElementById('toggleAllDetailsButton');
        let showingAll = false;
    
        if (toggleAllBtn) {
            toggleAllBtn.addEventListener('click', function () {
                const details = document.querySelectorAll('.task-details');
                showingAll = !showingAll;
                details.forEach(detail => {
                    detail.style.display = showingAll ? 'block' : 'none';
                });
                toggleAllBtn.textContent = showingAll ? 'Hide All Details' : 'Show All Details';
            });
        }
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
                return notifyParticipants(currentSessionId, notification);
            }).then(() => {
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
        window.location.href='main.html';
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
                
                // Update participants list in UI
                updateParticipantsUI(participants);

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
}
function updateParticipantsUI(participants) {
    const participantsContainer = document.getElementById('sessionParticipants');
    const participantsList = document.getElementById('participantsList');
    if (!participantsContainer || !participantsList) return;

    participantsContainer.innerHTML = '';

    // Show/hide based on participant count
    if (participants.length > 1) {
        participantsList.style.display = 'block'; 
    } else {
        participantsList.style.display = 'none';
        return; 
    }

    // Fetch and display participant names, level, and points
    participants.forEach((participantId) => {
        db.collection("users").doc(participantId).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const userLevel = userData.Level || 0;
                    const userStatPoints = userData.StatPoints || 0;
                    const displayName = userData.displayName || 'Anonymous';

                    const participantElement = document.createElement('div');
                    participantElement.classList.add('participant-item');

                    const content = document.createElement('div');
                    content.style.display = 'flex';
                    content.style.gap = '10px'; // Space between columns
                    // Name column
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = displayName;
                    nameSpan.style.minWidth = '100px';
                    nameSpan.style.textAlign = 'left';

                    // Level column
                    const levelSpan = document.createElement('span');
                    levelSpan.textContent = `Level: ${userLevel}`;
                    levelSpan.style.minWidth = '70px'; // Fixed width for level column

                    // Points column
                    const pointsSpan = document.createElement('span');
                    pointsSpan.textContent = `Points: ${userStatPoints}`;
                    pointsSpan.style.minWidth = '100px'; // Fixed width for points column

                    // Append spans to content
                    content.appendChild(nameSpan);
                    content.appendChild(levelSpan);
                    content.appendChild(pointsSpan);

                    // Append content to participant element
                    participantElement.appendChild(content);
                    participantsContainer.appendChild(participantElement);
                }
            })
            .catch((error) => {
                console.error("Error fetching participant details:", error);
            });
    });
}
function sendMessage() {
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

    if (!window.location.pathname.includes('newsession.html')) {
        return; // Exit if not on new session page
    }

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
    const currentUser = firebase.auth().currentUser;
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentUser || !currentSessionId) {
        console.error("No active session or user not logged in");
        return;
    }

    // Transaction to add user to session
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

            // Remove user from any existing active session
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
            // Create session invite notification
            return createSessionNotification(invitedUserId, 'session_invite');
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
}

function toggleUserList() {
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

}// Handle logout to set user offline
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
});
// Listen for notifications
function listenForNotifications() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    db.collection("users").doc(user.uid).onSnapshot((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            const notifications = userData.notifications || [];

            // Only show the most recent notification
            if (notifications.length > 0) {
                const mostRecentNotification = notifications[notifications.length - 1];
                
                // Only show notification if it's a recent event (within last 30 seconds)
                const notificationTime = new Date(mostRecentNotification.timestamp);
                const now = new Date();
                const timeDiff = (now - notificationTime) / 1000; // difference in seconds

                if (timeDiff < 30) {
                    showNotification(mostRecentNotification);

                    // Handle specific notification types
                    if (mostRecentNotification.type === 'session_invite' && mostRecentNotification.sessionId) {
                        handleSessionInvite(mostRecentNotification);
                    }
                }
            }
        }
    }, (error) => {
        console.error("Error listening to notifications:", error);
    });
}

// Function to display notifications
function showNotification(notification) {
    // Create a toast-style notification
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }

    const notificationElement = document.createElement('div');
    notificationElement.className = 'toast show';
    notificationElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">CheckMate Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${notification.message}
        </div>
    `;

    // Automatically remove after 5 seconds
    const toastContainer = document.getElementById('notificationContainer');
    toastContainer.appendChild(notificationElement);

    setTimeout(() => {
        notificationElement.remove();
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
//*********************************************************************************** */
//Notification system
function createSessionNotification(invitedUserId, notificationType) {
    const currentUser = firebase.auth().currentUser;
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentUser || !currentSessionId) {
        console.error("No active session or user not logged in");
        return Promise.reject("Invalid session");
    }

    // Prepare notification data
    const notification = {
        type: notificationType,
        sessionId: currentSessionId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        timestamp: new Date().toISOString()
    };

    // Customize message based on notification type
    switch(notificationType) {
        case 'session_invite':
            notification.message = `You've been summoned for Co-op by ${notification.senderName}!`;
            break;
        case 'user_joined':
            notification.message = `${notification.senderName} has joined the study session`;
            break;
        case 'user_left':
            notification.message = `${notification.senderName} has left the study session`;
            break;
        default:
            notification.message = 'New notification';
    }

    // Add notification to the invited user's profile
    return db.collection("users").doc(invitedUserId).update({
        notifications: firebase.firestore.FieldValue.arrayUnion(notification)
    });
}




function handleSessionInvite(notification) {
    // Optional: Add a confirmation dialog or automatic join
    joinStudySession(notification.sessionId)
        .then(() => {
            // Remove the notification after processing
            return db.collection("users").doc(firebase.auth().currentUser.uid).update({
                notifications: firebase.firestore.FieldValue.arrayRemove(notification)
            });
        })
        .catch((error) => {
            console.error("Error processing session invite:", error);
        });
}

function notifyParticipants(sessionId, notification) {
    return db.collection("studySessions").doc(sessionId).get()
        .then((doc) => {
            if (doc.exists) {
                const sessionData = doc.data();
                const participants = sessionData.participants || [];
                
                // Create an array of promises for all updates
                const updatePromises = participants
                    .filter(participantId => participantId !== notification.except)
                    .map(participantId => {
                        return db.collection("users").doc(participantId).update({
                            notifications: firebase.firestore.FieldValue.arrayUnion({
                                type: notification.type,
                                message: notification.message,
                                sessionId: sessionId,
                                timestamp: new Date().toISOString()
                            })
                        }).catch(err => {
                            console.error(`Failed to notify ${participantId}:`, err);
                        });
                    });

                // Wait for all updates to complete
                return Promise.all(updatePromises);
            }
        })
        .catch((error) => {
            console.error("Error notifying participants:", error);
        });
}

