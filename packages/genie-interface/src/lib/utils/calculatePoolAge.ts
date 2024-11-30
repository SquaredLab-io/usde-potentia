export function calculatePoolAge(dateString: string) {
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  const years = currentDate.getFullYear() - givenDate.getFullYear();
  const months = currentDate.getMonth() - givenDate.getMonth();
  const days = currentDate.getDate() - givenDate.getDate();

  // Adjust the values for proper formatting
  let totalMonths = years * 12 + months;
  let totalDays = days;

  if (totalDays < 0) {
    totalMonths--;
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    totalDays += previousMonth.getDate();
  }

  // Format the output string
  let ageString = "";
  if (totalMonths > 0) {
    ageString += `${totalMonths}M `;
  }
  ageString += `${totalDays}d`;

  return ageString.trim();
}
