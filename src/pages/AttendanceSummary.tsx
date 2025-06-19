import React, { useState } from 'react';
import { Calendar, User, TrendingUp, Clock, CheckCircle, XCircle, Coffee, Sunset } from 'lucide-react';
import axiosInstance from '../axios/axiosinstance';

interface Summary {
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    holidays: number;
}

const AttendanceSummary: React.FC = () => {
    const [teacherId, setTeacherId] = useState<number | ''>('');
    const [year, setYear] = useState<number | ''>('');
    const [month, setMonth] = useState<number | ''>('');
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchSummary = async () => {
        if (!teacherId || !year || !month) {
            setError('Please fill in all fields');
            return;
        }

        if (month < 1 || month > 12) {
            setError('Month must be between 1 and 12');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                teacherId: teacherId.toString(),
                year: year.toString(),
                month: month.toString()
            });
            const response = await axiosInstance.get(`/api/attendance/monthly-summary?${params}`);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;
            setSummary(data);
        } catch (err) {
            console.error('Error fetching attendance summary:', err);
            if (err instanceof Error) {
                setError(`Error fetching summary: ${err.message}`);
            } else {
                setError('Error fetching summary. Please try again.');
            }
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        setter: React.Dispatch<React.SetStateAction<number | ''>>,
        value: string
    ) => {
        const numValue = value === '' ? '' : Number(value);
        setter(numValue);
    };

    const getMonthName = (monthNum: number) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNum - 1];
    };

    const getTotalDays = () => {
        if (!summary) return 0;
        return summary.presentDays + summary.absentDays + summary.leaveDays + summary.holidays;
    };

    const getAttendancePercentage = () => {
        if (!summary) return 0;
        const total = getTotalDays();
        return total > 0 ? Math.round((summary.presentDays / total) * 100) : 0;
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  
                    <h1 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent mb-2">
                        Attendance Analytics
                    </h1>
                    <p className="text-gray-600 text-lg">Track and analyze monthly attendance patterns</p>
                </div>

                {/* Input Form */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
                    <div className="flex items-center mb-6">
                        <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                        <h2 className="text-2xl font-semibold text-gray-800">Generate Report</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                Teacher ID
                            </label>
                            <input
                                type="number"
                                placeholder="Enter ID"
                                value={teacherId}
                                onChange={(e) => handleInputChange(setTeacherId, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:shadow-md"
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                Year
                            </label>
                            <input
                                type="number"
                                placeholder="2024"
                                value={year}
                                onChange={(e) => handleInputChange(setYear, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:shadow-md"
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                Month
                            </label>
                            <input
                                type="number"
                                placeholder="1-12"
                                value={month}
                                onChange={(e) => handleInputChange(setMonth, e.target.value)}
                                min="1"
                                max="12"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:shadow-md"
                            />
                        </div>
                    </div>

                    <button
                        onClick={fetchSummary}
                        disabled={loading}
                        className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:from-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Generating Report...
                            </div>
                        ) : (
                            'Generate Attendance Report'
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
                        <div className="flex items-center">
                            <XCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Summary Results */}
                {summary && (
                    <div className="space-y-6">
                        {/* Header Card */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {getMonthName(Number(month))} {year} Report
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">Live Data</span>
                                </div>
                            </div>
                            
                            {/* Attendance Percentage */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Overall Attendance</p>
                                        <p className="text-3xl font-bold text-green-600">{getAttendancePercentage()}%</p>
                                    </div>
                                    <div className="text-green-500">
                                        <CheckCircle className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="mt-3 bg-white rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-1000 ease-out"
                                        style={{ width: `${getAttendancePercentage()}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Present Days */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 font-medium">Present Days</p>
                                        <p className="text-3xl font-bold text-green-600">{summary.presentDays}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-green-100 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(summary.presentDays / getTotalDays()) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Absent Days */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <XCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 font-medium">Absent Days</p>
                                        <p className="text-3xl font-bold text-red-600">{summary.absentDays}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-red-100 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(summary.absentDays / getTotalDays()) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Leave Days */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                        <Coffee className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 font-medium">Leave Days</p>
                                        <p className="text-3xl font-bold text-yellow-600">{summary.leaveDays}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-yellow-100 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(summary.leaveDays / getTotalDays()) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Holidays */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                        <Sunset className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 font-medium">Holidays</p>
                                        <p className="text-3xl font-bold text-blue-600">{summary.holidays}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-blue-100 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(summary.holidays / getTotalDays()) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Overview</h4>
                            <div className="grid md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <p className="text-sm text-blue-700 font-medium">Total Days</p>
                                    <p className="text-2xl font-bold text-blue-600">{getTotalDays()}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <p className="text-sm text-green-700 font-medium">Working Days</p>
                                    <p className="text-2xl font-bold text-green-600">{summary.presentDays + summary.absentDays + summary.leaveDays}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                    <p className="text-sm text-purple-700 font-medium">Attendance Rate</p>
                                    <p className="text-2xl font-bold text-purple-600">{getAttendancePercentage()}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AttendanceSummary;
