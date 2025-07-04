import React, { useEffect, useState } from 'react';
import ProgressOverview from '../components/ProgressOverview';
import { getStations } from '../lib/stations';
import getAttempts from '../lib/evals';

const Progress = () => {
  const [stations, setStations] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    getStations().then((s) => setStations(s));
    getAttempts().then((a) => setAttempts(a));
  }, []);

  return stations && (
    <>
      <h1>Station Progress Overview</h1>
      <ProgressOverview stations={stations} users={attempts} />
    </>
  );
};

export default Progress;
