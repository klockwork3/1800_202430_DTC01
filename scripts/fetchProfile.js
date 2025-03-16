// fetchProfile.js

document.addEventListener('DOMContentLoaded', () => {
      auth.onAuthStateChanged(user => {
            if (user) {
                  fetchUserData(user);
            } else {
                  document.getElementById('displayName').innerHTML = '<p>No user signed in.</p>';
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

                        // Update user information
                        userDataElement.innerHTML = `
                    <p><strong>Name:</strong> ${userData.name}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                `;

                        // Only show stat points in the statPoints div
                        statPointsElement.innerHTML = `<p>${userData.StatPoints || 0}</p>`;
                        tasksCompletedElement.innerHTML = `<p>${userData.TasksCompleted || 0}</p>`;
                        userLevelElement.innerHTML = `<p>${userData.Level || 0}</p>`;
                  } else {
                        userDataElement.innerHTML = '<p>No user data found.</p>';
                        statPointsElement.innerHTML = ''; // Clear stat points if no data
                        tasksCompletedElement.innerHTML = ''; // empty if no data
                        userLevelElement.innerHTML = ''; //empty if no data/etc
                  }
            })
            .catch(error => {
                  console.error("Error fetching user data: ", error);
                  userDataElement.innerHTML = '<p>Error fetching user data.</p>';
            });
}




