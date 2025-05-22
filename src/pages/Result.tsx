import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, GraduationCap } from 'lucide-react';

// Types based on actual backend structure
interface Student {
  studentAdmissionId: number;
  name?: string;
  rollNumber?: string;
  classId: number;
  className?: string;
}

interface Subject {
  subjectName: string;
  marks: string;
  obtainedMarks: number;
  maxMarks: number;
  percentage: number;
  status: 'PASS' | 'FAIL';
}

interface ActualApiResponse {
  id: number;
  studentAdmissionId: number;
  dateOfBirth: string;
  classId: number;
  semester: string;
  subjectMarks: {
    [key: string]: string; // e.g., "Math": "88/100"
  };
}

interface ProcessedResult {
  id: number;
  student: {
    studentAdmissionId: number;
    name: string;
    rollNumber: string;
    classId: number;
    className: string;
  };
  examType: string;
  examDate: string;
  subjects: Subject[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  overallStatus: 'PASS' | 'FAIL';
  remarks?: string;
}

const StudentPage: React.FC = () => {
  const [studentAdmissionId, setStudentAdmissionId] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  // const [tenant, setTenant] = useState<string>('');
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  // Function to process the actual API response into our display format
  const processApiResponse = (apiResponse: ActualApiResponse): ProcessedResult => {
    const subjects: Subject[] = [];
    let totalObtained = 0;
    let totalMax = 0;
    let passCount = 0;

    // Process each subject
    Object.entries(apiResponse.subjectMarks).forEach(([subjectName, marksString]) => {
      const [obtained, max] = marksString.split('/').map(num => parseInt(num));
      const percentage = (obtained / max) * 100;
      const status: 'PASS' | 'FAIL' = percentage >= 40 ? 'PASS' : 'FAIL'; // Assuming 40% is pass mark
      
      if (status === 'PASS') passCount++;
      
      subjects.push({
        subjectName,
        marks: marksString,
        obtainedMarks: obtained,
        maxMarks: max,
        percentage,
        status
      });
      
      totalObtained += obtained;
      totalMax += max;
    });

    const overallPercentage = (totalObtained / totalMax) * 100;
    const overallStatus: 'PASS' | 'FAIL' = passCount === subjects.length ? 'PASS' : 'FAIL';
    
    // Determine grade based on percentage
    let overallGrade = 'F';
    if (overallPercentage >= 90) overallGrade = 'A+';
    else if (overallPercentage >= 80) overallGrade = 'A';
    else if (overallPercentage >= 70) overallGrade = 'B';
    else if (overallPercentage >= 60) overallGrade = 'C';
    else if (overallPercentage >= 40) overallGrade = 'D';

    return {
      id: apiResponse.id,
      student: {
        studentAdmissionId: apiResponse.studentAdmissionId,
        name: `Student ${apiResponse.studentAdmissionId}`, // Placeholder since not provided
        rollNumber: `ROLL${apiResponse.studentAdmissionId}`, // Placeholder since not provided
        classId: apiResponse.classId,
        className: `Class ${apiResponse.classId}` // Placeholder since not provided
      },
      examType: apiResponse.semester,
      examDate: apiResponse.dateOfBirth, // Using dateOfBirth as placeholder for exam date
      subjects,
      totalMarks: totalMax,
      obtainedMarks: totalObtained,
      percentage: overallPercentage,
      overallGrade,
      overallStatus,
      remarks: overallStatus === 'FAIL' ? 'Student needs improvement in failed subjects' : undefined
    };
  };

  const handleCheckResult = async () => {
    if (!studentAdmissionId || !dateOfBirth || !classId) {
      setError('Please fill all required fields');
      return;
    }

    console.log('Making request with params:', {
      studentAdmissionId,
      dateOfBirth,
      classId,
      // tenant
    });

    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);

    try {
      const params = new URLSearchParams({
        studentAdmissionId,
        dateOfBirth,
        classId
      });

      const url = `http://localhost:8080/api/results?${params}`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'tenant': sessionStorage.getItem('tenant') || '',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const resultData: ActualApiResponse = await response.json();
        console.log('Raw API Response:', resultData);
        
        // Process the API response to match our display format
        const processedResult = processApiResponse(resultData);
        console.log('Processed Result:', processedResult);
        
        setResult(processedResult);
        setSuccess('Result found successfully!');
      } else {
        const errorData = await response.json().catch(() => null);
        console.log('Error Response:', errorData); // Debug log
        
        if (response.status === 404) {
          setError('No result found for the provided details.');
        } else if (response.status === 400) {
          setError(errorData?.message || 'Invalid request. Please check your input.');
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(errorData?.message || `Error ${response.status}: Failed to fetch result.`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStudentAdmissionId('');
    setDateOfBirth('');
    setClassId('');
    // setTenant('');
    setResult(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Student Result Portal
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your details to check examination results
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Student Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Admission ID *
              </label>
              <input
                type="number"
                value={studentAdmissionId}
                onChange={(e) => setStudentAdmissionId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admission ID"
                disabled={loading}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class ID *
              </label>
              <input
                type="number"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter class ID (e.g., 1, 2, 3, 4...)"
                disabled={loading}
                min="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter numeric class ID (1, 2, 3, etc.)
              </p>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School/Tenant Code *
              </label>
              <input
                type="text"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter school code"
                disabled={loading}
              />
            </div> */}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCheckResult}
              disabled={loading || !studentAdmissionId || !dateOfBirth || !classId}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Checking...' : 'Check Result'}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 dark:text-green-300">{success}</span>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Student Info Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold">Student Name</h3>
                  <p className="text-blue-100">{result.student.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Roll Number</h3>
                  <p className="text-blue-100">{result.student.rollNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Class</h3>
                  <p className="text-blue-100">{result.student.className}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold">Exam Type</h3>
                  <p className="text-blue-100">{result.examType}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Exam Date</h3>
                  <p className="text-blue-100">{new Date(result.examDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Subject-wise Results
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left text-gray-900 dark:text-white">Subject Name</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">Marks</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">Max Marks</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">Obtained</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">Percentage</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">{subject.subjectName}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">{subject.marks}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">{subject.maxMarks}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                          {subject.obtainedMarks}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center text-gray-900 dark:text-white">
                          {subject.percentage.toFixed(1)}%
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            subject.status === 'PASS' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {subject.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Total Marks</h4>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{result.totalMarks}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Obtained Marks</h4>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{result.obtainedMarks}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200">Percentage</h4>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{result.percentage.toFixed(2)}%</p>
                </div>
                <div className={`p-4 rounded-lg ${
                  result.overallStatus === 'PASS' 
                    ? 'bg-green-50 dark:bg-green-900' 
                    : 'bg-red-50 dark:bg-red-900'
                }`}>
                  <h4 className={`font-semibold ${
                    result.overallStatus === 'PASS' 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>Overall Status</h4>
                  <p className={`text-2xl font-bold ${
                    result.overallStatus === 'PASS' 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-red-900 dark:text-red-100'
                  }`}>{result.overallStatus}</p>
                </div>
              </div>

              {/* Overall Grade and Remarks */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Overall Grade</h4>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.overallGrade}</p>
                </div>
                {result.remarks && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Remarks</h4>
                    <p className="text-yellow-900 dark:text-yellow-100">{result.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;