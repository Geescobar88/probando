document.addEventListener('DOMContentLoaded', function () {
    menubar();

const header = document.getElementById("header")

const medicacion = document.getElementById("medicacion")
const dosis = document.getElementById("dosis")
const lote = document.getElementById("lote")
const vencimiento = document.getElementById("vencimiento")
const marca = document.getElementById("marca")
const contenedor = document.getElementById("contenedor")
const hoja = document.getElementById("hoja")
const boton = document.getElementById("establecer")

boton.addEventListener("click", () => {
header.style.display ="none"

document.body.style.alignItems ="normal"


const medicacion_etiq = document.querySelectorAll(".medicacion_etiq")

const dosis_etiq = document.querySelectorAll(".dosis_etiq")
const lote_etiq = document.querySelectorAll(".lote_etiq")
const vencimiento_etiq = document.querySelectorAll(".vencimiento_etiq")
const marca_etiq = document.querySelectorAll(".marca_etiq")
for (i = 0; i < medicacion_etiq.length ; i++) {
    medicacion_etiq[i].textContent = medicacion.value
    // if (medicacion.value.length > 12) {
    //     medicacion_etiq[i].style.fontSize = "11px"
    // }
    dosis_etiq[i].textContent = dosis.value
    lote_etiq[i].textContent = lote.value
    vencimiento_etiq[i].textContent = vencimiento.value
    marca_etiq[i].textContent = marca.value
}

contenedor.style.display ="none"
hoja.style.display ="inline"
})
  });


function menubar() {
    menu = document.getElementById("menu")
    menu_btn = document.getElementById("menu_btn")
    menu_close = document.getElementById("menu_close")
  
    menu_btn.addEventListener("click", () => {
      menu.style.display = "flex"
    })
  
    menu_close.addEventListener("click", () => {
      menu.style.display = "none"
    })
  
  }

