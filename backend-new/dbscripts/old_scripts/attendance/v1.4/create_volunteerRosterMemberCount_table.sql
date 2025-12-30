drop table if exists VolunteerRosterMemberCount;

create table VolunteerRosterMemberCount (
                                            eventId int,
                                            sectionId int,
                                            numMembersNeeded int,
                                            primary key (eventId, sectionId)
);
