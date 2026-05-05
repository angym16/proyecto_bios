
  // Menú desplegable ¿Quiénes somos?
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', function() {
      dropdownMenu.classList.toggle('active');
    });
    
    // Cerrar el menú cuando haces clic fuera
    document.addEventListener('click', function(event) {
      if (!dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('active');
      }
    });
  }
