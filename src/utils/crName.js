function getCityName(code = "") {
  // code siempre es string, aunque recibas undefined
  if (code.includes("LEN")) {
    return "León";
  } else if (code.includes("MTY")) {
    return "Monterrey";
  } else if (code.includes("GDL")) {
    return "Guadalajara";
  } else if (code.includes("QRO")) {
    return "Querétaro";
  } else if (code.includes("TLC")) {
    return "Metepec";
  } else {
    return "Desconocido";
  }
}

module.exports = getCityName;
