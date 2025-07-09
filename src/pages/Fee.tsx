import React, { useState } from "react";

type Payment = {
  amount: number;
  date: string;
  mode: string;
  receiptNo: string;
  installment?: number;
};

type StudentFeeDetail = {
  studentInfo: {
    name: string;
    rollNumber: string;
    classSection: string;
    fatherName: string;
    admissionNo?: string;
    phoneNumber?: string;
    academicYear?: string;
  };
  feeSummary: {
    totalFee: number;
    paidSoFar: number;
    remaining: number;
    dueDates: string[];
    scholarship?: number;
    discount?: number;
  };
  fine: {
    amount: number;
    reason?: string;
    date?: string;
    paid: boolean;
  };
  payments: Payment[];
};

// Dummy data for demonstration
const students: StudentFeeDetail[] = [
  {
    studentInfo: {
      name: "Aarav Sharma",
      rollNumber: "22",
      classSection: "10-B",
      fatherName: "Rajesh Sharma",
      admissionNo: "ADM202212",
      phoneNumber: "+91 98765 43210",
      academicYear: "2024-25",
    },
    feeSummary: {
      totalFee: 30000,
      paidSoFar: 18000,
      remaining: 12000,
      dueDates: ["2025-07-30", "2025-10-15"],
      scholarship: 2000,
      discount: 1000,
    },
    fine: {
      amount: 500,
      reason: "Late payment for Term 1",
      date: "2025-06-10",
      paid: false,
    },
    payments: [
      {
        amount: 10000,
        date: "2025-04-15",
        mode: "Online",
        receiptNo: "RCPT-0001",
        installment: 1,
      },
      {
        amount: 8000,
        date: "2025-06-05",
        mode: "Cash",
        receiptNo: "RCPT-0002",
        installment: 2,
      },
    ],
  },
  {
    studentInfo: {
      name: "Aisha Verma",
      rollNumber: "15",
      classSection: "10-A",
      fatherName: "Rohit Verma",
      admissionNo: "ADM202198",
      phoneNumber: "+91 91234 56789",
      academicYear: "2024-25",
    },
    feeSummary: {
      totalFee: 32000,
      paidSoFar: 32000,
      remaining: 0,
      dueDates: ["2025-08-05"],
      scholarship: 0,
      discount: 2000,
    },
    fine: {
      amount: 0,
      paid: true,
    },
    payments: [
      {
        amount: 32000,
        date: "2025-04-12",
        mode: "Online",
        receiptNo: "RCPT-0007",
        installment: 1,
      },
    ],
  },
  {
    studentInfo: {
      name: "Akash Patel",
      rollNumber: "18",
      classSection: "9-C",
      fatherName: "Manoj Patel",
      admissionNo: "ADM202321",
      phoneNumber: "+91 90011 99887",
      academicYear: "2024-25",
    },
    feeSummary: {
      totalFee: 27000,
      paidSoFar: 15000,
      remaining: 12000,
      dueDates: ["2025-09-15", "2025-12-10"],
      scholarship: 1500,
      discount: 500,
    },
    fine: {
      amount: 200,
      reason: "Late payment for 1st installment",
      date: "2025-06-01",
      paid: true,
    },
    payments: [
      {
        amount: 10000,
        date: "2025-04-17",
        mode: "Cash",
        receiptNo: "RCPT-0020",
        installment: 1,
      },
      {
        amount: 5000,
        date: "2025-06-01",
        mode: "Online",
        receiptNo: "RCPT-0021",
        installment: 2,
      },
    ],
  },
  // Add more students if desired
];

