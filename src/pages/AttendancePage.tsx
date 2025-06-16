import React, { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
}

type AttendanceRecord = {
  [studentId: number]: {
    [day: number]: boolean;
  };
};

// ────────────────────────────────────────────────────────────
// Demo batch list – swap for an API call if you prefer
const batches = [1, 2, 3, 4, 5, 6, 7];
// ────────────────────────────────────────────────────────────

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

const AttendancePage: React.FC = () => {
  const today = new Date();

  /* ──────────────── UI state ──────────────── */
  const [selectedBatch, setSelectedBatch] = useState<number | "">("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    () =>
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  /* ──────────────── Data state ──────────────── */
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* ──────────────── Fetch students when batch changes ──────────────── */
  useEffect(() => {
    if (selectedBatch === "") {
      setStudents([]);
      return;
    }

    const controller = new AbortController();
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:8080/api/students/batch?batch=${selectedBatch}`,
          { 
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
              tenant: sessionStorage.getItem("tenant") ?? "",
            },
           }
        );
        if (!res.ok) throw new Error(`Server responded ${res.status}`);

        const data: Student[] = await res.json();
        setStudents(data);
        setAttendance({}); // reset attendance for fresh list
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          (err as Error).message ?? "Something went wrong fetching students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    return () => controller.abort();
  }, [selectedBatch]);

  /* ──────────────── Date helpers ──────────────── */
  const [year, month] = selectedDate.split("-").map(Number);
  const daysInMonth = getDaysInMonth(year, month);

  /* ──────────────── Attendance toggle ──────────────── */
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

      {/* ───── Filters ───── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedBatch}
          onChange={(e) =>
            setSelectedBatch(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Select Batch</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              Batch {batch}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="">Select Period</option>
          <option value="1st">1st Period</option>
          <option value="2nd">2nd Period</option>
          <option value="3rd">3rd Period</option>
        </select>

        <input
          type="month"
          className="border p-2 rounded"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* ───── Content ───── */}
      {loading && <p className="text-blue-600">Loading students…</p>}
      {error && (
        <p className="text-red-600">
          Couldn’t load students: <span className="font-mono">{error}</span>
        </p>
      )}

      {!loading && !error && students.length === 0 && selectedBatch !== "" && (
        <p className="text-gray-600">No students in this batch.</p>
      )}

      {students.length > 0 && (
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
                    const isPresent =
                      attendance[student.id]?.[day] === true;
                    return (
                      <td
                        key={day}
                        className={`border text-center cursor-pointer ${
                          isPresent ? "bg-green-200" : "bg-red-200"
                        }`}
                        onClick={() =>
                          handleAttendanceChange(student.id, day)
                        }
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
      )}
    </div>
  );
};

export default AttendancePage;
