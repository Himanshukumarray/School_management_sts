import React, { useState } from 'react';
import {
  initialResults,
  StudentResult,
  formatDate,
  classData
} from './shared/shared';

const TeacherPage: React.FC = () => {
  const [results, setResults] = useState<StudentResult[]>(initialResults);
  const [selectedClass, setSelectedClass] = useState<keyof typeof classData | ''>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [examType, setExamType] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [marksInput, setMarksInput] = useState<
    Record<string, { math: string; science: string; english: string }>
  >({});

  const availableSections = selectedClass
    ? Object.keys(classData[selectedClass])
    : [];

  const availableStudents =
    selectedClass && selectedSection && examType
      ? classData[selectedClass][selectedSection as keyof typeof classData[keyof typeof classData]].filter(
          (student: { rollNumber: string; dateOfBirth: string }) =>
            !results.some(
              (result: StudentResult) =>
                result.rollNumber === student.rollNumber &&
                result.examType === examType
            )
        )
      : [];

  const handleInputChange = (
    rollNumber: string,
    subject: string,
    value: string
  ) => {
    setMarksInput(prev => ({
      ...prev,
      [rollNumber]: {
        ...prev[rollNumber],
        [subject]: value
      }
    }));
  };

  const handleAddResult = (student: typeof availableStudents[0]) => {
    const input = marksInput[student.rollNumber];
    if (
      !input ||
      input.math === '' ||
      input.science === '' ||
      input.english === '' ||
      !examType
    ) {
      return;
    }

    const newResult: StudentResult = {
      rollNumber: student.rollNumber,
      name: student.name,
      dateOfBirth: formatDate(student.dateOfBirth),
      math: Number(input.math),
      science: Number(input.science),
      english: Number(input.english),
      examType: examType,  // Exam type can be added with type assertion
    } as StudentResult;
    

    setResults(prev => [...prev, newResult]);
    setMessage(
      `Added ${examType} result for ${newResult.name} (${newResult.rollNumber}).`
    );

    setMarksInput(prev => {
      const updated = { ...prev };
      delete updated[student.rollNumber];
      return updated;
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Teacher Entry Portal
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1">Select Class</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value as keyof typeof classData);
              setSelectedSection('');
              setMarksInput({});
              setMessage('');
            }}
          >
            <option value="">-- Choose Class --</option>
            {Object.keys(classData).map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Select Section</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">-- Choose Section --</option>
            {availableSections.map(sec => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Select Exam Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={examType}
            onChange={e => setExamType(e.target.value)}
          >
            <option value="">-- Choose Exam Type --</option>
            <option value="Sessional One">Sessional One</option>
            <option value="Sessional Two">Sessional Two</option>
            <option value="Final Exam">Final Exam</option>
          </select>
        </div>
      </div>

      {selectedClass && selectedSection && examType && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border">Roll No</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">DOB</th>
                <th className="px-4 py-2 border">Math</th>
                <th className="px-4 py-2 border">Science</th>
                <th className="px-4 py-2 border">English</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableStudents.length ? (
                availableStudents.map(student => {
                  const mark = marksInput[student.rollNumber] || {
                    math: '',
                    science: '',
                    english: ''
                  };
                  return (
                    <tr key={student.rollNumber} className="text-center">
                      <td className="px-4 py-2 border">{student.rollNumber}</td>
                      <td className="px-4 py-2 border">{student.name}</td>
                      <td className="px-4 py-2 border">{student.dateOfBirth}</td>
                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          className="w-20 p-1 border rounded"
                          value={mark.math}
                          onChange={e =>
                            handleInputChange(
                              student.rollNumber,
                              'math',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          className="w-20 p-1 border rounded"
                          value={mark.science}
                          onChange={e =>
                            handleInputChange(
                              student.rollNumber,
                              'science',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-2 py-2 border">
                        <input
                          type="number"
                          className="w-20 p-1 border rounded"
                          value={mark.english}
                          onChange={e =>
                            handleInputChange(
                              student.rollNumber,
                              'english',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleAddResult(student)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          disabled={!mark.math || !mark.science || !mark.english}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-600">
                    {message || 'All students have been entered.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {message && !(selectedClass && selectedSection && examType) && (
        <p className="mt-6 text-red-500 font-medium text-center">{message}</p>
      )}
    </div>
  );
};

export default TeacherPage;