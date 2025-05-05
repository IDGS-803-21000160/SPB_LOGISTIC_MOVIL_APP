function getCityName(code) {
  if (code.includes("LEN")) {
    return "León";
  } else if (code.includes("MTY")) {
    return "Monterrey";
  } else {
    return "Falta declarar";
  }
}

module.exports = getCityName;
