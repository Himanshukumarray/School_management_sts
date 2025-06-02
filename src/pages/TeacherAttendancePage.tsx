import React, { useState, useEffect } from 'react';
import { User, Calendar, CheckCircle, Clock } from 'lucide-react';
import axiosInstance from '../axios/axiosinstance';

interface AttendanceRecord {
  id: number;
  teacherId: number;
  date: string;
  status: string;
}

const TeacherAttendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isMarked, setIsMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState('Sarah Johnson');
  const [teacherId, setTeacherId] = useState<number | null>(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedTeacherId = sessionStorage.getItem('userId');
    const storedTeacherName = sessionStorage.getItem('userName');
    
    if (storedTeacherId) {
      setTeacherId(parseInt(storedTeacherId));
    }
    if (storedTeacherName) {
      setTeacherName(storedTeacherName);
    }

    checkTodayAttendance();
    fetchAttendanceRecords();
  }, [teacherId]);

  const getHeaders = () => ({
    'tenant': sessionStorage.getItem('tenant') || '',
    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    'Content-Type': 'application/json'
  });

  const checkTodayAttendance = () => {
    if (!teacherId) return;
    
    const storedRecords = sessionStorage.getItem('attendanceRecords');
    if (storedRecords) {
      const parsed = JSON.parse(storedRecords);
      const todayRecord = parsed.find((r: AttendanceRecord) => 
        r.date === today && r.teacherId === teacherId
      );
      setIsMarked(!!todayRecord);
    }
  };

  const fetchAttendanceRecords = () => {
    if (!teacherId) return;
    
    try {
      const storedRecords = sessionStorage.getItem('attendanceRecords');
      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        setRecords(parsed.filter((r: AttendanceRecord) => r.teacherId === teacherId));
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const markAttendance = async () => {
    if (!teacherId || isMarked || loading) return;

    setLoading(true);
    try {
      await axiosInstance.post(
        `/attendance/mark?teacherId=${teacherId}&status=Present&date=${today}`,
        {},
        {
          headers: getHeaders()
        }
      );
      setIsMarked(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Welcome back, {teacherName}
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(currentTime)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Attendance Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Today's Attendance
              </h2>
              <p className="text-gray-600 text-sm">
                {formatDate(today)}
              </p>
            </div>
          </div>

          {isMarked ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Attendance Marked Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                Thank you for marking your attendance today
              </p>
              <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Present for today</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to mark attendance?
              </h3>
              <p className="text-gray-600 mb-6">
                Click the button below to record your presence for today
              </p>
              <button
                onClick={markAttendance}
                disabled={loading}
                className={`
                  relative overflow-hidden px-8 py-4 rounded-2xl text-white font-semibold text-lg
                  transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loading && (
                  <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <span className={loading ? 'opacity-0' : 'opacity-100'}>
                  Mark My Attendance
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;