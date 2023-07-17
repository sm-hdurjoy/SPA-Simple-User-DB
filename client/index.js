document.addEventListener('DOMContentLoaded', function (){
  fetch('http://localhost:5000/getAll')
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
  
});

const addBTN = document.querySelector('#add-name-btn');

addBTN.onClick = function (){
  const nameInput = document.querySelector('#name-input');
  const name = nameInput.value;
  console.log(name);
  nameInput.value = "";

  fetch('http://localhost:5000/insert',{
    headers: {
      'content-type':'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name : name})
  })
  .then(response => response.json())
  .then(data => insertIntoRowTable(data['data']));
}

function insertIntoRowTable (data){

}

function loadHTMLTable (data){
  const table = document.querySelector('table tbody');
  // let tableHTML = "";
  
  if (data.length === 0 ){
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data Found</td></tr>";
  }
}