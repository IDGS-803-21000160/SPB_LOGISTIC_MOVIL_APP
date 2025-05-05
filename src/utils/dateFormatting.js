function getFormattedDateMexico() {
  const options = {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("en-CA", options);
  const date = new Date();
  return formatter.format(date);
}

function formatDateToSpanishLong(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1); // Adjust for timezone offset
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-MX", options);
}

export { getFormattedDateMexico, formatDateToSpanishLong };
