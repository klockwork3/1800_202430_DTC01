auth.onAuthStateChanged(user => {
      if (user) {
            document.getElementById("displayName").textContent = user.name || "Anonymous";
      } else {
            console.log('No user is logged in');
      }
});


// ughhh not working yet