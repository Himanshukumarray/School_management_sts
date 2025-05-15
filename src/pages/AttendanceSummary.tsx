import React, { useState } from 'react';

const dummyStudents = [
  { 
    id: 'S001', 
    name: 'Aarav Mehta', 
    rollNo: '01',
    class: 'X-A',
    section: 'A', 
    admissionNo: 'ADM2025001',
    photo: '/api/placeholder/80/80' 
  },
  { 
    id: 'S002', 
    name: 'Isha Singh', 
    rollNo: '02',
    class: 'X-A',
    section: 'A',
    admissionNo: 'ADM2025002',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
];

const generateDummyAttendance = () => {
  const result = {};

  dummyStudents.forEach((student) => {
    const records = {};
    const start = new Date('2025-01-01');
    const end = new Date('2025-12-31');

    // Generate some typical patterns - more absences on Mondays,
    // better attendance mid-semester, etc.
    while (start <= end) {
      const isoDate = start.toISOString().split('T')[0];
      const dayOfWeek = start.getDay();
      const month = start.getMonth();
      
      let presentChance = 0.9; // Base chance of being present
      
      // Mondays have higher absence rate
      if (dayOfWeek === 1) presentChance -= 0.2;
      
      // Middle of semesters have better attendance
      if ((month >= 2 && month <= 4) || (month >= 8 && month <= 10)) {
        presentChance += 0.05;
      }
      
      // End of semesters have more leaves
      if (month === 5 || month === 11) {
        presentChance -= 0.1;
      }

      const rand = Math.random();
      if (rand < presentChance) records[isoDate] = 'Present';
      else if (rand < presentChance + 0.08) records[isoDate] = 'Absent';
      else records[isoDate] = 'Leave';

      start.setDate(start.getDate() + 1);
    }

    result[student.id] = records;
  });

  return result;
};

const dummyAttendanceData = generateDummyAttendance();

const AttendanceSummary = () => {
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    const student = dummyStudents.find(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.rollNo === query ||
        s.admissionNo.toLowerCase() === query.toLowerCase()
    );
    setSelectedStudent(student || null);
  };

  const getAttendanceSummary = (records) => {
    const totalDays = Object.keys(records).length;
    const presentDays = Object.values(records).filter((v) => v === 'Present').length;
    const absentDays = Object.values(records).filter((v) => v === 'Absent').length;
    const leaveDays = Object.values(records).filter((v) => v === 'Leave').length;
    const percent = (presentDays / totalDays) * 100;
    
    return { 
      totalDays, 
      presentDays, 
      absentDays, 
      leaveDays, 
      percent: percent.toFixed(1) 
    };
  };

  const groupByMonth = (records) => {
    const grouped = {};
    for (const date in records) {
      const month = date.slice(0, 7); // YYYY-MM
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push({ date, status: records[date] });
    }
    return grouped;
  };

  // Get days of week for a month
  const getDaysOfWeek = (month) => {
    const result = [];
    const date = new Date(`${month}-01`);
    const year = date.getFullYear();
    const monthNum = date.getMonth();
    
    // Get first day of month
    date.setDate(1);
    const firstDay = date.getDay();
    
    // Add empty cells for days before the first of month
    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }
    
    // Add all days in month
    const daysInMonth = new Date(year, monthNum + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, monthNum, i);
      result.push(currentDate.toISOString().split('T')[0]);
    }
    
    return result;
  };

  const statusColor = {
    Present: 'bg-green-500',
    Absent: 'bg-red-500',
    Leave: 'bg-blue-400',
  };

  const statusStyle = {
    Present: 'bg-green-100 text-green-800 border-green-500',
    Absent: 'bg-red-100 text-red-800 border-red-500',
    Leave: 'bg-blue-100 text-blue-800 border-blue-500',
  };

  const getStatusLevel = (percent) => {
    if (percent >= 90) return 'text-green-600';
    if (percent >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Student Attendance Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-red-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Leave</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name, roll no or admission no"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Search
            </button>
          </div>

          {selectedStudent ? (
            <>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0">
                  <img 
                    src={selectedStudent.photo} 
                    alt={selectedStudent.name}
                    className="w-20 h-20 rounded-full border-2 border-gray-300" 
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {selectedStudent.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Roll No</span>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedStudent.rollNo}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Class</span>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedStudent.class}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Section</span>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedStudent.section}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Admission No</span>
                      <p className="font-medium text-gray-800 dark:text-white">{selectedStudent.admissionNo}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Academic Year</span>
                      <p className="font-medium text-gray-800 dark:text-white">2025</p>
                    </div>
                  </div>
                </div>
              </div>

              {(() => {
                const studentAttendance = dummyAttendanceData[selectedStudent.id];
                const summary = getAttendanceSummary(studentAttendance);
                const monthlyData = groupByMonth(studentAttendance);

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attendance Rate</div>
                        <div className={`text-2xl font-bold ${getStatusLevel(summary.percent)}`}>
                          {summary.percent}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${summary.percent}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Present Days</div>
                        <div className="text-2xl font-bold text-green-600">{summary.presentDays}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          of {summary.totalDays} days
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Absent Days</div>
                        <div className="text-2xl font-bold text-red-600">{summary.absentDays}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {((summary.absentDays / summary.totalDays) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Leave Days</div>
                        <div className="text-2xl font-bold text-blue-600">{summary.leaveDays}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {((summary.leaveDays / summary.totalDays) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Yearly Attendance Calendar
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(monthlyData).map(([month, days]) => {
                        const daysOfWeek = getDaysOfWeek(month);
                        const formattedMonth = new Date(month + '-01').toLocaleString('default', {
                          month: 'long',
                          year: 'numeric',
                        });
                        
                        return (
                          <div key={month} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                            <h5 className="text-md font-medium text-gray-800 dark:text-white mb-3">
                              {formattedMonth}
                            </h5>
                            
                            <div className="grid grid-cols-7 gap-1 mb-1">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1">
                              {daysOfWeek.map((dateStr, idx) => {
                                if (!dateStr) {
                                  return <div key={`empty-${idx}`} className="w-6 h-6"></div>;
                                }
                                
                                const dayInfo = days.find(d => d.date === dateStr);
                                if (!dayInfo) {
                                  return (
                                    <div 
                                      key={dateStr} 
                                      className="w-6 h-6 flex items-center justify-center text-xs text-gray-400"
                                    >
                                      {new Date(dateStr).getDate()}
                                    </div>
                                  );
                                }
                                
                                return (
                                  <div
                                    key={dateStr}
                                    className={`w-6 h-6 rounded-sm ${statusColor[dayInfo.status]} flex items-center justify-center text-xs text-white font-medium`}
                                    title={`${dateStr}: ${dayInfo.status}`}
                                  >
                                    {new Date(dateStr).getDate()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Recent Attendance Records
                      </h4>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Date</th>
                              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Day</th>
                              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(studentAttendance)
                              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                              .slice(0, 10)
                              .map(([date, status]) => (
                                <tr key={date} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-2 px-4 text-sm text-gray-800 dark:text-white">
                                    {new Date(date).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </td>
                                  <td className="py-2 px-4 text-sm text-gray-800 dark:text-white">
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                                  </td>
                                  <td className="py-2 px-4">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyle[status]}`}>
                                      {status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                Search for a student to view their attendance summary
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Try searching with name, roll number, or admission number
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;