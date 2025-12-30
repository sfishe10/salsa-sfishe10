drop table if exists EventAttendance;

create table EventAttendance (
                                 attendanceId INT PRIMARY KEY AUTO_INCREMENT,
                                 eventId int not null,
                                 memberId int,
                                 attendance varchar(50),
                                 subId int,
                                 required boolean not null,
                                 lastUpdated datetime,
                                 sectionId int,
                                 foreign key (eventId) references MBEvent(eventId),
                                 foreign key (memberId) references Member(memberId),
                                 foreign key (subId) references Member(memberId),
                                 foreign key (sectionId) references Section(sectionId),
                                 UNIQUE (memberId, eventId)
);


DROP TRIGGER IF EXISTS set_lastUpdated;
DELIMITER //

CREATE TRIGGER set_lastUpdated
    BEFORE UPDATE ON EventAttendance
    FOR EACH ROW
BEGIN
    IF (NEW.attendance <> OLD.attendance
        OR (NEW.attendance IS NULL AND OLD.attendance IS NOT NULL)
        OR (NEW.attendance IS NOT NULL AND OLD.attendance IS NULL))

       OR (NEW.memberId <> OLD.memberId
        OR (NEW.memberId IS NULL AND OLD.memberId IS NOT NULL)
        OR (NEW.memberId IS NOT NULL AND OLD.memberId IS NULL))

       OR (NEW.subId <> OLD.subId
        OR (NEW.subId IS NULL AND OLD.subId IS NOT NULL)
        OR (NEW.subId IS NOT NULL AND OLD.subId IS NULL)) THEN

        SET NEW.lastUpdated = NOW();
END IF;
END //

DELIMITER ;
