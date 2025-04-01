
var your_collection_name = "users"; // Name of the collection in Firestore
// AI AIDED FUNCTION
function fetchDataRealTime() {
      db.collection(your_collection_name)
            .orderBy("StatPoints", "desc")
            .limit(15)
            .onSnapshot((querySnapshot) => {
                  const dataContainer = document.getElementById("leaderboard-placeholder");
                  dataContainer.innerHTML = "";

                  let table = document.createElement("table");
                  table.classList.add("table", "table-striped", "table-bordered", "table-hover");

                  let thead = document.createElement("thead");
                  let headerRow = document.createElement("tr");

                  headerRow.innerHTML = `
              <th scope="col">Rank</th>
              <th scope="col">Name</th>
              <th scope="col">Level</th>
              <th scope="col">StatPoints</th>
             
            `;
                  thead.appendChild(headerRow);
                  table.appendChild(thead);

                  let tbody = document.createElement("tbody");

                  let rank = 1;

                  querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        const userName = userData.name || "Anonymous"; // Default to "Anonymous" if no name is provided
                        const userLevel = userData.Level || 0; // Default to 0 if no level is provided
                        const userStatPoints = userData.StatPoints || 0; // Default to 0 if no stat points

                        // Create a row for each user
                        let row = document.createElement("tr");

                        row.innerHTML = `
                    <th scope="row">${rank}</th>
                    <td>${userName}</td>
                    <td>${userLevel}</td>
                    <td>${userStatPoints}</td>
                  
                    
                  `;

                        tbody.appendChild(row);
                        rank++;
                  });

                  table.appendChild(tbody);
                  dataContainer.appendChild(table);
            }, (error) => {
                  console.error("Error fetching real-time updates:", error);
            });
}

// Fetch the leaderboard data when the page loads
window.onload = fetchDataRealTime;
