import React, { useState, useEffect } from 'react';

type Teacher = {
  id: string;
  name: string;
  photo: string;
  branch: string;
};

type AttendanceRecord = {
  date: string;
  punchIn: string;
  punchOut: string;
};

const dummyTeachers: Teacher[] = [
  {
    id: 'T001',
    name: 'Rohan Sharma',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    branch: 'Science',
  },
  {
    id: 'T002',
    name: 'Priya Verma',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    branch: 'Arts',
  },
  {
    id: 'T003',
    name: 'Arjun Singh',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    branch: 'Commerce',
  },
];

const dummyAttendance: Record<string, AttendanceRecord[]> = {
  T001: [
    { date: '2025-04-01', punchIn: '09:00 AM', punchOut: '05:00 PM' },
    { date: '2025-04-02', punchIn: '09:10 AM', punchOut: '05:15 PM' },
  ],
  T002: [
    { date: '2025-04-01', punchIn: '09:05 AM', punchOut: '05:00 PM' },
    { date: '2025-04-02', punchIn: '09:00 AM', punchOut: '05:10 PM' },
  ],
  T003: [
    { date: '2025-04-01', punchIn: '08:50 AM', punchOut: '04:55 PM' },
    { date: '2025-04-02', punchIn: '09:00 AM', punchOut: '05:05 PM' },
  ],
};

const PunchInPage: React.FC = () => {
  const fixedTeacherId = 'T001'; // Change this to T002 or T003 as needed
  const selectedTeacher = dummyTeachers.find((t) => t.id === fixedTeacherId)!;

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceRecord[]>(
    dummyAttendance[fixedTeacherId] || []
  );
  const [punchInTime, setPunchInTime] = useState('');
  const [punchOutTime, setPunchOutTime] = useState('');

  const handlePunchIn = () => {
    const time = new Date().toLocaleTimeString();
    setPunchInTime(time);
    setAttendanceStatus((prev) => [
      ...prev,
      { date: new Date().toLocaleDateString(), punchIn: time, punchOut: '' },
    ]);
  };

  const handlePunchOut = () => {
    if (punchInTime) {
      const time = new Date().toLocaleTimeString();
      setPunchOutTime(time);
      const updated = [...attendanceStatus];
      updated[updated.length - 1].punchOut = time;
      setAttendanceStatus(updated);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Teacher Punch In Page
      </h2>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
        <div className="flex items-center gap-6 md:w-2/3">
          <img
            src={selectedTeacher.photo}
            alt={selectedTeacher.name}
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedTeacher.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">ID: {selectedTeacher.id}</p>
            <p className="text-gray-600 dark:text-gray-300">Branch: {selectedTeacher.branch}</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2 md:w-1/3">
          <div className="flex gap-4">
            <button
              onClick={handlePunchIn}
              className="w-32 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              Punch In
            </button>
            <button
              onClick={handlePunchOut}
              className="w-32 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              Punch Out
            </button>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 text-center md:text-left">
            {punchInTime && <p>Punched In at: {punchInTime}</p>}
            {punchOutTime && <p>Punched Out at: {punchOutTime}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
          Attendance Records
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Punch In</th>
                <th className="p-2 border">Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {attendanceStatus.map((record, index) => (
                <tr
                  key={index}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="p-2 border dark:border-gray-600">{record.date}</td>
                  <td className="p-2 border dark:border-gray-600">{record.punchIn}</td>
                  <td className="p-2 border dark:border-gray-600">{record.punchOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PunchInPage;
