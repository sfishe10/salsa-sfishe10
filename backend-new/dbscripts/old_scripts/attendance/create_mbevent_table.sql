DROP TABLE IF EXISTS MBEvent;

CREATE TABLE MBEvent (
                         eventId INT PRIMARY KEY AUTO_INCREMENT,
                         type VARCHAR(50) NOT NULL,
                         title VARCHAR(50) NOT NULL,
                         date DATETIME NOT NULL,
                         pepBandId VARCHAR(1),
                         termId INT NOT NULL,
                         FOREIGN KEY (termId) REFERENCES Term(termId),
                         FOREIGN KEY (pepBandId) REFERENCES PepBand(bandId)
);
