function ubicacionHoy(tipo){
  const hoy = new Date().getDay();
  let lugar = "";

  if(tipo === "movil"){
    switch(hoy){
      case 1: lugar = "Popayán"; break;
      case 2: lugar = "Santander de Quilichao"; break;
      case 3: lugar = "Puerto Tejada"; break;
      default: lugar = "Cauca";
    }
  }

  if(tipo === "van1"){
    switch(hoy){
      case 1: lugar = "Santander de Quilichao"; break;
      case 2: lugar = "Popayán"; break;
      case 3: lugar = "Puerto Tejada"; break;
      default: lugar = "Cauca";
    }
  }
  if(tipo === "van2"){
    switch(hoy){
      case 1: lugar = "Puerto Tejada"; break;
      case 2: lugar = "Popayán"; break;
      case 3: lugar = "Santander de Quilichao"; break;
      default: lugar = "Cauca";
    }
  }

  window.open(`https://www.google.com/maps?q=${lugar}`);
}