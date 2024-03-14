document.addEventListener('DOMContentLoaded', () => {
  let dbResponse
  setTimeout(() => {
  fetch('./data/DB_MED.json')
  .then(response => response.json())
  .then(data => dbResponse = data);
  console.log(dbResponse)
}, "500");
});

const btnAgregar = document.getElementById("btnAgregar")
btnAgregar.addEventListener('click', () => {

})
