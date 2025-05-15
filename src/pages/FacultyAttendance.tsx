import React, { useState, useEffect } from 'react';

// Enhanced student type with more details
const dummyStudents = [
  { id: 'S001', name: 'Aarav Mehta', rollNo: '01', photo: "https://randomuser.me/api/portraits/men/3.jpg", email: 'aarav.m@example.edu', regId: 'REG2025001' },
  { id: 'S002', name: 'Isha Singh', rollNo: '02', photo: "https://randomuser.me/api/portraits/men/3.jpg", email: 'isha.s@example.edu', regId: 'REG2025002' },
  { id: 'S003', name: 'Rahul Yadav', rollNo: '03', photo: "https://randomuser.me/api/portraits/men/3.jpg", email: 'rahul.y@example.edu', regId: 'REG2025003' },
  { id: 'S004', name: 'Sneha Roy', rollNo: '04', photo: "https://randomuser.me/api/portraits/men/3.jpg", email: 'sneha.r@example.edu', regId: 'REG2025004' },
  { id: 'S005', name: 'Kunal Verma', rollNo: '05', photo: '/api/placeholder/40/40', email: 'kunal.v@example.edu', regId: 'REG2025005' },
  { id: 'S006', name: 'Nidhi Sharma', rollNo: '06', photo: '/api/placeholder/40/40', email: 'nidhi.s@example.edu', regId: 'REG2025006' },
  { id: 'S007', name: 'Vikas Deshmukh', rollNo: '07', photo: '/api/placeholder/40/40', email: 'vikas.d@example.edu', regId: 'REG2025007' },
  { id: 'S008', name: 'Tanvi Pillai', rollNo: '08', photo: '/api/placeholder/40/40', email: 'tanvi.p@example.edu', regId: 'REG2025008' },
  { id: 'S009', name: 'Raghav Gupta', rollNo: '09', photo: '/api/placeholder/40/40', email: 'raghav.g@example.edu', regId: 'REG2025009' },
  { id: 'S010', name: 'Priya Menon', rollNo: '10', photo: '/api/placeholder/40/40', email: 'priya.m@example.edu', regId: 'REG2025010' },
  { id: 'S011', name: 'Harsh Patel', rollNo: '11', photo: '/api/placeholder/40/40', email: 'harsh.p@example.edu', regId: 'REG2025011' },
  { id: 'S012', name: 'Divya Iyer', rollNo: '12', photo: '/api/placeholder/40/40', email: 'divya.i@example.edu', regId: 'REG2025012' },
  { id: 'S013', name: 'Soham Joshi', rollNo: '13', photo: '/api/placeholder/40/40', email: 'soham.j@example.edu', regId: 'REG2025013' },
  { id: 'S014', name: 'Meera Reddy', rollNo: '14', photo: '/api/placeholder/40/40', email: 'meera.r@example.edu', regId: 'REG2025014' },
  { id: 'S015', name: 'Ankit Bansal', rollNo: '15', photo: '/api/placeholder/40/40', email: 'ankit.b@example.edu', regId: 'REG2025015' },
  { id: 'S016', name: 'Pooja Dubey', rollNo: '16', photo: '/api/placeholder/40/40', email: 'pooja.d@example.edu', regId: 'REG2025016' },
  { id: 'S017', name: 'Yash Kapoor', rollNo: '17', photo: '/api/placeholder/40/40', email: 'yash.k@example.edu', regId: 'REG2025017' },
  { id: 'S018', name: 'Simran Kaur', rollNo: '18', photo: '/api/placeholder/40/40', email: 'simran.k@example.edu', regId: 'REG2025018' },
  { id: 'S019', name: 'Kabir Khan', rollNo: '19', photo: '/api/placeholder/40/40', email: 'kabir.k@example.edu', regId: 'REG2025019' },
  { id: 'S020', name: 'Ananya Das', rollNo: '20', photo: '/api/placeholder/40/40', email: 'ananya.d@example.edu', regId: 'REG2025020' },
];

// Enhanced attendance status type with more options
type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

// Define some sample classes
const classes = [
  { id: 'C001', name: 'Class X-A', subject: 'Mathematics', time: '09:00 - 10:00' },
  { id: 'C002', name: 'Class X-A', subject: 'Physics', time: '10:15 - 11:15' },
  { id: 'C003', name: 'Class X-A', subject: 'Chemistry', time: '11:30 - 12:30' },
  { id: 'C004', name: 'Class X-B', subject: 'Computer Science', time: '09:00 - 10:00' },
  { id: 'C005', name: 'Class X-B', subject: 'English', time: '10:15 - 11:15' },
];

const FacultyAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState(classes[0].id);
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: { [studentId: string]: AttendanceStatus } }>({});
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<AttendanceStatus>('Present');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);

  // Initialize with some historical data
  useEffect(() => {
    // Generate some sample attendance data for the past week
    const sampleData: { [key: string]: { [studentId: string]: AttendanceStatus } } = {};
    const today = new Date();

    // Generate random attendance for the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // For each class
      classes.forEach(cls => {
        const key = `${dateStr}_${cls.id}`;
        sampleData[key] = {};

        // For each student
        dummyStudents.forEach(student => {
          // Randomly assign attendance status with realistic distribution
          const rand = Math.random();
          if (rand < 0.85) {
            sampleData[key][student.id] = 'Present';
          } else if (rand < 0.90) {
            sampleData[key][student.id] = 'Late';
          } else if (rand < 0.95) {
            sampleData[key][student.id] = 'Excused';
          } else {
            sampleData[key][student.id] = 'Absent';
          }
        });
      });
    }

    setAttendanceData(sampleData);
  }, []);

  const handleAttendanceToggle = (studentId: string) => {
    const key = `${selectedDate}_${selectedClass}`;
    setAttendanceData(prev => {
      const updatedData = { ...prev };

      if (!updatedData[key]) {
        updatedData[key] = {};
        dummyStudents.forEach(s => {
          updatedData[key][s.id] = 'Present'; // Default all to present
        });
      }

      // Cycle through statuses
      const currentStatus = updatedData[key][studentId] || 'Absent';
      const nextStatusMap: Record<AttendanceStatus, AttendanceStatus> = {
        'Present': 'Late',
        'Late': 'Excused',
        'Excused': 'Absent',
        'Absent': 'Present'
      };

      updatedData[key][studentId] = nextStatusMap[currentStatus];
      setIsAttendanceSaved(false);
      return updatedData;
    });
  };

  const getStatus = (studentId: string) => {
    const key = `${selectedDate}_${selectedClass}`;
    return attendanceData[key]?.[studentId] || 'Absent';
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present': return 'bg-green-500 hover:bg-green-600';
      case 'Late': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Excused': return 'bg-blue-500 hover:bg-blue-600';
      case 'Absent': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const handleBulkAction = () => {
    if (selectedStudents.length === 0) return;

    const key = `${selectedDate}_${selectedClass}`;
    setAttendanceData(prev => {
      const updatedData = { ...prev };

      if (!updatedData[key]) {
        updatedData[key] = {};
      }

      selectedStudents.forEach(studentId => {
        updatedData[key][studentId] = bulkAction;
      });

      setIsAttendanceSaved(false);
      return updatedData;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const saveAttendance = () => {
    // In a real app, this would send data to a server
    setShowSavedNotification(true);
    setIsAttendanceSaved(true);
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 3000);
  };

  const getSelectedClassName = () => {
    return classes.find(c => c.id === selectedClass)?.name || '';
  };

  const getSelectedClassSubject = () => {
    return classes.find(c => c.id === selectedClass)?.subject || '';
  };

  const getSelectedClassTime = () => {
    return classes.find(c => c.id === selectedClass)?.time || '';
  };

  // Filter students based on search query
  const filteredStudents = dummyStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.includes(searchQuery) ||
    student.regId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary statistics
  const calculateSummary = () => {
    const key = `${selectedDate}_${selectedClass}`;
    const records = attendanceData[key] || {};

    const present = dummyStudents.filter(s => records[s.id] === 'Present').length;
    const late = dummyStudents.filter(s => records[s.id] === 'Late').length;
    const excused = dummyStudents.filter(s => records[s.id] === 'Excused').length;
    const absent = dummyStudents.filter(s => records[s.id] === 'Absent').length;

    const totalPresent = present + late; // Count late as present for attendance percentage
    const total = dummyStudents.length;
    const percentage = total > 0 ? ((totalPresent / total) * 100).toFixed(1) : '0.0';

    return { present, late, excused, absent, total, percentage };
  };

  const summary = calculateSummary();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Attendance Portal</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">Prof. Sharma</span>
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                PS
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`${activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`${activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Attendance Reports
            </button>
          </nav>
        </div>

        {/* Card with attendance content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Control section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setIsAttendanceSaved(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class & Subject
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setIsAttendanceSaved(false);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subject} ({cls.time})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Students
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Name, Roll No, or Registration ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Class information */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-y-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {getSelectedClassName()} - {getSelectedClassSubject()}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getSelectedClassTime()} | {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                  {summary.present} Present
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100">
                  {summary.late} Late
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                  {summary.excused} Excused
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                  {summary.absent} Absent
                </span>
              </div>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value as AttendanceStatus)}
                    className="rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Excused">Excused</option>
                    <option value="Absent">Absent</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={selectedStudents.length === 0}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply to {selectedStudents.length} selected
                  </button>
                </div>
              </div>

              <button
                onClick={saveAttendance}
                disabled={isAttendanceSaved}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isAttendanceSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isAttendanceSaved ? 'Attendance Saved' : 'Save Attendance'}
              </button>
            </div>
          </div>

          {/* Attendance table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        id="select-all"
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reg. ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No students found matching your search
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelect(student.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={student.photo} alt={student.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.regId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleAttendanceToggle(student.id)}
                          className={`px-4 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(getStatus(student.id))}`}
                        >
                          {getStatus(student.id)}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary section */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{dummyStudents.length}</span> students
              </div>

              <div className="flex items-center gap-x-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Attendance Rate: <span className="font-bold text-blue-600 dark:text-blue-400">{summary.percentage}%</span>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${summary.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved notification */}
      {showSavedNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          Attendance saved successfully!
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;