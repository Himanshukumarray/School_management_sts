import React, { useState } from 'react';
import { Search, User, Calendar, BookOpen, Save, Trash2, AlertCircle, CheckCircle, X } from 'lucide-react';
import axiosInstance from '../axios/axiosinstance';

interface SearchForm {
  studentAdmissionId: string;
  dateOfBirth: string;
  classId: string;
}

interface Subject {
  name: string;
  maxMarks: number;
  obtainedMarks: string | number;
}

interface StudentData {
  admissionId: string;
  dateOfBirth: string;
  classId: string;
  existingResult?: Result | null;
}

interface Result {
  id?: number;
  studentAdmissionId: number;
  subjects: Subject[];
  totalMarks: number;
  grade: string;
  remarks: string;
}

interface ResultData {
  studentAdmissionId: string;
  subjects: Subject[];
  totalMarks: number;
  grade: string;
  remarks: string;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const TeacherPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'marks'>('search');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [searchForm, setSearchForm] = useState<SearchForm>({
    studentAdmissionId: '',
    dateOfBirth: '',
    classId: '',
  });
  const [resultData, setResultData] = useState<ResultData>({
    studentAdmissionId: '',
    subjects: [],
    totalMarks: 0,
    grade: '',
    remarks: ''
  });
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: 'Mathematics', maxMarks: 100, obtainedMarks: '' },
    { name: 'English', maxMarks: 100, obtainedMarks: '' },
    { name: 'Science', maxMarks: 100, obtainedMarks: '' },
    { name: 'Social Studies', maxMarks: 100, obtainedMarks: '' },
    { name: 'Computer Science', maxMarks: 100, obtainedMarks: '' }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchStudent = async (): Promise<void> => {
    if (!searchForm.studentAdmissionId || !searchForm.dateOfBirth || !searchForm.classId) {
      setMessage({ type: 'error', text: 'Please fill all search fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const queryParams = new URLSearchParams({
        studentAdmissionId: searchForm.studentAdmissionId,
        dateOfBirth: searchForm.dateOfBirth,
        classId: searchForm.classId
      });

      const response = await axiosInstance.get(`/api/results?${queryParams.toString()}`, {
        headers: {
          'tenant': sessionStorage.getItem('tenant') || '',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const result: Result = response.data;

        setStudentData({
          admissionId: searchForm.studentAdmissionId,
          dateOfBirth: searchForm.dateOfBirth,
          classId: searchForm.classId,
          existingResult: result
        });

        setSubjects(prev => prev.map(subject => {
          const existingSubject = result.subjects.find(s => s.name === subject.name);
          return existingSubject ? { ...subject, obtainedMarks: existingSubject.obtainedMarks } : subject;
        }));

        setResultData({
          studentAdmissionId: searchForm.studentAdmissionId,
          subjects: result.subjects,
          totalMarks: result.totalMarks,
          grade: result.grade,
          remarks: result.remarks
        });

        setCurrentStep('marks');
        setMessage({ type: 'success', text: 'Student found! You can now enter marks.' });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Student found but no result
        setStudentData({
          admissionId: searchForm.studentAdmissionId,
          dateOfBirth: searchForm.dateOfBirth,
          classId: searchForm.classId,
          existingResult: null
        });

        setResultData(prev => ({
          ...prev,
          studentAdmissionId: searchForm.studentAdmissionId
        }));

        setCurrentStep('marks');
        setMessage({ type: 'success', text: 'Student found! No existing results. You can enter new marks.' });
      } else {
        console.error('Error searching for student:', error);
        setMessage({ type: 'error', text: 'Error searching for student. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSubjectMarksChange = (index: number, value: string): void => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].obtainedMarks = value;
    setSubjects(updatedSubjects);

    // Calculate total marks
    const total = updatedSubjects.reduce((sum, subject) => {
      return sum + (parseInt(subject.obtainedMarks.toString()) || 0);
    }, 0);

    setResultData(prev => ({
      ...prev,
      totalMarks: total,
      subjects: updatedSubjects.map(s => ({
        name: s.name,
        maxMarks: s.maxMarks,
        obtainedMarks: parseInt(s.obtainedMarks.toString()) || 0
      }))
    }));
  };

  const calculateGrade = (totalMarks: number, maxMarks: number = 500): string => {
    const percentage = (totalMarks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const saveResult = async (): Promise<void> => {
    const totalMaxMarks = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
    const grade = calculateGrade(resultData.totalMarks, totalMaxMarks);

    const payload: Omit<Result, 'id'> = {
      studentAdmissionId: parseInt(resultData.studentAdmissionId),
      grade,
      totalMarks: resultData.totalMarks,
      remarks: resultData.remarks,
      subjects: subjects.map(s => ({
        name: s.name,
        maxMarks: s.maxMarks,
        obtainedMarks: parseInt(s.obtainedMarks.toString()) || 0
      }))
    };

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axiosInstance.post('/api/results', payload, {
        headers: {
          'tenant': sessionStorage.getItem('tenant') || '',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Results saved successfully!' });
      } else {
        console.error('Save error:', response.data);
        setMessage({ type: 'error', text: 'Failed to save results. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving results:', error);
      setMessage({ type: 'error', text: 'Error saving results. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setCurrentStep('search');
    setStudentData(null);
    setSearchForm({
      studentAdmissionId: '',
      dateOfBirth: '',
      classId: '',
    });
    setResultData({
      studentAdmissionId: '',
      subjects: [],
      totalMarks: 0,
      grade: '',
      remarks: ''
    });
    setSubjects(subjects.map(s => ({ ...s, obtainedMarks: '' })));
    setMessage({ type: '', text: '' });
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setResultData(prev => ({ ...prev, remarks: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="text-blue-600" />
            Teacher Marks Management System
          </h1>
          <p className="text-gray-600 mt-2">Search for students and manage their academic results</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            'bg-red-100 text-red-800 border border-red-200'
            }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* Step Indicator */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'search' ? 'text-blue-600' : 'text-gray-400'
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                1
              </div>
              <span className="font-medium">Search Student</span>
            </div>
            <div className={`w-12 h-1 ${currentStep === 'marks' ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'marks' ? 'text-blue-600' : 'text-gray-400'
              }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'marks' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                2
              </div>
              <span className="font-medium">Enter Marks</span>
            </div>
          </div>
        </div>

        {/* Student Search Form */}
        {currentStep === 'search' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Search className="text-blue-600" />
              Search Student
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Admission ID
                </label>
                <input
                  type="number"
                  name="studentAdmissionId"
                  value={searchForm.studentAdmissionId}
                  onChange={handleSearchInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admission ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={searchForm.dateOfBirth}
                  onChange={handleSearchInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class ID
                </label>
                <input
                  type="number"
                  name="classId"
                  value={searchForm.classId}
                  onChange={handleSearchInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter class ID"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant
                </label>
                <select
                  name="tenant"
                  value={searchForm.tenant}
                  onChange={handleSearchInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="school1">School 1</option>
                  <option value="school2">School 2</option>
                  <option value="school3">School 3</option>
                </select>
              </div> */}
            </div>

            <button
              onClick={searchStudent}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search size={20} />
              )}
              {loading ? 'Searching...' : 'Search Student'}
            </button>
          </div>
        )}

        {/* Marks Entry Form */}
        {currentStep === 'marks' && studentData && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-blue-600" />
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Admission ID:</span>
                  <p className="text-gray-800">{studentData.admissionId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Date of Birth:</span>
                  <p className="text-gray-800">{studentData.dateOfBirth}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Class ID:</span>
                  <p className="text-gray-800">{studentData.classId}</p>
                </div>
              </div>
            </div>

            {/* Marks Entry */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Marks</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Max Marks</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Obtained Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium text-gray-700">{subject.name}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{subject.maxMarks}</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={subject.obtainedMarks}
                            onChange={(e) => handleSubjectMarksChange(index, e.target.value)}
                            max={subject.maxMarks}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <span className="block text-sm font-medium text-gray-600">Total Marks</span>
                    <span className="text-2xl font-bold text-blue-600">{resultData.totalMarks}/500</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-medium text-gray-600">Percentage</span>
                    <span className="text-2xl font-bold text-green-600">
                      {((resultData.totalMarks / 500) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-medium text-gray-600">Grade</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {calculateGrade(resultData.totalMarks)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={resultData.remarks}
                  onChange={handleRemarksChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter any additional remarks..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={saveResult}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save size={20} />
                  )}
                  {loading ? 'Saving...' : 'Save Results'}
                </button>

                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  New Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPage;