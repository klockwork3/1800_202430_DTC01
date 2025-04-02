document.addEventListener("DOMContentLoaded", function () {
      fetch("nav.html")
            .then(response => response.text())
            .then(data => {
                  document.getElementById("nav-placeholder").innerHTML = data;
            })
            .catch(error => console.error("Error loading navigation:", error));
});

firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users").doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              const avatar = doc.data().avatar;
              const avatarImg = document.getElementById('profileAvatar');
    
              if (avatarImg && avatar) {
                avatarImg.src = `images/avatar-icons/${avatar}`;  // ✅ uses your actual folder
              }
            }
          })
          .catch(error => {
            console.error("Error loading avatar in nav:", error);
          });
      }
    });
    
    