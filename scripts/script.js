
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

// settingsButton profile.html
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