import React, { useState, useEffect } from "react";
import {
  ReceiptText,
  Search,
  User,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
  DollarSign,
  CreditCard,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  fatherName: string;
  class: string;
  roll: number;
  totalFees: number;
  paidFees: number;
  lastPaymentDate?: string;
}

interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  receiptNo: string;
  method: string;
  digitalMode?: string;
}

const paymentOptions = [
  { value: "", label: "Select Payment Method" },
  { value: "cash", label: "Cash" },
  { value: "digital", label: "Digital Payment" },
];

const digitalModes = [
  { value: "", label: "Select Digital Mode" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "netbanking", label: "Net Banking" },
  { value: "wallet", label: "Wallet" },
  { value: "others", label: "Other" },
];

const dummyStudents: Student[] = [
  { id: "10A-0001", name: "Anjali Verma", fatherName: "Rajesh Verma", class: "10A", roll: 1, totalFees: 20000, paidFees: 15000, lastPaymentDate: "2024-12-15" },
  { id: "9B-0002", name: "Rahul Singh", fatherName: "Mahesh Singh", class: "9B", roll: 2, totalFees: 18000, paidFees: 5000, lastPaymentDate: "2024-11-20" },
  { id: "8C-0003", name: "Priya Sharma", fatherName: "Dinesh Sharma", class: "8C", roll: 3, totalFees: 16000, paidFees: 16000, lastPaymentDate: "2024-12-10" },
  { id: "7D-0004", name: "Amit Kumar", fatherName: "Suresh Kumar", class: "7D", roll: 4, totalFees: 14000, paidFees: 8000, lastPaymentDate: "2024-10-05" },
  { id: "6E-0005", name: "Sneha Patel", fatherName: "Ramesh Patel", class: "6E", roll: 5, totalFees: 12000, paidFees: 12000, lastPaymentDate: "2024-12-01" },
  { id: "10A-0006", name: "Vikas Mehta", fatherName: "Harish Mehta", class: "10A", roll: 6, totalFees: 20000, paidFees: 20000, lastPaymentDate: "2024-12-18" },
  { id: "9B-0007", name: "Neha Gupta", fatherName: "Satish Gupta", class: "9B", roll: 7, totalFees: 18000, paidFees: 10000, lastPaymentDate: "2024-11-25" },
  { id: "8C-0008", name: "Rohit Yadav", fatherName: "Vinod Yadav", class: "8C", roll: 8, totalFees: 16000, paidFees: 4000, lastPaymentDate: "2024-10-10" },
  { id: "7D-0009", name: "Kavya Joshi", fatherName: "Naresh Joshi", class: "7D", roll: 9, totalFees: 14000, paidFees: 14000, lastPaymentDate: "2024-12-05" },
  { id: "6E-0010", name: "Manish Rawat", fatherName: "Ratan Rawat", class: "6E", roll: 10, totalFees: 12000, paidFees: 2000, lastPaymentDate: "2024-09-15" },
  { id: "5F-0011", name: "Sakshi Jain", fatherName: "Ravi Jain", class: "5F", roll: 11, totalFees: 10000, paidFees: 6000, lastPaymentDate: "2024-10-12" },
  { id: "4G-0012", name: "Deepak Sahu", fatherName: "Gopal Sahu", class: "4G", roll: 12, totalFees: 9000, paidFees: 9000, lastPaymentDate: "2024-11-10" },
  { id: "3H-0013", name: "Pooja Rani", fatherName: "Shiv Kumar", class: "3H", roll: 13, totalFees: 8000, paidFees: 4000, lastPaymentDate: "2024-10-01" },
  { id: "2I-0014", name: "Anmol Aggarwal", fatherName: "Ajay Aggarwal", class: "2I", roll: 14, totalFees: 7500, paidFees: 7500, lastPaymentDate: "2024-12-20" },
  { id: "1J-0015", name: "Isha Khan", fatherName: "Nadeem Khan", class: "1J", roll: 15, totalFees: 7000, paidFees: 3000, lastPaymentDate: "2024-11-02" },
];

