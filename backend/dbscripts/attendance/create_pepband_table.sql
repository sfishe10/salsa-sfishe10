drop table if exists PepBand;
create table PepBand (
                         bandId varchar(1) primary key,
                         displayName varchar(50) not null
);

insert into PepBand (bandId, displayName) values ('A', 'A Band');
insert into PepBand (bandId, displayName) values ('B', 'B Band');
insert into PepBand (bandId, displayName) values ('C', 'C Band');
insert into PepBand (bandId, displayName) values ('V', 'Volunteer');
