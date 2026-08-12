alter table Evaluation
drop foreign key evaluation_ibfk_2;

delete from Evaluation where evalId > 0;

alter table Evaluation
    add constraint evaluation_ibfk_2
        foreign key (evaluatorId)
            references User(userId)
            on delete cascade
            on update cascade;
