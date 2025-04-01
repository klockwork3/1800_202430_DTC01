// Handle logout button (moved outside window click listener)
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
      logoutButton.addEventListener("click", function () {
            const user = firebase.auth().currentUser;
            if (user) {
                  db.collection("users").doc(user.uid).update({
                        isOnline: false,
                        lastActive: firebase.firestore.FieldValue.serverTimestamp()
                  })
                        .then(() => {
                              return firebase.auth().signOut();
                        })
                        .then(() => {
                              console.log("User signed out and marked offline");
                              window.location.href = "login.html";
                        })
                        .catch((error) => {
                              console.error("Error during logout:", error);
                              firebase.auth().signOut().then(() => {
                                    window.location.href = "login.html";
                              });
                        });
            } else {
                  firebase.auth().signOut().then(() => {
                        window.location.href = "login.html";
                  }).catch((error) => {
                        console.error("Error signing out:", error);
                  });
            }
      });
}