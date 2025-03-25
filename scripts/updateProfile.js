document.addEventListener('DOMContentLoaded', () => {
      auth.onAuthStateChanged(user => {
            if (user) {
                  fetchUserData(user);
                  setupProfileUpdate(user);
            } else {
                  console.log("No user signed in.");
            }
      });
});

function setupProfileUpdate(user) {
      const form = document.getElementById('profileForm');

      form.addEventListener('submit', function (event) {
            event.preventDefault();
            updateUserProfile(user);
      });
}

function updateUserProfile(user) {
      if (!user || !user.uid) {
            console.error("No user found. Cannot update profile.");
            return;
      }

      const displayName = document.getElementById('displayNameChange').value.trim();
      const pronouns = document.getElementById("pronounSelect").value;
      const bio = document.getElementById("bioArea").value.trim();

      db.collection('users').doc(user.uid).set({
            name: displayName || user.displayName,
            pronouns: pronouns,
            bio: bio
      }, { merge: true })
            .then(() => {

                  window.location.href = 'profile.html';

            })
            .catch(error => {
                  console.error("Error updating profile: ", error);
                  alert("Error updating profile!");
            });
}
