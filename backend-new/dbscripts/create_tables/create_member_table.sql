drop table if exists Member;

create table Member (
                        memberId int primary key auto_increment,
                        email varchar(255),
                        pepBandId varchar(1),
                        sectionId int,
                        rehearsalConflict varchar(50),
                        termId int not null,
                        foreign key (email) references User(email),
                        foreign key (pepBandId) references PepBand(bandId),
                        foreign key (sectionId) references Section(sectionId),
                        foreign key (termId) references Term(termId),
                        unique (email, termId, sectionId)
);
