document.addEventListener('DOMContentLoaded', function () {
    menu = document.getElementById("menu")
    menu_btn = document.getElementById("menu_btn")
    menu_close = document.getElementById("menu_close")
  
    menu_btn.addEventListener("click", () => {
      menu.style.display = "flex"
    })
  
    menu_close.addEventListener("click", () => {
      menu.style.display = "none"
    })
  });


