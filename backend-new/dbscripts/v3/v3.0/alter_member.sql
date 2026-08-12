ALTER TABLE EventAttendance
DROP FOREIGN KEY eventattendance_ibfk_1,
  DROP FOREIGN KEY eventattendance_ibfk_2,
  DROP FOREIGN KEY eventattendance_ibfk_3;


ALTER TABLE EventAttendance
    ADD CONSTRAINT eventattendance_ibfk_1
        FOREIGN KEY (eventId)
            REFERENCES MBEvent(eventId)
            ON DELETE CASCADE,

  ADD CONSTRAINT eventattendance_ibfk_2
    FOREIGN KEY (memberId)
    REFERENCES Member(memberId)
    ON DELETE CASCADE,

  ADD CONSTRAINT eventattendance_ibfk_3
    FOREIGN KEY (subId)
    REFERENCES Member(memberId)
    ON DELETE SET NULL;
