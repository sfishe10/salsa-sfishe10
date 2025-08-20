DROP PROCEDURE IF EXISTS AddAttendancesForNewMembers;
DELIMITER //
CREATE PROCEDURE AddAttendancesForNewMembers(
    IN inTermId INT
)
BEGIN
  INSERT IGNORE INTO EventAttendance (eventId, memberId, attendance, required)
SELECT
    e.eventId,
    m.memberId,
    NULL,
    TRUE
FROM Member m
         JOIN MBEvent e
              ON e.termId = m.termId
                  -- if e.pepBandId IS NULL (i.e. non‑pep events), include all members;
                  -- otherwise only members whose pepBandId matches e.pepBandId
                  AND (
                     e.pepBandId IS NULL
                         OR e.pepBandId = m.pepBandId
                     )
WHERE m.termId = inTermId;
END;
//
DELIMITER ;
