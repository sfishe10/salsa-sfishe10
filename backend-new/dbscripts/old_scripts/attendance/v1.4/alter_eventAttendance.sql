alter table EventAttendance
    add column sectionId int;

UPDATE EventAttendance ea
    JOIN Member m ON ea.memberId = m.memberId
    SET ea.sectionId = m.sectionId
WHERE ea.attendanceId > 0;
