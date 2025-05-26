class Utilities {
  static convertDateToPST(date) {
    const utc = new Date(`${date} UTC`);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formatter.format(utc);
  }
}

module.exports = Utilities;
