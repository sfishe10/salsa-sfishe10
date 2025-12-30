ALTER TABLE VolunteerRosterMemberCount
    ADD CONSTRAINT
        FOREIGN KEY (eventId)
            REFERENCES MBEvent(eventId);

ALTER TABLE VolunteerRosterMemberCount
    ADD CONSTRAINT
        FOREIGN KEY (sectionId)
            REFERENCES Section(sectionId);
