let sessionListenerUnsubscribe = null;
let chatListenerUnsubscribe = null;



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
    closeOtherModals('taskList'); // Close other modals
    var taskList = document.getElementById('taskList');
    taskList.classList.toggle('active');

    // Close the offcanvas menu if open (keeping your existing logic)
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

        // logoutButton profile.html
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
                value: taskValue,
                order: Date.now() // Use timestamp for initial ordering
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
            .orderBy("order", "asc")
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
            .orderBy("order", "asc")
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
            <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="d-flex align-items-center gap-2 flex-grow-1">
                <span class="drag-handle" style="cursor: grab;">≡</span>
                    <input type="checkbox" class="form-check-input" onclick="removeTask(this)" ${isCompleted ? 'checked' : ''}>
                    <textarea
                        class="form-control form-control-sm task-name-input ${isCompleted ? 'completed-task' : ''}" 
                        data-task-id="${taskId}"
                        style="flex: 1; resize: none; overflow: hidden; white-space: pre-wrap; border: none; background: transparent; padding: 0;"
                        rows="1"
                        ${isCompleted ? "readonly" : ""}
                    >${taskData.name}</textarea>
                </div>
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteTask('${taskId}', ${isCompleted})">✖️</button>
            </div>

            <div class="task-details" style="display: none;">
                <div class="editable-group text-muted mb-1">
                <strong>Deadline:</strong>
                <span class="editable-text deadline-text" data-task-id="${taskId}" data-value="${taskData.deadline || ''}" data-is-completed="${isCompleted}">
                    ${taskData.deadline || "None"}
                </span>
                </div>
                <div class="editable-group text-muted mb-0">
                <strong>Difficulty:</strong>
                <span class="editable-text difficulty-text" data-task-id="${taskId}" data-value="${taskData.value || 1}" data-is-completed="${isCompleted}">
                    ${"⭐".repeat(taskData.value || 1)}
                </span>
                </div>

            </div>
        </div>
    `;
    document.getElementById('tasks').insertAdjacentHTML('beforeend', taskHTML);


    const insertedTask = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
    const textarea = insertedTask?.querySelector("textarea");

    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';

        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }

}

// function removeTask(checkbox) {
//     const taskElement = checkbox.closest(".task-item");
//     const taskId = taskElement.getAttribute("data-task-id");
//     const user = firebase.auth().currentUser;
//     if (!user || !taskId) return;

//     const fromCollection = checkbox.checked ? "tasks" : "taskHistory";
//     const toCollection = checkbox.checked ? "taskHistory" : "tasks";

//     // Get the task data first
//     db.collection("users").doc(user.uid).collection(fromCollection).doc(taskId).get()
//         .then((doc) => {
//             if (!doc.exists) throw new Error("Task not found");
//             const taskData = doc.data();
//             taskData.completed = checkbox.checked;

//             if (checkbox.checked) {
//                 taskData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
//             } else {
//                 delete taskData.completedAt;
//             }

//             // Add to new collection
//             return db.collection("users").doc(user.uid).collection(toCollection).doc(taskId).set(taskData);
//         })
//         .then(() => {
//             // Delete from original collection
//             return db.collection("users").doc(user.uid).collection(fromCollection).doc(taskId).delete();
//         })
//         .then(() => {
//             // Reload the task list to reflect changes
//             loadTasks();
//         })
//         .catch((error) => {
//             console.error("Error toggling task completion:", error);
//         });
// }

function removeTask(checkbox) {
    const taskElement = checkbox.closest(".task-item");
    const taskId = taskElement.getAttribute("data-task-id");
    const user = firebase.auth().currentUser;
    if (!user || !taskId) return;

    const fromCollection = checkbox.checked ? "tasks" : "taskHistory";
    const toCollection = checkbox.checked ? "taskHistory" : "tasks";

    // Get the task data first
    db.collection("users").doc(user.uid).collection(fromCollection).doc(taskId).get()
        .then((doc) => {
            if (!doc.exists) throw new Error("Task not found");
            const taskData = doc.data();
            taskData.completed = checkbox.checked;

            if (checkbox.checked) {
                taskData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
            } else {
                delete taskData.completedAt;
            }

            const taskValue = taskData.value || 1;

            // Get current StatPoints to calculate the new total and level
            return db.collection("users").doc(user.uid).get()
                .then((userDoc) => {
                    const currentPoints = userDoc.data().StatPoints || 0;
                    const newPoints = checkbox.checked ? currentPoints + taskValue : currentPoints - taskValue;
                    const levelData = calculateLevel(newPoints); // Calculate new level

                    // Update both StatPoints and Level in Firestore
                    return db.collection("users").doc(user.uid).update({
                        StatPoints: newPoints,
                        Level: levelData.currentLevel
                    }).then(() => taskData); // Return taskData for the next step
                });
        })
        .then((taskData) => {
            // Add to new collection
            return db.collection("users").doc(user.uid).collection(toCollection).doc(taskId).set(taskData);
        })
        .then(() => {
            // Delete from original collection
            return db.collection("users").doc(user.uid).collection(fromCollection).doc(taskId).delete();
        })
        .then(() => {
            // Reload the task list to reflect changes
            loadTasks();
        })
        .catch((error) => {
            console.error("Error toggling task completion:", error);
        });
}
// function removeTask(checkbox) {
//     console.log("removeTask triggered with checkbox:", checkbox);

//     const taskItem = checkbox.parentElement.parentElement;
//     console.log("taskItem:", taskItem);
//     const taskId = taskItem.getAttribute('data-task-id');
//     console.log("taskId:", taskId);

//     const user = firebase.auth().currentUser;
//     console.log("user:", user ? user.uid : "No user");
//     if (!user || !taskId) {
//         console.error("No user or task ID available - user:", user, "taskId:", taskId);
//         return;
//     }
//     if (checkbox.checked) {
//         // ✅ MARK AS COMPLETE
//         console.log(`Attempting to complete task ${taskId} for user ${user.uid}`);

//         db.collection("users").doc(user.uid).collection("tasks").doc(taskId).get()
//             .then((doc) => {
//                 if (!doc.exists) {
//                     console.error(`Task ${taskId} does not exist`);
//                     return;
//                 }
//                 const taskData = doc.data();
//                 console.log("Task data:", taskData);

//                 const completedTask = {
//                     ...taskData,
//                     completed: true,
//                     completedAt: firebase.firestore.FieldValue.serverTimestamp()
//                 };

//                 return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).set(completedTask)
//                     .then(() => {
//                         console.log(`Task ${taskId} moved to history`);
//                         return db.collection("users").doc(user.uid).update({
//                             StatPoints: firebase.firestore.FieldValue.increment(taskData.value || 1)
//                         });
//                     })
//                     .then(() => {
//                         console.log(`StatPoints incremented by ${taskData.value || 1}`);
//                         return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).delete();
//                     })
//                     .then(() => {
//                         console.log(`Task ${taskId} deleted from active tasks`);
//                         taskItem.remove();
//                         return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).get();
//                     })
//                     .then((doc) => {
//                         if (doc.exists) {
//                             console.log("Re-fetched task from history:", doc.data());
//                             addTaskToUI(taskId, doc.data(), true);
//                         }
//                     });
//             })
//             .catch((error) => {
//                 console.error("Error in task completion process:", error);
//             });
//     } else {
//         // ✅ MOVE BACK TO ACTIVE TASKS
//         console.log(`Attempting to un-complete task ${taskId}`);

//         db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).get()
//             .then((doc) => {
//                 if (!doc.exists) {
//                     console.error(`Task ${taskId} not found in history`);
//                     return;
//                 }

//                 const taskData = doc.data();
//                 const activeTask = {
//                     ...taskData,
//                     completed: false,
//                     completedAt: null
//                 };

//                 return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).set(activeTask)
//                     .then(() => {
//                         console.log(`Task ${taskId} moved back to active tasks`);
//                         // Decrement StatPoints by the same value
//                         return db.collection("users").doc(user.uid).update({
//                             StatPoints: firebase.firestore.FieldValue.increment(-(taskData.value || 1))
//                         });
//                     })
//                     .then(() => {
//                         console.log(`StatPoints decremented by ${taskData.value || 1}`);
//                         return db.collection("users").doc(user.uid).collection("taskHistory").doc(taskId).delete();
//                     })
//                     .then(() => {
//                         console.log(`Task ${taskId} removed from history`);
//                         if (existingTask) existingTask.remove();
//                         addTaskToUI(taskId, activeTask, false);
//                     });
//             })
//             .catch((error) => {
//                 console.error("Error moving task back to active:", error);
//             });
//     }
// }



function deleteTask(taskId, isCompleted) {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const collectionName = isCompleted ? "taskHistory" : "tasks";
    db.collection("users").doc(user.uid).collection(collectionName).doc(taskId).delete()
        .then(() => {
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) taskElement.remove();
        })
        .catch((error) => {
            console.error("Error deleting task:", error);
        });
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

    const deleteAllBtn = document.getElementById('deleteAllTasksButton');
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', function () {
            if (!confirm("Are you sure you want to permanently delete ALL active and completed tasks?")) return;

            const user = firebase.auth().currentUser;
            if (!user) return;

            const userDoc = db.collection("users").doc(user.uid);
            const tasksRef = userDoc.collection("tasks");
            const historyRef = userDoc.collection("taskHistory");

            const deleteFromCollection = (ref) => {
                return ref.get().then(snapshot => {
                    const deletions = snapshot.docs.map(doc => ref.doc(doc.id).delete());
                    return Promise.all(deletions);
                });
            };

            Promise.all([
                deleteFromCollection(tasksRef),
                deleteFromCollection(historyRef)
            ]).then(() => {
                document.getElementById('tasks').innerHTML = '';
                console.log("All active and completed tasks deleted.");
            }).catch((error) => {
                console.error("Error deleting all tasks:", error);
            });
        });
    }

    document.getElementById('tasks').addEventListener('blur', function (event) {
        if (event.target.classList.contains('task-name-input')) {
            const newName = event.target.value.trim();
            const taskId = event.target.getAttribute('data-task-id');
            const isCompleted = event.target.classList.contains('completed-task');
            const collection = isCompleted ? 'taskHistory' : 'tasks';

            const user = firebase.auth().currentUser;
            if (user && taskId && newName) {
                db.collection("users").doc(user.uid).collection(collection).doc(taskId).update({
                    name: newName
                }).then(() => {
                    console.log(`Task ${taskId} updated in Firestore.`);
                    const feedback = document.getElementById('taskFeedback');
                    if (feedback) {
                        feedback.classList.remove('d-none');
                        setTimeout(() => feedback.classList.add('d-none'), 1500);
                    }
                }).catch(error => {
                    console.error("Error updating task name:", error);
                });
            }
        }
    }, true);  // useCapture = true to ensure blur bubbles up

});

//************************************************************************************************ */
//AI Assisted - Chat box functionality .

// Chat system implementation
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

} function joinStudySession(sessionId) {
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
            window.location.href = 'main.html';
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

} function listenToSessionChanges(sessionId) {
    const user = firebase.auth().currentUser;
    if (!user) return;

    // Stop any existing listener
    if (sessionListenerUnsubscribe) {
        sessionListenerUnsubscribe();
        sessionListenerUnsubscribe = null;
    }

    let participantsCleanup = null;

    sessionListenerUnsubscribe = db.collection("studySessions").doc(sessionId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const sessionData = doc.data();
                const participants = sessionData.participants || [];

                // Clean up previous participant listeners if they exist
                if (participantsCleanup) {
                    participantsCleanup();
                }

                // Update participants list in UI with real-time listeners
                participantsCleanup = updateParticipantsUI(participants);

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
                if (participantsCleanup) {
                    participantsCleanup();
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

    // Map to store unsubscribe functions for each participant's listener
    const unsubscribeMap = new Map();

    // Real-time listener for each participant
    participants.forEach((participantId) => {
        const unsubscribe = db.collection("users").doc(participantId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    const userLevel = userData.Level || 0;
                    const userStatPoints = userData.StatPoints || 0;
                    const displayName = userData.displayName || 'Anonymous';

                    // Check if participant element already exists
                    let participantElement = participantsContainer.querySelector(`[data-participant-id="${participantId}"]`);
                    if (!participantElement) {
                        participantElement = document.createElement('div');
                        participantElement.classList.add('participant-item');
                        participantElement.setAttribute('data-participant-id', participantId);
                        participantsContainer.appendChild(participantElement);
                    }

                    // Update content with flexbox layout
                    participantElement.innerHTML = `
                        <div style="display: flex; gap: 10px;">
                            <span style="min-width: 100px; text-align: left;">${displayName}</span>
                            <span style="min-width: 70px;">Level: ${userLevel}</span>
                            <span style="min-width: 100px;">Points: ${userStatPoints}</span>
                        </div>
                    `;
                } else {
                    // Remove participant if they no longer exist
                    const element = participantsContainer.querySelector(`[data-participant-id="${participantId}"]`);
                    if (element) element.remove();
                }
            }, (error) => {
                console.error(`Error listening to participant ${participantId}:`, error);
            });

        // Store unsubscribe function
        unsubscribeMap.set(participantId, unsubscribe);
    });

    // Clean up listeners when participants change or page unloads
    const cleanupListeners = () => {
        unsubscribeMap.forEach((unsubscribe) => unsubscribe());
        unsubscribeMap.clear();
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupListeners);

    // Return cleanup function in case participants change
    return cleanupListeners;
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

} function loadChatMessages(sessionId) {
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

} function addMessageToUI(messageData) {
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

} function formatTimestamp(timestamp) {
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
// Function to toggle chat list
function toggleChatList() {
    closeOtherModals('chatList'); // Close other modals
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
            const alertBox = document.getElementById("inviteSuccessAlert");
            if (alertBox) {
                alertBox.style.display = "block";
                setTimeout(() => {
                    alertBox.style.display = "none";
                }, 3000); // hides after 3 seconds
            }
            toggleUserList();
            document.getElementById("stopwatchContainer").style.display = "block";
            document.getElementById("showUsersBtnContainer").style.display = "none";
        })
        .catch((error) => {
            console.error("Error inviting user:", error);
            alert("Failed to invite user. Please try again.");
        });
}

function toggleUserList() {
    closeOtherModals('userList');
    const userList = document.getElementById('userList');
    userList.classList.toggle('active');
    if (userList.classList.contains('active')) {
        loadOnlineUsers(); 
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

}
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

    // Make task list draggable and update order in Firestore
    const tasksContainer = document.getElementById('tasks');
    if (tasksContainer) {
        new Sortable(tasksContainer, {
            animation: 150,
            handle: '.drag-handle',
            onEnd: function (evt) {
                const taskItems = [...tasksContainer.querySelectorAll('.task-item')];
                const user = firebase.auth().currentUser;

                taskItems.forEach((item, index) => {
                    const taskId = item.getAttribute('data-task-id');
                    if (taskId && user) {
                        db.collection("users").doc(user.uid).collection("tasks").doc(taskId).update({
                            order: index
                        }).catch(err => console.error("Error updating task order:", err));
                    }
                });
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
    switch (notificationType) {
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

//Leveling Logic

function calculateLevel(points) {
    let level = 1;
    let fib1 = 0; // Points needed for level 1
    let fib2 = 5; // Points needed for level 2

    while (points >= fib2) {
        level++;
        const nextFib = fib1 + fib2;
        fib1 = fib2;
        fib2 = nextFib;
    }

    return {
        currentLevel: level,
        nextLevelPoints: fib2,
        pointsNeeded: fib2 - points
    };
}

document.getElementById('tasks').addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('editable-text')) {
        const type = target.classList.contains('deadline-text') ? 'deadline' : 'value';
        const isCompleted = target.dataset.isCompleted === "true";
        const taskId = target.dataset.taskId;
        const currentValue = target.dataset.value;

        let input;

        if (type === 'deadline') {
            input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control form-control-sm flatpickr-inline-deadline';
            input.value = currentValue;

            target.replaceWith(input);
            document.body.offsetHeight; // force reflow to ensure input is in the DOM

            flatpickr(input, {
                enableTime: false,
                dateFormat: "F j, Y",
                defaultDate: currentValue || null,
                minDate: "today",
                onClose: function (selectedDates, dateStr) {
                    setTimeout(() => {
                        input.value = dateStr;
                        input.dispatchEvent(new Event('blur'));
                    }, 0);
                }
            });

            input.focus();


        } else {
            input = document.createElement('select');
            input.className = 'form-select form-select-sm';
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = '⭐'.repeat(i);
                if (parseInt(currentValue) === i) option.selected = true;
                input.appendChild(option);
            }
            target.replaceWith(input);

        }

        input.style.maxWidth = '200px';
        input.dataset.taskId = taskId;
        input.dataset.isCompleted = isCompleted;
        input.dataset.type = type;


        input.addEventListener('blur', () => {
            const newValue = type === 'value' ? parseInt(input.value) : input.value;
            const collection = isCompleted ? 'taskHistory' : 'tasks';

            db.collection("users").doc(firebase.auth().currentUser.uid).collection(collection).doc(taskId).update({
                [type]: newValue
            }).then(() => {
                const span = document.createElement('span');
                span.className = `editable-text ${type === 'value' ? 'difficulty-text' : 'deadline-text'}`;
                span.dataset.taskId = taskId;
                span.dataset.value = newValue;
                span.dataset.isCompleted = isCompleted;
                if (type === 'value') {
                    span.textContent = '⭐'.repeat(newValue);
                } else if (type === 'deadline') {
                    span.textContent = input.value || "None";
                } else {
                    span.textContent = newValue || "None";
                }

                input.replaceWith(span);
                const feedback = document.getElementById('taskFeedback');
                if (feedback) {
                    feedback.classList.remove('d-none');
                    setTimeout(() => feedback.classList.add('d-none'), 1500);
                }

            }).catch(error => {
                console.error(`Error updating ${type}:`, error);
            });
        });
    }
});
// Function to close all modals except the one being opened
function closeOtherModals(exceptId) {
    const modals = [
        { id: 'taskList', element: document.getElementById('taskList') },
        { id: 'chatList', element: document.getElementById('chatList') },
        { id: 'userList', element: document.getElementById('userList') }
    ];

    modals.forEach(modal => {
        if (modal.id !== exceptId && modal.element && modal.element.classList.contains('active')) {
            modal.element.classList.remove('active');
        }
    });
}