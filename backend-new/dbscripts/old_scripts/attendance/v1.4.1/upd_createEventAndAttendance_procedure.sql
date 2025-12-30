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
INSERT INTO MBEvent (type, title, date, pepBandId, termId, extraAttendeesAllowed)
VALUES (eventType, eventTitle, eventDate, eventPepBandId, eventTermId, true);

-- Get the new eventId
SET eventIdLocal = LAST_INSERT_ID();

-- Create new EventAttendance entries
	IF eventType = 'Pep Event' THEN
    -- For volunteer events, create blank values so the user can enter required numbers for each section
		IF eventPepBandId = 'V' THEN
			INSERT INTO VolunteerRosterMemberCount (eventId, sectionId, numMembersNeeded)
SELECT
    eventIdLocal, sectionId, NULL
FROM Section;
ELSE
			INSERT INTO EventAttendance (eventId, memberId, attendance, required, sectionId)
SELECT eventIdLocal, memberId, NULL, TRUE, sectionId
FROM Member
WHERE pepBandId = eventPepBandId AND termId = eventTermId;
END IF;

ELSE
		INSERT INTO EventAttendance (eventId, memberId, attendance, required, sectionId)
SELECT eventIdLocal, memberId, NULL, TRUE, sectionId
FROM Member
WHERE termId = eventTermId;
END IF;

  -- Return as a result set
SELECT eventIdLocal AS eventId;
END;
//
DELIMITER ;