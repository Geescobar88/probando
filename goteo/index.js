//  function calcular() {
//      let goteo = document.getElementById('goteo').value;
//      let medicacion = document.getElementById('medicacion').value;
//      let duracion = document.getElementById('duracion').value;
//      let volumen = document.getElementById('volumen').value;

//     if (goteo == "") {
//         alert("El campo goteo no puede quedar vacio.")
//     } else {
//         let volTotal = (Number(goteo) * Number(duracion)) / (Number(volumen) + Number(medicacion));
//         let baxter = Math.ceil(volTotal);

//         document.getElementById('volTotal').innerHTML = "La cantidad de baxter que usaran es: " + baxter;
//     }
//  }

// ------------------------------------EJEMPLO------------------------------------


//  const person = [
//     {
//       firstName: "John",
//       lastName : "Doe",
//       id     :  5566
//     },
//     {
//       firstName: "Jo2n",
//       lastName : "D2e",
//       id     :  5567
//     },
//     {
//       firstName: "John",
//       lastName : "Doe",
//       id     :  5568
//     },
//     ];
    
//     document.getElementById("demo").innerHTML =
//     person[1].firstName + " " + person[1].lastName;



//     ------------------------------------EJEMPLO------------------------------------

const medicacion = [
    {
      articulo : "Midazolam",
      presentacion :  "Ampolla",
      concentracion : 3,
      contenido : 3,
      baxter : 250,
      cantidad : 20
    },
    {
        articulo : "Fentanilo",
        presentacion :  "Ampolla",
        concentracion : 0.05,
        contenido : 5,
        baxter : 100,
        cantidad : 10
      },
      {
        articulo : "Remifentanilo",
        presentacion :  "Frasco-Ampolla",
        concentracion : 5,
        contenido : 0,
        baxter : 200,
        cantidad : 4
      },
    ];

    function cargar() {
      const elegir = document.querySelectorAll("#lista option");
      for (i = 0 ; i < elegir.length ; i++) {
        elegir[i].value = medicacion[i].articulo;
      }
      console.log(elegir);

    }

    // Select a fruit and click the button:
    // <select id="mySelect">
    //   <option>Apple</option>
    //   <option>Orange</option>
    //   <option>Pineapple</option>
    //   <option>Banana</option>
    // </select>
    
    // <button type="button" onclick="myFunction()">Display index</button>
    
    // <script>
    // function myFunction() {
    //   var x = document.getElementById("mySelect").selectedIndex;
    //   var y = document.getElementById("mySelect").options;
    // y[2].text = "atun";
    // }
    // </script>


