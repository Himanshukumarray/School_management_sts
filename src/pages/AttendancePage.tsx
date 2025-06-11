import React, { useState } from "react";

interface Student {
  id: number;
  name: string;
}

type AttendanceRecord = {
  [studentId: number]: {
    [day: number]: boolean;
  };
};

const classes = ["Class 1", "Class 2", "Class 3"];
const periods = ["1st Period", "2nd Period", "3rd Period"];

const students: Student[] = [
  { id: 1, name: "Alice Sharma" },
  { id: 2, name: "Bharat Singh" },
  { id: 3, name: "Charu Mehta" },
];

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

const AttendancePage: React.FC = () => {
  const today = new Date();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  const [year, month] = selectedDate.split("-").map(Number);
  const daysInMonth = getDaysInMonth(year, month);

  const handleAttendanceChange = (studentId: number, day: number) => {
    setAttendance((prev) => {
      const studentAttendance = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...studentAttendance,
          [day]: !studentAttendance[day],
        },
      };
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="">Select Period</option>
          {periods.map((per) => (
            <option key={per} value={per}>
              {per}
            </option>
          ))}
        </select>

        <input
          type="month"
          className="border p-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Student Name</th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i + 1} className="border px-2 py-2 text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2 font-medium">
                  {student.name}
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const isPresent = attendance[student.id]?.[day] === true;
                  return (
                    <td
                      key={day}
                      className={`border text-center cursor-pointer ${
                        isPresent ? "bg-green-200" : "bg-red-200"
                      }`}
                      onClick={() => handleAttendanceChange(student.id, day)}
                    >
                      {isPresent ? "✓" : "✗"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
