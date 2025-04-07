document.addEventListener('DOMContentLoaded', () => {
      auth.onAuthStateChanged(user => {
            if (user) {
                  fetchUserData(user);
                  setupProfileUpdate(user);
                  setupAvatarSelection();
            } else {
                  console.log("No user signed in.");
            }
      });
});

// submit button, will update the userprofile
function setupProfileUpdate(user) {
      const form = document.getElementById('profileForm');

      form.addEventListener('submit', function (event) {
            event.preventDefault();
            updateUserProfile(user);
      });
}

function setupAvatarSelection() {
      // Set the first avatar as selected by default
      const firstAvatar = document.querySelector('.avatar-option');
      if (firstAvatar) {
            firstAvatar.classList.add('selected');
            document.getElementById('selectedAvatar').value = firstAvatar.dataset.avatar;
      }
}

function selectAvatar(element) {
      // Remove selected class from all avatars
      document.querySelectorAll('.avatar-option').forEach(avatar => {
            avatar.classList.remove('selected');
      });

      // Add selected class to clicked avatar
      element.classList.add('selected');

      // Update the hidden input value
      document.getElementById('selectedAvatar').value = element.dataset.avatar;
}

function updateUserProfile(user) {
      if (!user || !user.uid) {
            console.error("No user found. Cannot update profile.");
            return;
      }

      const displayName = document.getElementById('displayNameChange').value.trim();
      const pronouns = document.getElementById("pronounSelect").value;
      const bio = document.getElementById("bioArea").value.trim();
      const avatar = document.getElementById("selectedAvatar").value;

      db.collection('users').doc(user.uid).set({
            name: displayName || user.displayName,
            pronouns: pronouns,
            bio: bio,
            avatar: avatar // Add the avatar field to the user document
      }, { merge: true })
            .then(() => {
                  const alertBox = document.getElementById('updateAlert');
                  if (alertBox) {
                        alertBox.classList.remove('d-none');
                  }

                  setTimeout(() => {
                        window.location.href = 'profile.html';
                  }, 2000);
            })
            .catch(error => {
                  console.error("Error updating profile: ", error);
                  alert("Error updating profile!");
            });
}

// Mmske selectAvatar function available globally
window.selectAvatar = selectAvatar;