import './App.css';

import React, { useEffect, useRef, useState } from 'react';

import { Line } from 'react-chartjs-2';
import axios from 'axios';

const totalStudents = 50;
const totalCost = 2000;

function App() {
  const [sponsorContributions, setSponsorContributions] = useState(0);
  const [students, setStudents] = useState(Array(totalStudents).fill({ paid: 0 }));
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/correct-url');
      setStudents(data.students);
      setSponsors(data.sponsors);
      setSponsorContributions(data.sponsors.reduce((total, sponsor) => total + sponsor.contribution, 0));
    };
    fetchData();
  }, []);

  const handleStudentPayment = async (studentIndex, payment) => {
    const newStudents = [...students];
    newStudents[studentIndex].paid += payment;
    setStudents(newStudents);
    await axios.post('/data', { students: newStudents, sponsors });
  };

  const handleSponsorPayment = async (sponsorName, payment) => {
    setSponsorContributions(sponsorContributions + payment);
    const newSponsors = [...sponsors, { name: sponsorName, contribution: payment }];
    setSponsors(newSponsors);
    await axios.post('/data', { students, sponsors: newSponsors });
  };

  const studentPayment = (totalCost - sponsorContributions) / totalStudents;

  return (
    <div className="App">
      <StudentPayment amount={studentPayment} onPayment={handleStudentPayment} />
      <SponsorPayment onPayment={handleSponsorPayment} />
      <StudentList students={students} />
      <SponsorList sponsors={sponsors} />
      <PaymentProgress sponsors={sponsors} />
    </div>
  );
}

function StudentPayment({ amount, onPayment }) {
  const [studentIndex, setStudentIndex] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onPayment(parseInt(studentIndex), parseFloat(amountPaid));
    setStudentIndex('');
    setAmountPaid('');
  };

  return (
    <form className="StudentPayment" onSubmit={handleSubmit}>
      <label>
        Student Number:
        <input type="number" value={studentIndex} onChange={(e) => setStudentIndex(e.target.value)} />
      </label>
      <label>
        Amount Paid:
        <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

function SponsorPayment({ onPayment }) {
  const [sponsorName, setSponsorName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onPayment(sponsorName, parseFloat(amount));
    setSponsorName('');
    setAmount('');
  };

  return (
    <form className="SponsorPayment" onSubmit={handleSubmit}>
      <label>
        Sponsor Name:
        <input type="text" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} />
      </label>
      <label>
        Contribution:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

function StudentList({ students }) {
  return (
    <div className="StudentList">
      <h2>Students:</h2>
      <ul>
        {students.map((student, index) => (
          <li key={index}>Student {index + 1}: ${student.paid.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}

function SponsorList({ sponsors }) {
  return (
    <div className="SponsorList">
      <h2>Sponsors:</h2>
      <ul>
        {sponsors.map((sponsor, index) => (
          <li key={index}>{sponsor.name}: ${sponsor.contribution.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}

function PaymentProgress({ sponsors }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy the existing chart before rendering a new one
      chartRef.current.destroy();
    }
  }, [sponsors]);

  const data = {
    labels: sponsors.map((_, index) => `Sponsor ${index + 1}`),
    datasets: [
      {
        label: 'Sponsor Contributions',
        data: sponsors.map((sponsor) => sponsor.contribution),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      x: [{ type: 'linear' }],
    },
  };

  return (
    <div className="PaymentProgress">
      <h2>Payment Progress:</h2>
      <Line data={data} options={options} ref={chartRef} />
    </div>
  );
}

export default App;
