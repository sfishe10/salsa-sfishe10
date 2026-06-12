alter table Station
    rename column sID to stationId;

alter table StationGroup
    rename column groupID to groupId;

alter table StationGroup
    rename column stationID to stationID;

alter table StationItem
    rename column itemID to itemId;

alter table StationItem
    rename column groupID to groupId;