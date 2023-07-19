// Loading the page with initial data from database
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5000/getAll")
    .then((response) => response.json()) // calling loadHTMLTable load the data gotten from response
    .then((data) => loadHTMLTable(data["data"]));
});

// Any button onClick listener on the page including DELETE and EDIT button
document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    // console.log(event.target);
    // Check if the button pressed is DELETE or not
    if (event.target.className === "delete-row-btn") {
      deleteRowByID(event.target.dataset.id);
    }
    // Check if the button pressed is EDIT or not
    if (event.target.className === "edit-row-btn") {
      // console.log(event.target.dataset.id);
      handleEditRow(event.target.dataset.id);
    }
  });

// Grab the UPDATE button to EDIT a row from DOM
const updateBTN = document.getElementById("update-row-btn");

// Delete button function to delete a row from table
function deleteRowByID(id) {
  // console.log(id); // Logs the ID of which row of data being deleted
  fetch("http://localhost:5000/delete/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

// EDIT button function to handle which row to edit by ID and show the UPDATE prompt
function handleEditRow(id) {
  const updateSection = document.querySelector("#update-row");
  updateSection.hidden = false; // To unhide the update prompt on page
  document.querySelector("#update-row-btn").dataset.id = id;
}

// Update button Event listener
updateBTN.onclick = function (event) {
  const updateNameInput = document.querySelector("#update-name-input");
  // console.log(event.target.dataset.id);
  // const name = updateNameInput.value;
  // const id = updateNameInput.dataset.id;
  // const id = event.target.dataset.id;
  // console.log(name);
  // console.log(id);

  fetch("http://localhost:5000/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: event.target.dataset.id,
      // id: updateNameInput.dataset.id,
      name: updateNameInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};

// Grabing the Add button from DOM
const addBTN = document.querySelector("#add-name-btn");
// Grabing the search button from DOM
const searchBTN = document.querySelector("#search-btn");

// Search button click listener and fetch call to search
searchBTN.onclick = function () {
  const searchValue = document.querySelector('#search-input').value;
  fetch("http://localhost:5000/search/"+searchValue)
    .then((response) => response.json()) // calling loadHTMLTable load the data gotten from response
    .then((data) => loadHTMLTable(data["data"]));
}

// Add button onClick function called
addBTN.onclick = function () {
  // Grabbing input field from DOM
  const nameInput = document.querySelector("#name-input");
  const name = nameInput.value;
  console.log(name);
  nameInput.value = "";

  // Calling fetch function to insert data into database
  fetch("http://localhost:5000/insert", {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json()) // Return value from insertNewName function
    .then((data) => insertIntoRowTable(data["data"])); // insertIntoRowTable called to render table with new data
};

// Function to insert rows and collumn with data returned by insertNewName
function insertIntoRowTable(data) {
  // Grabbing table from DOM
  console.log(data);
  const table = document.querySelector("table tbody");
  const isTableEmpty = document.querySelector(".no data");
  let tableHtml = "<tr>";

  // FOR loop, not FOR-EACH function because data not array, but Object
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        // .toLocalString used to just take date and time
        data[key] = new Date(data[key]).toLocaleString();
      }
      // Creating table rows and inserting data into collumns
      tableHtml += `<td>${data[key]}</td>`;
    }
  }

  // Creating  collumn and inserting buttons
  tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
  tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
  tableHtml += "</tr>";

  // Checking if table is empty
  if (isTableEmpty) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}

function loadHTMLTable(data) {
  const table = document.querySelector("table tbody");

  // when no data in database, insert NO DATA FOUND in table
  if (data.length === 0) {
    table.innerHTML =
      "<tr><td class='no-data' colspan='5'>No Data Found</td></tr>";
    return;
  }
  let tableHTML = "";

  // Creating table rows and inserting data into collumns
  data.forEach(function ({ id, name, date_added }) {
    tableHTML += "<tr>";
    tableHTML += `<td>${id}</td>`;
    tableHTML += `<td>${name}</td>`;
    tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`;
    tableHTML += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
    tableHTML += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
    tableHTML += "</tr>";
  });
  // inserting tableHtml data into table
  table.innerHTML = tableHTML;
}
