
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

