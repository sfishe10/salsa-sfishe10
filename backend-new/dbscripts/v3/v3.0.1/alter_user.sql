ALTER TABLE User
    MODIFY COLUMN role
    ENUM(
    'Admin',
    'Officer',
    'Section Leader',
    'Attendance Taker',
    'Member',
    'Leadership'
    )
    NOT NULL DEFAULT 'Member';
