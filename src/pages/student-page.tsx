import React, { useState } from 'react';
import { initialResults, StudentResult, formatDate } from './shared/shared';

const MIN_MARK = 33;
const MAX_MARK = 100;
const PASS_MARK = 40;

const StudentPage: React.FC = () => {
  const [rollNumber, setRollNumber] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [fetchedResult, setFetchedResult] = useState<StudentResult | null>(null);
  const [message, setMessage] = useState<string>('');
  const [examType, setExamType] = useState<string>('');

  const handleCheckResult = () => {
    const formattedDob = formatDate(dob);
    const result = initialResults.find(
      r => r.rollNumber === rollNumber.trim() && r.dateOfBirth === formattedDob
    );
    if (result) {
      setFetchedResult(result);
      setMessage('Result found! Please select exam type.');
      setExamType('');
    } else {
      setFetchedResult(null);
      setMessage('No result found for these details.');
    }
  };
  
  const subjects = fetchedResult
    ? [
        { code: 'MATH101', name: 'Math', obtain: fetchedResult.math },
        { code: 'SCI201', name: 'Science', obtain: fetchedResult.science },
        { code: 'ENG301', name: 'English', obtain: fetchedResult.english }
      ]
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Student Result Portal
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <tbody>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-200">Roll Number</td>
              <td className="px-6 py-3">
                <input
                  type="text"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your roll number"
                />
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-200">Date of Birth</td>
              <td className="px-6 py-3">
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </td>
            </tr>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <td colSpan={2} className="px-6 py-3 text-center">
                <button
                  onClick={handleCheckResult}
                  className="w-1/3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!rollNumber || !dob}
                >
                  Check Result
                </button>
              </td>
            </tr>
            {message && (
              <tr>
                <td colSpan={2} className={`px-6 py-3 text-center ${fetchedResult ? 'text-green-600' : 'text-red-500'}`}>
                  {message}
                </td>
              </tr>
            )}
            {fetchedResult && (
              <tr>
                <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-200">Exam Type</td>
                <td className="px-6 py-3">
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={examType}
                    onChange={e => setExamType(e.target.value)}
                  >
                    <option value="">-- Choose --</option>
                    <option value="sessional1">Sessional One</option>
                    <option value="sessional2">Sessional Two</option>
                    <option value="final">Final Result</option>
                  </select>
                </td>
              </tr>
            )}

            {fetchedResult && examType && (
              <>
                <tr className="bg-gray-200 dark:bg-gray-600">
                  <th className="px-6 py-3">Subject Code</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Min</th>
                  <th className="px-6 py-3">Max</th>
                  <th className="px-6 py-3">Obtained</th>
                  <th className="px-6 py-3">Remark</th>
                </tr>
                {subjects.map(subj => (
                  <tr key={subj.code} className="text-center">
                    <td className="px-6 py-2">{subj.code}</td>
                    <td className="px-6 py-2">{subj.name}</td>
                    <td className="px-6 py-2">{MIN_MARK}</td>
                    <td className="px-6 py-2">{MAX_MARK}</td>
                    <td className="px-6 py-2">{subj.obtain}</td>
                    <td className="px-6 py-2">{subj.obtain >= PASS_MARK ? 'Pass' : 'Fail'}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-center">
                  <td className="px-6 py-2">Total</td>
                  <td></td>
                  <td></td>
                  <td className="px-6 py-2">{MAX_MARK * subjects.length}</td>
                  <td className="px-6 py-2">{subjects.reduce((sum, s) => sum + s.obtain, 0)}</td>
                  <td></td>
                </tr>
                <tr className="text-center">
                  <td className="px-6 py-2">Percentage</td>
                  <td colSpan={5} className="px-6 py-2">
                    {(subjects.reduce((sum, s) => sum + s.obtain, 0) / (subjects.length * MAX_MARK) * 100).toFixed(2)}%
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPage;
