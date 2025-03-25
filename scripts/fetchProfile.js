// fetchProfile.js

document.addEventListener('DOMContentLoaded', () => {
      auth.onAuthStateChanged(user => {
        if (user) {
          fetchUserData(user);
        } else {
          const userDataElement = document.getElementById('displayName');
          if (userDataElement) {
            userDataElement.innerHTML = '<p>No user signed in.</p>';
          }
        }
      });
    });
    
    function fetchUserData(user) {
      const userDataElement = document.getElementById('displayName');
      const statPointsElement = document.getElementById('statPoints');
      const tasksCompletedElement = document.getElementById('tasksCompletedPoints');
      const userLevelElement = document.getElementById('levelOfUser');
    
      db.collection('users').doc(user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
    
            // ✅ Update welcome message if on main.html
            const welcomeNameEl = document.getElementById('welcomeName');
            if (welcomeNameEl) {
              welcomeNameEl.textContent = userData.name || "Friend";
            }
    
            // ✅ Update profile page details if on profile.html
            if (userDataElement) {
              userDataElement.innerHTML = `
                <p><strong>Name:</strong> ${userData.name}</p>
                <p><strong>Pronuns:</strong> ${userData.pronouns}</p>
                <p><strong>Bio:</strong> ${userData.bio}</p>
              `;
            }
    
            if (statPointsElement) {
              statPointsElement.innerHTML = `<p>${userData.StatPoints || 0}</p>`;
            }
    
            if (tasksCompletedElement) {
              tasksCompletedElement.innerHTML = `<p>${userData.TasksCompleted || 0}</p>`;
            }
    
            if (userLevelElement) {
              userLevelElement.innerHTML = `<p>${userData.Level || 0}</p>`;
            }
          } else {
            if (userDataElement) userDataElement.innerHTML = '<p>No user data found.</p>';
            if (statPointsElement) statPointsElement.innerHTML = '';
            if (tasksCompletedElement) tasksCompletedElement.innerHTML = '';
            if (userLevelElement) userLevelElement.innerHTML = '';
          }
        })
        .catch(error => {
          console.error("Error fetching user data: ", error);
          if (userDataElement) {
            userDataElement.innerHTML = '<p>Error fetching user data.</p>';
          }
        });
    }
    