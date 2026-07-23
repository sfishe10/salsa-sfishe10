import {Station} from './station';

export interface StationPacket {
  packetId: number,
  station: Station,
  title: string,
  role: string,
  info: string,
  content: string,
  level: number
}
