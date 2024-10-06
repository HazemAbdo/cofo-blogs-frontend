export function distanceToNow(date: string): string {
  const inputDate = new Date(date);
  const currentDate = new Date();
  const timeDifference = Math.abs(inputDate.valueOf() - currentDate.valueOf());

  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );
  const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);
  let result = "";
  if (daysDifference > 0) {
    result = `${daysDifference} days ago`;
  } else if (hoursDifference > 0) {
    result = `${hoursDifference} hours ago`;
  } else if (minutesDifference > 0) {
    result = `${minutesDifference} minutes ago`;
  } else {
    result = `${secondsDifference} seconds ago`;
  }

  return result;
}

export function formatDate(dateString: string) {
  if (!dateString) return ""; // Handle empty input
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
