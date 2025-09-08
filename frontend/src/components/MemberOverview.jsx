import React, { useState } from 'react';
import {
  Row, Col, Modal, Button,
} from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleShow = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

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
      mark = '\u2573';
    } else {
      statusClass += styles.no_attempts;
      mark = '\u20E0';
    }

    const moreInfo = attemptList
      .map((a, i) => {
        let formattedTime = a.evalTime;

        if (a.evalTime) {
          const date = new Date(a.evalTime);
          const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles',
          });

          formattedTime = formatter.format(date);
        }

        const label = a.passed === 1 ? 'Passed' : `Attempt ${i + 1}`;

        return `${label}:\n  Evaluated by: ${a.evaluator}\n  Evaluated at: ${formattedTime}`;
      })
      .join('\n\n');

    const title = `${baseAttempt.name} - Station ${baseAttempt.sID - 3}`;
    return (
      <Col
        className={statusClass}
        key={`${baseAttempt.name}, sID ${baseAttempt.sID}`}
        onClick={() => handleShow(title, moreInfo)}
        style={{ cursor: 'pointer' }}
      >
        {mark}
      </Col>
    );
  });

  return (
    <>
      {stations}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{modalContent}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberOverview;