export default function FeesPage() {
  const [classSearch, setClassSearch] = useState("");
  const [rollSearch, setRollSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [autoFilledStudent, setAutoFilledStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState<{ [id: string]: string }>({});
  const [paymentMethod, setPaymentMethod] = useState<{ [id: string]: string }>({});
  const [digitalMode, setDigitalMode] = useState<{ [id: string]: string }>({});
  const [receiptData, setReceiptData] = useState<Student | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [errors, setErrors] = useState<{ [id: string]: string }>({});
  const [processing, setProcessing] = useState<{ [id: string]: boolean }>({});
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState("");
  const [receiptDigitalMode, setReceiptDigitalMode] = useState("");
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [classSearch, rollSearch, nameSearch, enrollmentSearch]);

  useEffect(() => {
    if (enrollmentSearch.trim() === "") {
      setAutoFilledStudent(null);
    } else {
      const found = students.find(
        (student) => student.id.toLowerCase() === enrollmentSearch.toLowerCase()
      );
      setAutoFilledStudent(found || null);
      setNameSearch("");
      setClassSearch("");
      setRollSearch("");
    }
  }, [enrollmentSearch, students]);

  const generateReceiptNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `REC-${timestamp}-${random}`.toUpperCase();
  };

  const filteredStudents = React.useMemo(() => {
    if (autoFilledStudent) return [autoFilledStudent];
    return students.filter((student) => {
      const classMatch = classSearch === "" || student.class.toLowerCase().includes(classSearch.toLowerCase());
      const rollMatch = rollSearch === "" || student.roll.toString().includes(rollSearch);
      const nameMatch =
        nameSearch === "" ||
        student.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
        student.fatherName.toLowerCase().includes(nameSearch.toLowerCase());
      return classMatch && rollMatch && nameMatch;
    });
  }, [students, autoFilledStudent, classSearch, rollSearch, nameSearch]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const validatePayment = (
    student: Student,
    paymentAmount: string,
    method: string,
    dMode: string
  ): string | null => {
    const amt = parseFloat(paymentAmount);

    if (!method) {
      return "Please select a payment method";
    }
    if (method === "digital") {
      if (!dMode) return "Please select a digital payment mode";
    }
    if (method !== "digital") {
      if (!paymentAmount || paymentAmount.trim() === "") {
        return "Please enter an amount";
      }
      if (isNaN(amt) || amt <= 0) {
        return "Please enter a valid positive amount";
      }
      if (amt > 50000) {
        return "Payment amount cannot exceed ₹50,000";
      }
      const remainingBalance = student.totalFees - student.paidFees;
      if (amt > remainingBalance) {
        return `Amount exceeds remaining balance of ₹${remainingBalance}`;
      }
    }
    return null;
  };

  const handlePay = async (student: Student) => {
    const method = paymentMethod[student.id] || "";
    const dMode = digitalMode[student.id] || "";
    let paymentAmount = amount[student.id] || "";

    // If digital, pay the remaining balance
    if (method === "digital") {
      paymentAmount = (student.totalFees - student.paidFees).toString();
    }

    const validationError = validatePayment(student, paymentAmount, method, dMode);
    if (validationError) {
      setErrors({ ...errors, [student.id]: validationError });
      return;
    }

    setProcessing({ ...processing, [student.id]: true });
    setErrors({ ...errors, [student.id]: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const amt = parseFloat(paymentAmount);
      const receiptNo = generateReceiptNumber();
      const paymentDate = new Date().toISOString().split("T")[0];

      const updatedStudent = {
        ...student,
        paidFees: student.paidFees + amt,
        lastPaymentDate: paymentDate,
      };

      setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));

      const paymentRecord: PaymentRecord = {
        id: `PAY-${Date.now()}`,
        studentId: student.id,
        amount: amt,
        date: paymentDate,
        receiptNo,
        method,
        digitalMode: method === "digital" ? dMode : undefined,
      };

      setPaymentRecords((prev) => [...prev, paymentRecord]);
      setReceiptData(updatedStudent);
      setReceiptNumber(receiptNo);

      const displayMethod = paymentOptions.find(opt => opt.value === method)?.label || "";
      const displayDigital = digitalModes.find(opt => opt.value === dMode)?.label || "";
      setReceiptPaymentMethod(displayMethod);
      setReceiptDigitalMode(displayDigital);
      setShowReceipt(true);

      setAmount({ ...amount, [student.id]: "" });
      setPaymentMethod({ ...paymentMethod, [student.id]: "" });
      setDigitalMode({ ...digitalMode, [student.id]: "" });
    } catch (error) {
      setErrors({ ...errors, [student.id]: "Payment processing failed. Please try again." });
    } finally {
      setProcessing({ ...processing, [student.id]: false });
    }
  };

  const handleAmountChange = (studentId: string, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount({ ...amount, [studentId]: value });
      if (errors[studentId]) {
        setErrors({ ...errors, [studentId]: "" });
      }
    }
  };

  const handlePaymentMethodChange = (studentId: string, value: string) => {
    setPaymentMethod({ ...paymentMethod, [studentId]: value });
    setDigitalMode({ ...digitalMode, [studentId]: "" }); // reset digital mode when payment method changes
    if (errors[studentId]) {
      setErrors({ ...errors, [studentId]: "" });
    }
  };

  const handleDigitalModeChange = (studentId: string, value: string) => {
    setDigitalMode({ ...digitalMode, [studentId]: value });
    if (errors[studentId]) {
      setErrors({ ...errors, [studentId]: "" });
    }
  };

  const getPaymentStatus = (student: Student) => {
    const percentage = (student.paidFees / student.totalFees) * 100;
    if (percentage >= 100) {
      return { color: "text-green-600", bg: "bg-green-50", text: "Fully Paid", icon: CheckCircle };
    } else if (percentage >= 75) {
      return { color: "text-blue-600", bg: "bg-blue-50", text: "Nearly Complete", icon: CreditCard };
    } else if (percentage >= 50) {
      return { color: "text-yellow-600", bg: "bg-yellow-50", text: "Half Paid", icon: DollarSign };
    } else {
      return { color: "text-red-600", bg: "bg-red-50", text: "Pending", icon: AlertCircle };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enrollment Number Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Lookup by Enrollment Number</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Number</label>
              <input
                type="text"
                value={enrollmentSearch}
                onChange={(e) => setEnrollmentSearch(e.target.value)}
                placeholder="e.g., 10A-0001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={autoFilledStudent?.name || ""}
                readOnly
                disabled
                placeholder="Name"
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <input
                type="text"
                value={autoFilledStudent?.class || ""}
                readOnly
                disabled
                placeholder="Class"
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father Name</label>
              <input
                type="text"
                value={autoFilledStudent?.fatherName || ""}
                readOnly
                disabled
                placeholder="Father Name"
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-500"
              />
            </div>
          </div>
          {enrollmentSearch && !autoFilledStudent && (
            <div className="text-red-500 text-sm mt-2">No student found for this Enrollment Number.</div>
          )}
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedStudents.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No students found matching your search criteria</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
            </div>
          ) : (
            paginatedStudents.map((student) => {
              const status = getPaymentStatus(student);
              const StatusIcon = status.icon;
              const remainingBalance = student.totalFees - student.paidFees;
              const paymentPercentage = (student.paidFees / student.totalFees) * 100;

              return (
                <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.class} - Roll {String(student.roll).padStart(2, "0")}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.text}
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Father's Name:</span>
                      <span className="font-medium">{student.fatherName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Student ID:</span>
                      <span className="font-medium">{student.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Fees:</span>
                      <span className="font-medium">₹{student.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paid Amount:</span>
                      <span className="font-medium text-green-600">₹{student.paidFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium text-red-600">₹{remainingBalance.toLocaleString()}</span>
                    </div>
                    {student.lastPaymentDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Payment:</span>
                        <span className="font-medium">{new Date(student.lastPaymentDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Payment Progress</span>
                      <span>{paymentPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(paymentPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Payment Input */}
                  {remainingBalance > 0 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select
                          value={paymentMethod[student.id] || ""}
                          onChange={(e) => handlePaymentMethodChange(student.id, e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[student.id] ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {paymentOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      {/* Digital mode dropdown */}
                      {paymentMethod[student.id] === "digital" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Digital Payment Mode
                          </label>
                          <select
                            value={digitalMode[student.id] || ""}
                            onChange={(e) => handleDigitalModeChange(student.id, e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[student.id] ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            {digitalModes.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {/* Amount input (hidden if digital payment) */}
                      {paymentMethod[student.id] !== "digital" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Amount
                          </label>
                          <input
                            type="text"
                            placeholder="Enter amount"
                            value={amount[student.id] || ""}
                            onChange={(e) => handleAmountChange(student.id, e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors[student.id] ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                        </div>
                      )}
                      {errors[student.id] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors[student.id]}
                        </p>
                      )}
                      <button
                        onClick={() => handlePay(student)}
                        disabled={
                          processing[student.id] ||
                          (paymentMethod[student.id] !== "digital" && !amount[student.id]) ||
                          (paymentMethod[student.id] === "digital" && !digitalMode[student.id])
                        }
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          processing[student.id] ||
                          (paymentMethod[student.id] !== "digital" && !amount[student.id]) ||
                          (paymentMethod[student.id] === "digital" && !digitalMode[student.id])
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {processing[student.id] ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </span>
                        ) : (
                          "Make Payment"
                        )}
                      </button>
                    </div>
                  )}

                  {remainingBalance === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-medium text-green-800">Fees Fully Paid</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && receiptData && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 mt-10">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ReceiptText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Payment Receipt</h2>
                </div>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="p-6 space-y-4">
                <div className="text-center pb-4 border-b">
                  <p className="text-sm text-gray-600">Receipt Number</p>
                  <p className="font-mono text-lg font-bold text-gray-900">{receiptNumber}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Student Name:</span>
                    <span className="text-sm font-medium">{receiptData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Student ID:</span>
                    <span className="text-sm font-medium">{receiptData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Father's Name:</span>
                    <span className="text-sm font-medium">{receiptData.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Class:</span>
                    <span className="text-sm font-medium">{receiptData.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Roll Number:</span>
                    <span className="text-sm font-medium">{String(receiptData.roll).padStart(2, "0")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-medium">
                      {receiptPaymentMethod}
                      {receiptPaymentMethod === "Digital Payment" && receiptDigitalMode ? ` (${receiptDigitalMode})` : ""}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Amount Paid:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹
                      {paymentRecords.length > 0
                        ? paymentRecords[paymentRecords.length - 1].amount
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium">₹{receiptData.paidFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Fees:</span>
                    <span className="font-medium">₹{receiptData.totalFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-red-600">
                      ₹{(receiptData.totalFees - receiptData.paidFees).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Payment Date: {new Date().toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">This is a computer-generated receipt</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
