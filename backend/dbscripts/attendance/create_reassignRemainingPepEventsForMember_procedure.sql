DROP PROCEDURE IF EXISTS ReassignRemainingPepEventsForMember;
DELIMITER //
CREATE PROCEDURE ReassignRemainingPepEventsForMember(
    IN termId INT,
    IN memberId INT,
    IN pepBandId VARCHAR(1)
)
BEGIN
  INSERT IGNORE INTO EventAttendance (eventId, memberId, attendance, required)
SELECT
    e.eventId,
    memberId,
    NULL,
    TRUE
FROM MBEvent e
WHERE e.termId = termId AND e.pepBandId = pepBandId;
END;
//
DELIMITER ;
