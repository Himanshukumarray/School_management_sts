import React, { useState } from "react";

type Student = {
  id: string;
  name: string;
  className: string;
  photo: string;
};

// Sample dummy student data
const studentDatabase: Student[] = [
  {
    id: "S101",
    name: "John Doe",
    className: "10th Grade - A",
    photo: "https://via.placeholder.com/100",
  },
  {
    id: "S102",
    name: "Alice Smith",
    className: "9th Grade - B",
    photo: "https://via.placeholder.com/100",
  },
];

const StudentLeaveRequestForm: React.FC = () => {
  const [inputNameOrId, setInputNameOrId] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveType, setLeaveType] = useState("full");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = () => {
    const found = studentDatabase.find(
      (s) =>
        s.name.toLowerCase().includes(inputNameOrId.toLowerCase()) ||
        s.id.toLowerCase() === inputNameOrId.toLowerCase()
    );
    setStudent(found || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student || !leaveDate || !reason) {
      alert("Please fill all required fields.");
      return;
    }

    // Simulate submission logic here
    console.log("Leave Request Submitted:", {
      student,
      leaveDate,
      leaveType,
      reason,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Student Leave Request
      </h2>

      {/* Search Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter ID or Name"
          value={inputNameOrId}
          onChange={(e) => setInputNameOrId(e.target.value)}
          className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Search
        </button>
      </div>

      {/* Profile Display */}
      {student && (
        <div className="flex gap-4 items-start mb-6">
          <img
            src={student.photo}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {student.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">ID: {student.id}</p>
            <p className="text-gray-600 dark:text-gray-300">
              Class: {student.className}
            </p>
          </div>
        </div>
      )}

      {/* Leave Form */}
      {student && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
              Leave Date
            </label>
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
              Reason for Leave
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="full">Full Day</option>
              <option value="half">Half Day</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Submit Leave Request
          </button>

          {submitted && (
            <p className="text-green-600 mt-2 font-medium">
              Leave request submitted successfully!
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default StudentLeaveRequestForm;
