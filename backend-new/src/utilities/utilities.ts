import csv from 'csv-parser';
import stream from 'stream';

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

  static async parseCsv(file: any): Promise<Array<Record<string, string>>> {
    return new Promise((resolve, reject) => {
      const rows: Array<Record<string, string>> = [];

      const rawCsvString = file.buffer.toString('utf8').replace(/^\uFEFF/, '');
      const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

      const bufferStream = new stream.PassThrough();
      bufferStream.end(cleanedBuffer);

      bufferStream
          .pipe(csv())
          .on('data', (row) => {
            rows.push(
                Object.fromEntries(
                    Object.entries(row).map(([key, value]) => [
                      key.trim(),
                      value == null ? '' : String(value).trim(),
                    ])
                )
            );
          })
          .on('end', () => resolve(rows))
          .on('error', reject);
    });
  }
}
