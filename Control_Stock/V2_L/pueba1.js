function promesa1() {
    let dbresponse;
    
    fetch('./data/DB.json')
  .then(response => response.json())
  .then(data => console.log(data));
}

promesa1();