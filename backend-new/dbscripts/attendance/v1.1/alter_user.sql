alter table User
    modify column role enum ('Admin', 'Officer', 'Section Leader', 'Attendance Taker', 'Member') not null default 'Member';