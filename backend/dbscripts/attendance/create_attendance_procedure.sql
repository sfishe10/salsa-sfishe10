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
  DECLARE newEventId INT;

-- Insert the event
INSERT INTO MBEvent (type, title, date, pepBandId, termId)
VALUES (eventType, eventTitle, eventDate, eventPepBandId, eventTermId);

-- Get the new eventId
SET newEventId = LAST_INSERT_ID();

-- Create new EventAttendance entries
  IF eventType = 'Event' THEN
	INSERT INTO EventAttendance (eventId, memberId, attendance)
SELECT newEventId, memberId, NULL
FROM Member
WHERE pepBandId = eventPepBandId AND termId = eventTermId;
ELSE
	INSERT INTO EventAttendance (eventId, memberId, attendance)
SELECT newEventId, memberId, NULL
FROM Member
WHERE termId = eventTermId;
END IF;
END;
//
DELIMITER ;