export default function ViewStudentFeeDetail() {
  const [search, setSearch] = useState({
    admissionNo: "",
    name: "",
    father: "",
  });
  const [result, setResult] = useState<StudentFeeDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // Suggestion states
  const [showSuggestions, setShowSuggestions] = useState({
    admissionNo: false,
    name: false,
    father: false,
  });

  // Suggestion filters
  const filteredByAdmissionNo = students.filter(
    (s) =>
      s.studentInfo.admissionNo &&
      s.studentInfo.admissionNo
        .toLowerCase()
        .includes(search.admissionNo.trim().toLowerCase())
  );

  const filteredByName = students.filter((s) =>
    s.studentInfo.name
      .toLowerCase()
      .includes(search.name.trim().toLowerCase())
  );

  const filteredByFather = students.filter((s) =>
    s.studentInfo.fatherName
      .toLowerCase()
      .includes(search.father.trim().toLowerCase())
  );

  // Final search: priority to admissionNo, else search by name and father
  const filteredFinal = students.filter(
    (s) =>
      (search.admissionNo
        ? s.studentInfo.admissionNo &&
          s.studentInfo.admissionNo
            .toLowerCase()
            .includes(search.admissionNo.trim().toLowerCase())
        : true) &&
      (search.name
        ? s.studentInfo.name
            .toLowerCase()
            .includes(search.name.trim().toLowerCase())
        : true) &&
      (search.father
        ? s.studentInfo.fatherName
            .toLowerCase()
            .includes(search.father.trim().toLowerCase())
        : true)
  );

  // If there's a unique match on admissionNo, fill and disable name/father fields
  const admissionNoMatch =
    search.admissionNo &&
    filteredByAdmissionNo.length === 1
      ? filteredByAdmissionNo[0]
      : null;

  // When admissionNo is matched, update name and father fields automatically
  React.useEffect(() => {
    if (admissionNoMatch) {
      setSearch((s) => ({
        ...s,
        name: admissionNoMatch.studentInfo.name,
        father: admissionNoMatch.studentInfo.fatherName,
      }));
      setResult(admissionNoMatch);
    }
    // eslint-disable-next-line
  }, [admissionNoMatch?.studentInfo.admissionNo]);

  // On manual suggestion select, fill everything and lock
  const handleSuggestionSelect = (student: StudentFeeDetail) => {
    setSearch({
      admissionNo: student.studentInfo.admissionNo || "",
      name: student.studentInfo.name,
      father: student.studentInfo.fatherName,
    });
    setResult(student);
    setShowSuggestions({ admissionNo: false, name: false, father: false });
  };

  // Search button handler
  const handleSearch = async () => {
    setLoading(true);
    setTimeout(() => {
      if (admissionNoMatch) {
        setResult(admissionNoMatch);
      } else if (filteredFinal.length > 0) {
        setResult(filteredFinal[0]);
      } else {
        setResult(null);
      }
      setLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setSearch({
      admissionNo: "",
      name: "",
      father: "",
    });
    setResult(null);
  };

  const totalPayable =
    (result?.feeSummary.totalFee || 0) +
    (result?.fine.amount || 0) -
    (result?.feeSummary.scholarship || 0) -
    (result?.feeSummary.discount || 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Student Fee Management
        </h1>
        <p className="text-gray-600">
          View detailed fee information and payment history
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Search Student
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Enrollment (Admission) number filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment Number
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.admissionNo}
              onChange={(e) => {
                setSearch((s) => ({
                  ...s,
                  admissionNo: e.target.value,
                  // Clear name and father on typing new admission number
                  name: "",
                  father: "",
                }));
                setShowSuggestions((ss) => ({
                  ...ss,
                  admissionNo: true,
                }));
                setResult(null);
              }}
              onFocus={() =>
                setShowSuggestions((ss) => ({
                  ...ss,
                  admissionNo: true,
                }))
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setShowSuggestions((ss) => ({
                      ...ss,
                      admissionNo: false,
                    })),
                  120
                )
              }
              placeholder="Enter enrollment number"
              autoComplete="off"
            />
            {search.admissionNo &&
              showSuggestions.admissionNo &&
              filteredByAdmissionNo.length > 0 && (
                <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow max-h-40 overflow-y-auto">
                  {filteredByAdmissionNo.slice(0, 5).map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(s)}
                    >
                      {s.studentInfo.admissionNo} — {s.studentInfo.name}
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* Name filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.name}
              disabled={!!admissionNoMatch}
              onChange={(e) => {
                setSearch((s) => ({ ...s, name: e.target.value }));
                setShowSuggestions((ss) => ({ ...ss, name: true }));
                setResult(null);
              }}
              onFocus={() =>
                setShowSuggestions((ss) => ({ ...ss, name: true }))
              }
              onBlur={() =>
                setTimeout(
                  () => setShowSuggestions((ss) => ({ ...ss, name: false })),
                  120
                )
              }
              placeholder="Enter student name"
              autoComplete="off"
            />
            {search.name &&
              showSuggestions.name &&
              filteredByName.length > 0 && (
                <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow max-h-40 overflow-y-auto">
                  {filteredByName.slice(0, 5).map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(s)}
                    >
                      {s.studentInfo.name} ({s.studentInfo.admissionNo})
                    </li>
                  ))}
                </ul>
              )}
          </div>
          {/* Father name filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Father's Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search.father}
              disabled={!!admissionNoMatch}
              onChange={(e) => {
                setSearch((s) => ({ ...s, father: e.target.value }));
                setShowSuggestions((ss) => ({ ...ss, father: true }));
                setResult(null);
              }}
              onFocus={() =>
                setShowSuggestions((ss) => ({ ...ss, father: true }))
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setShowSuggestions((ss) => ({
                      ...ss,
                      father: false,
                    })),
                  120
                )
              }
              placeholder="Enter father's name"
              autoComplete="off"
            />
            {search.father &&
              showSuggestions.father &&
              filteredByFather.length > 0 && (
                <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow max-h-40 overflow-y-auto">
                  {filteredByFather.slice(0, 5).map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                      onMouseDown={() => handleSuggestionSelect(s)}
                    >
                      {s.studentInfo.fatherName} ({s.studentInfo.admissionNo})
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Student Information Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Student Information
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/4">
                      Name
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.studentInfo.name}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/4">
                      Roll Number
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.studentInfo.rollNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Class & Section
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.studentInfo.classSection}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Father's Name
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.studentInfo.fatherName}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Admission Number
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.studentInfo.admissionNo || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Phone Number
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.studentInfo.phoneNumber || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Academic Year
                    </td>
                    <td
                      className="px-6 py-3 text-sm text-gray-900"
                      colSpan={3}
                    >
                      {result.studentInfo.academicYear || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Summary Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Fee Summary
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Total School Fee
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      ₹{result.feeSummary.totalFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Amount Paid
                    </td>
                    <td className="px-6 py-3 text-sm text-green-600 font-medium">
                      ₹{result.feeSummary.paidSoFar.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Remaining Balance
                    </td>
                    <td className="px-6 py-3 text-sm text-red-600 font-medium">
                      ₹{result.feeSummary.remaining.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Scholarship
                    </td>
                    <td className="px-6 py-3 text-sm text-blue-600 font-medium">
                      -₹{(result.feeSummary.scholarship || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Discount
                    </td>
                    <td className="px-6 py-3 text-sm text-blue-600 font-medium">
                      -₹{(result.feeSummary.discount || 0).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Fine Amount
                    </td>
                    <td className="px-6 py-3 text-sm text-red-600 font-medium">
                      ₹{result.fine.amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">
                      Total Payable
                    </td>
                    <td className="px-6 py-3 text-lg font-bold text-blue-900">
                      ₹{totalPayable.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                      Due Dates
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {result.feeSummary.dueDates.map((date, i) => (
                        <span
                          key={i}
                          className="inline-block mr-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                        >
                          {formatDate(date)}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fine Details Table */}
          {result.fine.amount > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-red-50 px-6 py-3 border-b">
                <h3 className="text-lg font-semibold text-red-800">
                  Fine/Penalty Details
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                        Fine Amount
                      </td>
                      <td className="px-6 py-3 text-sm text-red-600 font-medium">
                        ₹{result.fine.amount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                        Reason
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {result.fine.reason || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                        Applied Date
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {result.fine.date
                          ? formatDate(result.fine.date)
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                        Payment Status
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${result.fine.paid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {result.fine.paid ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Payment History
              </h3>
              <span className="text-sm text-gray-600">
                {result.payments.length} payments
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Installment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt No.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.payments.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {payment.installment || idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${payment.mode === "Online"
                            ? "bg-green-100 text-green-800"
                            : payment.mode === "Cash"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {payment.mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {payment.receiptNo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap gap-3">
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">
                Print Receipt
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                Download PDF
              </button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200">
                Send SMS
              </button>
              <button className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200">
                Email Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No student data found
          </h3>
          <p className="text-gray-600">
            Search for a student to view their fee details
          </p>
        </div>
      )}
    </div>
  );
}
