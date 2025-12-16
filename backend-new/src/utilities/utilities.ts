export class Utilities {
  static convertDateToPST(date: string | Date): string {
    const utcDate =
        typeof date === 'string'
            ? new Date(`${date} UTC`)
            : date;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formatter.format(utcDate);
  }
}
