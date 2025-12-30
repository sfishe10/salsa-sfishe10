ALTER TABLE EventAttendance
    ADD CONSTRAINT FK_attendance_section_sectionId
    FOREIGN KEY (sectionId)
    REFERENCES Section(sectionId);