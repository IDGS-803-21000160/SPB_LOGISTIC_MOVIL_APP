export const getInitials = (nombre) => {
  if (!nombre) return "";
  const parts = nombre.split(" ");
  if (parts.length >= 2) {
    // Toma las primeras 2 letras del primer elemento y del último
    return (
      parts[0].slice(0, 1).toUpperCase() +
      parts[parts.length - 1].slice(0, 1).toUpperCase()
    );
  } else {
    return nombre.slice(0, 2).toUpperCase();
  }
};

export const capitalizeEachWord = (nombre) => {
  if (!nombre) return "";
  return nombre
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getCiudadFromCR = (cr) => {
  if (!cr || typeof cr !== "string") return "Ciudad desconocida";

  const prefix = cr.substring(0, 2).toUpperCase();

  switch (prefix) {
    case "LN":
    case "LEN":
      return "León";
    case "GD":
    case "GDL":
      return "Guadalajara";
    case "MT":
    case "MTY":
      return "Monterrey";
    case "QRO":
      return "Querétaro";
    case "TLC":
      return "Metepec";
    default:
      return "Desconocida";
  }
};

export const extractNumRuta = (ruta) => {
  const numRuta = ruta.split("-");
  return numRuta[2];
};

export const getRutaStatusText = (status) => {
  switch (status) {
    case 1:
      return "Programada";
    case 2:
      return "Iniciada";
    case 4:
      return "Finalizada";
    default:
      return "";
  }
};

export const colorForStatus = (status) => {
  switch (status) {
    case 1:
      return "blue"; // Amarillo para Programada
    case 2:
      return "orange"; // Verde para Iniciada
    case 4:
      return "green"; // Rojo para Finalizada
    default:
      return "red"; // Gris para estado desconocido
  }
};
