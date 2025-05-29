drop table if exists Member;

create table Member (
                        memberId int primary key auto_increment,
                        pepBandId varchar(1) not null,
                        firstName varchar(50) not null,
                        lastName varchar(50) not null,
                        sectionId int not null,
                        rehearsalConflict varchar(50),
                        termId int not null,
                        email varchar(255) not null,
                        role enum ('admin', 'officer', 'member', 'guest') not null default 'member',
                        foreign key (pepBandId) references PepBand(bandId),
                        foreign key (sectionId) references Section(sectionId),
                        foreign key (termId) references Term(termId)
);