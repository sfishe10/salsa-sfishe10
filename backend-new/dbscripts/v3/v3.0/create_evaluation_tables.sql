drop table EvaluationItems;
drop table Evaluation;


CREATE TABLE Evaluation (
                            evalId int primary key AUTO_INCREMENT,
                            memberId int not null,
                            evaluatorId int not null,
                            stationId int not null,
                            passed tinyint(1) DEFAULT NULL,
                            evalTime datetime DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (memberId) REFERENCES Member (memberId) ON DELETE CASCADE,
                            FOREIGN KEY (evaluatorId) REFERENCES Member (memberId) ON DELETE CASCADE,
                            FOREIGN KEY (stationId) REFERENCES Station (stationId) ON DELETE CASCADE
);

create table EvaluationItem (
                                evalId int not null,
                                itemId int not null,
                                status tinyint(1),
                                unique(evalId, itemId),
                                FOREIGN KEY (evalId) REFERENCES Evaluation (evalId) ON DELETE CASCADE,
                                FOREIGN KEY (itemId) REFERENCES StationItem (itemId) ON DELETE CASCADE
);
