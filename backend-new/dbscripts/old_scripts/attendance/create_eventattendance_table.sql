drop table if exists EventAttendance;

create table EventAttendance (
                                 attendanceId INT PRIMARY KEY AUTO_INCREMENT,
                                 eventId int not null,
                                 memberId int,
                                 attendance varchar(50),
                                 subId int,
                                 required boolean not null,
                                 foreign key (eventId) references MBEvent(eventId),
                                 foreign key (memberId) references Member(memberId),
                                 foreign key (subId) references Member(memberId),
                                 UNIQUE (memberId, eventId)
);
