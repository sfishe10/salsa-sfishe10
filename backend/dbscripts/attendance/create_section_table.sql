drop table if exists Section;
create table Section (
                         sectionId int primary key auto_increment,
                         name varchar(50)
);

insert into Section (name) values ("Alto Saxophone"), ("Tenor Saxophone"),
                                  ("Clarinet"), ("Flute");
