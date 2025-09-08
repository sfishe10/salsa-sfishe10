import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from '../styles/modules/StationOverview.module.scss';

const ProgressOverview = ({ stations, users }) => (
  <>
    <StationHead stations={stations} />
    <StationProgress users={users} stations={stations} />
  </>
);

const StationHead = ({ stations }) => (
  <>
    <Row className={styles.stationHeaders}>
      <Col xs={2} />
      <Col className={`${styles.headerColor} ${styles.cellpad}`}>Progress</Col>
    </Row>
    <Row className={styles.stationHeaders}>
      <Col xs={3} />
      <StationBoxes level="0" stationData={stations} />
      <StationBoxes level="1" stationData={stations} />
    </Row>
  </>
);

const StationProgress = ({ users }) => {
  const stationIds = [4, 5, 6, 7, 8, 9];
  const userIdSet = new Set(users.map((user) => user.userID));
  const totalUsers = userIdSet.size;
  const stationInfo = stationIds.map((station) => (
    <div key={station}>
      <Row className={styles.sectionHead}>
        <Col className={styles.headerColor} xs={2}>{''.concat(station - 3)}</Col>
        <StationData
          filteredUsers={users.filter((attempt) => attempt.sID === station)}
          totalUsers={totalUsers}
        />
      </Row>
    </div>
  ));

  return <>{stationInfo}</>;
};

const StationData = ({ filteredUsers, totalUsers }) => {
  const numPassing = filteredUsers.filter((attempt) => attempt.passed === 1).length;
  const passPercent = numPassing / totalUsers;
  const failPercent = 1 - passPercent;
  console.log(filteredUsers);
  const completionInfo = (
    <>
      <Col xs={3}>{''.concat(numPassing, '/', totalUsers)}</Col>
      <Col className={styles['progress-bar-container']}>
        <div
          className={styles['progress-bar-pass']}
          style={{ width: `${passPercent * 100}%` }}
        />
        <div
          className={styles['progress-bar-fail']}
          style={{ width: `${failPercent * 100}%` }}
        />
      </Col>
    </>
  );

  return <>{completionInfo}</>;
};

/* const SectionProgress = ({ users }) => {
  console.log(users);
  return <>Test</>;
}; */

const StationBoxes = ({ level, stationData }) => {
  const stations = stationData.filter((station) => station.class === level);
  const stationTag = stations.map((station) => (
    <Col title={station.title} className={styles.stationColor}>
      {station.level + 1}
    </Col>
  ));

  return <>{stationTag}</>;
};

export default ProgressOverview;
