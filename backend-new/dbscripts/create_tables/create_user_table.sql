drop table if exists User;

create table User(
                     userId int primary key auto_increment,
                     email varchar(255) unique,
                     firstName varchar(255) not null,
                     lastName varchar(255) not null,
                     role enum ('Admin', 'Officer', 'Section Leader', 'Attendance Taker', 'Member') not null default 'Member'
);
