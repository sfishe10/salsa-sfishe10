drop table if exists VolunteerRosterMemberCount;

create table VolunteerRosterMemberCount (
                                            eventId int,
                                            sectionId int,
                                            numMembersNeeded int,
                                            primary key (eventId, sectionId),
                                            foreign key (eventId) references MBEvent(eventId),
                                            foreign key (sectionId) references Section(sectionId)
);
