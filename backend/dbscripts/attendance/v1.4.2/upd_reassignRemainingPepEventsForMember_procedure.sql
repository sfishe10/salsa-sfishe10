DROP PROCEDURE IF EXISTS ReassignRemainingPepEventsForMember;
DELIMITER //
CREATE PROCEDURE ReassignRemainingPepEventsForMember(
    IN termId INT,
    IN memberId INT,
    IN pepBandId VARCHAR(1),
    IN sectionId INT
)
BEGIN
  INSERT IGNORE INTO EventAttendance (eventId, memberId, attendance, required, sectionId)
SELECT
    e.eventId,
    memberId,
    NULL,
    TRUE,
    sectionId
FROM MBEvent e
WHERE e.termId = termId AND e.pepBandId = pepBandId;
END;
//
DELIMITER ;