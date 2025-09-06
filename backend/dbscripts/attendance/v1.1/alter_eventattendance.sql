alter table EventAttendance
    add lastUpdated datetime;

DELIMITER //

CREATE TRIGGER set_lastUpdated
    BEFORE UPDATE ON EventAttendance
    FOR EACH ROW
BEGIN
    IF (NEW.attendance <> OLD.attendance)
       OR (NEW.memberId <> OLD.memberId)
       OR (NEW.subId <> OLD.subId) THEN
        SET NEW.lastUpdated = NOW();
END IF;
END //

DELIMITER ;