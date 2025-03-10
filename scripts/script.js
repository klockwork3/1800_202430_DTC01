
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
function logOut() {
      console.log('You have logged out!'); // in future sprints, these will do something
}

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
      logoutButton.addEventListener('click', function () {
            logOut();
      });
}


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
  
  // moving completed tasks to history
  function removeTask(checkbox) {
  const taskItem = checkbox.parentElement;
  const taskId = taskItem.getAttribute('data-task-id');
  const user = firebase.auth().currentUser;
  
  if (user && taskId) {
  // First, get the task data
  db.collection("users").doc(user.uid).collection("tasks").doc(taskId).get()
      .then((doc) => {
          if (doc.exists) {
              const taskData = doc.data();
              
              // Add completion timestamp
              const completedTask = {
                  ...taskData,
                  completedAt: firebase.firestore.FieldValue.serverTimestamp()
              };
              
              // Add to task history
              return db.collection("users").doc(user.uid).collection("taskHistory").add(completedTask)
                  .then(() => {
                      console.log("Task moved to history!");
                      
                      // Also update the user's TasksCompleted counter
                      return db.collection("users").doc(user.uid).update({
                          TasksCompleted: firebase.firestore.FieldValue.increment(1)
                      });
                  })
                  .then(() => {
                      // Delete from active tasks collection
                      return db.collection("users").doc(user.uid).collection("tasks").doc(taskId).delete();
                  })
                  .then(() => {
                      // Remove from UI
                      taskItem.remove();
                  });
          } else {
              console.log("Task document doesn't exist!");
              taskItem.remove(); // Remove from UI anyway
          }
      })
      .catch((error) => {
          console.error("Error moving task to history: ", error);
      });
  } else {
  // Fallback to just UI removal if no taskId or user
  taskItem.remove();
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
  
      // Toggle visibility of the deadline and reminder fields based on checkbox state
      document.getElementById('taskDeadlineCheckbox').addEventListener('change', function () {
          document.getElementById('taskDeadlineInput').style.display = this.checked ? 'block' : 'none';
      });
  
      document.getElementById('taskReminderCheckbox').addEventListener('change', function () {
          document.getElementById('taskReminderInput').style.display = this.checked ? 'block' : 'none';
      });
  
      // Add task to task list when "add task" button is clicked
  document.getElementById('addTaskButton').addEventListener('click', function () {
  const taskName = document.getElementById('recipient-name').value;
  const taskDescription = document.getElementById('message-text').value;
  const taskDeadline = document.getElementById('taskDeadlineInput').value;
  const taskReminder = document.getElementById('taskReminderInput').value;
  
  if (taskName) {
  // Create task object
  const task = {
      name: taskName,
      description: taskDescription,
      deadline: taskDeadline,
      reminder: taskReminder,
      completed: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
              //Likely will remove this part or replace with a nicer UI
              if (taskDeadline) {
                  taskHTML += ` | Deadline: ${taskDeadline}`;
              }
              if (taskReminder) {
                  taskHTML += ` | Reminder: ${taskReminder}`;
              }
              taskHTML += `</div>`;
  
              // Append the new task HTML to the task list
              document.getElementById('tasks').insertAdjacentHTML('beforeend', taskHTML);
              document.getElementById('taskForm').reset();
  
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
      });
  });
  
  // Firebase auth state listener
  firebase.auth().onAuthStateChanged(function(user) {
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
  db.collection("users").doc(user.uid).collection("tasks")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
          // Clear existing tasks first
          document.getElementById('tasks').innerHTML = '';
          
          querySnapshot.forEach((doc) => {
              const taskData = doc.data();
              
              // Create task HTML
              let taskHTML = `
                  <div class="task-item" data-task-id="${doc.id}">
                      <input type="checkbox" class="my-3" onclick="removeTask(this)">
                      <label>${taskData.name}</label>
              `;
              if (taskData.deadline) {
                  taskHTML += ` | Deadline: ${taskData.deadline}`;
              }
              if (taskData.reminder) {
                  taskHTML += ` | Reminder: ${taskData.reminder}`;
              }
              taskHTML += `</div>`;
  
              // Append the task HTML to the task list
              document.getElementById('tasks').insertAdjacentHTML('beforeend', taskHTML);
          });
      })
      .catch((error) => {
          console.log("Error getting tasks: ", error);
      });
  }
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
