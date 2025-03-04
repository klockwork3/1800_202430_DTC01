
// newSessionButton main.html
function newSession() {
      console.log('Hello! The button was clicked!'); // in future sprints, these will do something
}

document.getElementById('newSessionButton').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      newSession();
});


// settingsButton profile.html
function goSettings() {
      console.log('You went to the settings!'); // in future sprints, these will do something
}

document.getElementById('settingsButton').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      goSettings();
});


// logoutButton profile.html
function logOut() {
      console.log('You have logged out!'); // in future sprints, these will do something
}

document.getElementById('logoutButton').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      logOut();
});

