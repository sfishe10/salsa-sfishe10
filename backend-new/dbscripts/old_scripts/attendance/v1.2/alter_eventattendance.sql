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
