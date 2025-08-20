drop procedure if exists CreateEventAndAttendance;

DELIMITER //

CREATE PROCEDURE CreateEventAndAttendance(
    IN eventType VARCHAR(50),
    IN eventTitle VARCHAR(255),
    IN eventDate DATETIME,
    IN eventPepBandId VARCHAR(10),
    IN eventTermId INT
)
BEGIN
	DECLARE eventIdLocal INT;

-- Insert the event
INSERT INTO MBEvent (type, title, date, pepBandId, termId)
VALUES (eventType, eventTitle, eventDate, eventPepBandId, eventTermId);

-- Get the new eventId
SET eventIdLocal = LAST_INSERT_ID();

-- Create new EventAttendance entries
  IF eventType = 'Pep Event' THEN
	INSERT INTO EventAttendance (eventId, memberId, attendance, required)
SELECT eventIdLocal, memberId, NULL, TRUE
FROM Member
WHERE pepBandId = eventPepBandId AND termId = eventTermId;
ELSE
	INSERT INTO EventAttendance (eventId, memberId, attendance, required)
SELECT eventIdLocal, memberId, NULL, TRUE
FROM Member
WHERE termId = eventTermId;
END IF;

  -- Return as a result set
SELECT eventIdLocal AS eventId;
END;
//
DELIMITER ;

