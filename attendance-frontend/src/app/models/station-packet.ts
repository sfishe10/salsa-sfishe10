import {Station} from './station';

export interface StationPacket {
  packetId: number,
  station: Station,
  title: string,
  role: string,
  info: string,
  content: string,
  level: number

  // only frontend - determines whether to display the editable text box
  editing: boolean;
}
