
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      auth.signOut()
        .then(() => {
          window.location.href = '/login'; // Redirect to login page
        })
        .catch(error => {
          console.error("Error signing out: ", error);
        });
    });
  }

  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        var user = authResult.user;                            // get the user object from the Firebase authentication database
        if (authResult.additionalUserInfo.isNewUser) {         //if new user
          db.collection("users").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
            displayName: user.displayName,                    //"users" collection
            name: user.displayName,
            email: user.email,                         //with authenticated user's ID (user.uid)
            StatPoints: 0,  // Default points for progression/rewards
            Level: 1,       // A leveling system for motivation
            Achievements: [], // Array to store milestone badges
            TasksCompleted: 0,  //Stores number of completed tasks
            isOnline: true, // Add this to mark new user as online
          }).then(function () {
            console.log("New user added to firestore");
            window.location.assign("main.html");       //re-direct to main.html after signup
          }).catch(function (error) {
            console.log("Error adding new user: " + error);
          });
        } else {
          // Update existing user's online status
          db.collection("users").doc(user.uid).update({
            isOnline: true
          })
            .then(function () {
              console.log("User marked as online");
              window.location.assign("main.html");
            })
            .catch(function (error) {
              console.error("Error updating online status: ", error);
            });
          return false;
        }
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);
});