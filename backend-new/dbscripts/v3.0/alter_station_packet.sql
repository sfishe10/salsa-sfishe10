alter table StationPacket
    rename column packetID to packetId;

alter table StationPacket
    rename column stationID to stationId;

alter table StationPacket
    add column title varchar(40);
