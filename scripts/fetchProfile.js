


document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      fetchUserData(user);
    } else {
      const userDataElement = document.getElementById('displayName');
      if (userDataElement) {
        userDataElement.textContent = 'No user signed in.';
      }
      window.location.href = 'index.html';
    }
  });
});

function fetchUserData(user) {
  const userDataElement = document.getElementById('displayName');
  const statPointsElement = document.getElementById('statPoints');
  const userLevelElement = document.getElementById('levelOfUser');
  const profileAvatarElement = document.getElementById('profileAvatar');
  const userPronounsElement = document.getElementById('userPronouns');
  const userBioElement = document.getElementById('userBio');

  db.collection('users').doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();

        if (userDataElement) {
          userDataElement.innerHTML = `
                <p><strong>Name:</strong> ${userData.name}</p>
                <p><strong>Pronouns:</strong> ${userData.pronouns}</p>
                <p><strong>Bio:</strong> ${userData.bio}</p>
              `;
        }


        //AI AIDED PORTION BELOW
        // Update profile avatar
        if (profileAvatarElement) {
          const avatarPath = userData.avatar ? `/images/avatar-icons/${userData.avatar}` : 'images/profilepic.jpg';
          profileAvatarElement.src = avatarPath;
        }

        // Update pronouns
        if (userPronounsElement) {
          userPronounsElement.textContent = userData.pronouns || "";
        }

        // Update bio
        if (userBioElement) {
          userBioElement.textContent = userData.bio || "No bio yet.";
        }

        // Update stats
        if (statPointsElement) {
          statPointsElement.textContent = userData.StatPoints || 0;
        }

        if (userLevelElement) {
          userLevelElement.textContent = userData.Level || 0;
        }
      } else {
        // Set default values if no document exists
        if (userDataElement) userDataElement.textContent = "Username";
        if (profileAvatarElement) profileAvatarElement.src = "images/profilepic.jpg";
        if (userPronounsElement) userPronounsElement.textContent = "";
        if (userBioElement) userBioElement.textContent = "No bio yet.";
        if (statPointsElement) statPointsElement.textContent = "0";
        if (userLevelElement) userLevelElement.textContent = "0";
      }
    })
    .catch(error => {
      console.error("Error fetching user data: ", error);
      // Set error states
      if (userDataElement) userDataElement.textContent = "Error loading profile";
      if (profileAvatarElement) profileAvatarElement.src = "images/profilepic.jpg";
      if (userPronounsElement) userPronounsElement.textContent = "";
      if (userBioElement) userBioElement.textContent = "Error loading bio";
      if (statPointsElement) statPointsElement.textContent = "0";
      if (userLevelElement) userLevelElement.textContent = "0";
    });
}
