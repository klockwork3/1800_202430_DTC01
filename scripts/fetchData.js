
window.onload = function () {
      if (typeof db === "undefined") {
            console.error("Firestore is not initialized. Check Firebase setup.");
            return;
      }

      var your_collection_name = "users"

      function fetchDataRealTime() {
            db.collection(your_collection_name).onSnapshot((querySnapshot) => {
                  const dataContainer = document.getElementById("data-container");
                  dataContainer.innerHTML = ""; // Clear previous content

                  querySnapshot.forEach((doc) => {
                        const dataItem = document.createElement("p");
                        dataItem.textContent = `${doc.id}: ${JSON.stringify(doc.data())}`;
                        dataContainer.appendChild(dataItem);
                  });
            }, (error) => {
                  console.error("Error fetching real-time updates:", error);
            });
      }

      fetchDataRealTime();
};