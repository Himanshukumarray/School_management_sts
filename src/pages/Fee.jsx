// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../axios/axiosinstance";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const months = [
//   "April", "May", "June", "July", "August", "September",
//   "October", "November", "December", "January", "February", "March"
// ];

// const FeeManagement = () => {
//   const [studentId, setStudentId] = useState(0);
//   const [fees, setFees] = useState([]);
//   const [amount, setAmount] = useState(0);
//   const [month, setMonth] = useState("");
//   const [paymentMode, setPaymentMode] = useState("");
//   const [referenceNumber, setReferenceNumber] = useState("");

//   const fetchFees = async () => {
//     if (!studentId) return;
//     const res = await axiosInstance.get(`/api/fees/student/${studentId}`);
//     setFees(res.data);
//   };

//   const makePayment = async (feeId) => {
//     await axiosInstance.post(`/api/fees/pay/${feeId}`, null, {
//       params: {
//         amount,
//         paymentMode,
//         referenceNumber,
//         month
//       }
//     });
//     fetchFees();
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-6">
//       <Card>
//         <CardContent className="p-4 space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="studentId">Student ID</Label>
//             <Input
//               id="studentId"
//               type="number"
//               value={studentId || ""}
//               onChange={(e) => setStudentId(Number(e.target.value))}
//               placeholder="Enter Student ID"
//             />
//             <Button onClick={fetchFees}>Fetch Fees</Button>
//           </div>
//         </CardContent>
//       </Card>

//       {fees.map((fee) => (
//         <Card key={fee.id} className="dark:bg-gray-900">
//           <CardContent className="p-4 space-y-4">
//             <div>
//               <p className="text-lg font-semibold">Student ID: {fee.studentId}</p>
//               <p>Total Fee: ₹{fee.totalFee}</p>
//               <p>Paid: ₹{fee.paidAmount}</p>
//               <p>Remaining: ₹{fee.remainingAmount}</p>
//               <p>Batch Year: {fee.batchYear}</p>
//               <p>Payment Frequency: {fee.paymentFrequency}</p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
//               {months.map((m) => (
//                 <span
//                   key={m}
//                   className={`text-xs rounded px-2 py-1 text-center border ${fee.monthlyPaymentStatus[m] ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
//                 >
//                   {m}
//                 </span>
//               ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Amount</Label>
//                 <Input
//                   type="number"
//                   value={amount || ""}
//                   onChange={(e) => setAmount(Number(e.target.value))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Month</Label>
//                 <select
//                   value={month}
//                   onChange={(e) => setMonth(e.target.value)}
//                   className="w-full p-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
//                 >
//                   <option value="">Select Month</option>
//                   {months.map((m) => (
//                     <option key={m} value={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Payment Mode</Label>
//                 <Input
//                   value={paymentMode}
//                   onChange={(e) => setPaymentMode(e.target.value)}
//                   placeholder="e.g., Cash, Card"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Reference Number</Label>
//                 <Input
//                   value={referenceNumber}
//                   onChange={(e) => setReferenceNumber(e.target.value)}
//                 />
//               </div>
//             </div>
//             <Button onClick={() => makePayment(fee.id)}>Make Payment</Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default FeeManagement;
