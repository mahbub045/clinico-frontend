export function formatDateAndTime(isoDate: string | null | undefined): string {
  if (isoDate == null) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
}

export function formatDate(isoDate: string | null | undefined): string {
  if (isoDate == null) return "";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const formatChoiceFieldValue = (
  choiceFieldValue?: string | null,
): string => {
  if (!choiceFieldValue) return "";
  return choiceFieldValue
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function getCurrencySign(): string {
  return "$";
}
