alter table Member
drop foreign key member_ibfk_1;

ALTER TABLE Member
    ADD CONSTRAINT FK_member_user_email
        FOREIGN KEY (email)
            REFERENCES User(email)
            ON UPDATE CASCADE
            ON DELETE RESTRICT;