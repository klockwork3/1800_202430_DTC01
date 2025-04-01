document.addEventListener("DOMContentLoaded", function () {
      fetch("navBot.html")
            .then(response => response.text())
            .then(data => {
                  document.getElementById("nav-placeholder-bot").innerHTML = data;
            })
            .catch(error => console.error("Error loading navigation:", error));
});