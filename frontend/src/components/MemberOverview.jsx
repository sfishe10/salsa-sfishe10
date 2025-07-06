import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from '../styles/modules/MemberOverview.module.scss';

const MemberOverview = ({ stations, users }) => (
  <>
    <StationHead stations={stations} />
    <MemberAttempts users={users} />
  </>
);

const StationHead = ({ stations }) => (
  <>
    <Row className={styles.stationHeaders}>
      <Col xs={3} />
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>1</Col>
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>2</Col>
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>3</Col>
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>4</Col>
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>5</Col>
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>6</Col>
    </Row>
    <Row className={styles.stationHeaders}>
      <Col xs={3} />
      <StationBoxes level="0" stationData={stations} />
      <StationBoxes level="1" stationData={stations} />
    </Row>
  </>
);

const StationBoxes = ({ level, stationData }) => {
  const stations = stationData.filter((station) => station.class === level);
  const stationTag = stations.map((station) => (
    <Col title={station.title} className={styles.stationColor}>
      {station.level + 1}
    </Col>
  ));

  return <>{stationTag}</>;
};

const MemberAttempts = ({ users }) => {
  const sectionSorted = {};

  users.forEach((user) => {
    const { section } = user;
    const member = user.name;

    if (sectionSorted[section] === undefined) sectionSorted[section] = {};
    if (sectionSorted[section][member] === undefined) sectionSorted[section][member] = [];

    sectionSorted[section][member].push(user);
  });

  const sectionInfo = Object.keys(sectionSorted).map((section) => (
    <div key={section}>
      <Row className={styles.sectionHead}>
        <Col className={styles.headerColor} xs={3}>{section}</Col>
      </Row>
      <Members members={sectionSorted[section]} />
    </div>
  ));

  return <>{sectionInfo}</>;
};

const Members = ({ members }) => {
  const tempMembers = Object.keys(members).map((name) => (
    <Row key={name}>
      <Col xs={3} className={styles.nameColor}>{name}</Col>
      <Attempts attempts={members[name]} />
    </Row>
  ));

  return <>{tempMembers}</>;
};

const Attempts = ({ attempts }) => {
  const stationIds = Array.from(new Set(attempts.map((a) => a.sID)));

  const stations = stationIds.map((stationId) => {
    let statusClass = `${styles.attempt} ${styles.cellpad} `;
    let mark = null;

    const attemptList = attempts.filter((a) => a.sID === stationId);
    const baseAttempt = attemptList[0];

    if (baseAttempt.passed === 1) {
      statusClass += styles.completed;
      mark = '\u2713';
    } else if (baseAttempt.attempts > 0) {
      statusClass += styles.attempted;
      mark = '\u2573'.repeat(baseAttempt.attempts);
    } else {
      statusClass += styles.no_attempts;
      mark = '\u20E0';
    }

    const moreInfo = attemptList
      .map((a, i) => `Attempt ${i + 1}:\n  Evaluated by: ${a.evaluator}\n  Evaluated at: ${a.evalTime}`)
      .join('\n\n');

    return (
      <Col className={statusClass} title={moreInfo} key={`${baseAttempt.name}, sID ${baseAttempt.sID}`}>
        {mark}
      </Col>
    );
  });

  return <>{stations}</>;
};

export default MemberOverview;
