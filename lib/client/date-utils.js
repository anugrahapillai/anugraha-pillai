// Helper to format ISO date strings into DD-MM-YYYY hh:mm am/pm format
export function formatDate(dateString) {
  if (!dateString || dateString === "—" || dateString === "Just now") return dateString || "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
}
