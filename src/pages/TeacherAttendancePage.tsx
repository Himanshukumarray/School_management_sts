import React, { useState } from 'react';
import { Calendar, User, Clock, CheckCircle, XCircle, Coffee, Sunset, Send, AlertCircle } from 'lucide-react';

const MarkAttendance: React.FC = () => {
    const [teacherId, setTeacherId] = useState<number | ''>('');
    const [status, setStatus] = useState<string>('Present');
    const [date, setDate] = useState<string>('');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!teacherId || !date) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const response = await fetch('http://localhost:8080/api/attendance/mark?' + 
                new URLSearchParams({
                    teacherId: teacherId.toString(),
                    status: status,
                    date: date
                }), {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResponse(data);
        } catch (err) {
            console.error('Error marking attendance:', err);
            if (err instanceof Error) {
                setError(`Error marking attendance: ${err.message}`);
            } else {
                setError('Error marking attendance. Please try again.');
            }
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

    const getStatusIcon = (statusValue: string) => {
        switch (statusValue) {
            case 'Present':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Absent':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'Leave':
                return <Coffee className="w-5 h-5 text-yellow-500" />;
            case 'Holiday':
                return <Sunset className="w-5 h-5 text-blue-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (statusValue: string) => {
        switch (statusValue) {
            case 'Present':
                return 'from-green-500 to-emerald-500';
            case 'Absent':
                return 'from-red-500 to-pink-500';
            case 'Leave':
                return 'from-yellow-500 to-orange-500';
            case 'Holiday':
                return 'from-blue-500 to-purple-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                        <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Mark Attendance
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Record daily attendance with ease</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-200">
                    <div className="space-y-6">
                        {/* Teacher ID Input */}
                        <div className="group">
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                Teacher ID
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Teacher ID"
                                value={teacherId}
                                onChange={(e) => handleInputChange(setTeacherId, e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        {/* Date Input */}
                        <div className="group">
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                Date
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    max={getTodayDate()}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setDate(getTodayDate())}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                >
                                    Today
                                </button>
                            </div>
                        </div>

                        {/* Status Selection */}
                        <div className="group">
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                {getStatusIcon(status)}
                                <span className="ml-2">Attendance Status</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Present', 'Absent', 'Leave', 'Holiday'].map((statusOption) => (
                                    <button
                                        key={statusOption}
                                        type="button"
                                        onClick={() => setStatus(statusOption)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                            status === statusOption
                                                ? `border-transparent bg-gradient-to-r ${getStatusColor(statusOption)} text-white shadow-lg`
                                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            {getStatusIcon(statusOption)}
                                            <span className="font-medium">{statusOption}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                                loading
                                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                    : `bg-gradient-to-r ${getStatusColor(status)} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Marking Attendance...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Send className="w-5 h-5 mr-2" />
                                    Mark Attendance
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Response */}
                {response && !error && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(status)} rounded-xl flex items-center justify-center mr-4`}>
                                {getStatusIcon(status)}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Attendance Marked Successfully!</h3>
                                <p className="text-gray-600 dark:text-gray-400">Status: <span className="font-medium">{status}</span></p>
                            </div>
                        </div>
                        
                        {/* Response Details */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Response Details:</h4>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(response, null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-4">
                            <button
                                onClick={() => {
                                    setResponse(null);
                                    setTeacherId('');
                                    setDate('');
                                    setStatus('Present');
                                }}
                                className="flex-1 py-2 px-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
                            >
                                Mark Another
                            </button>
                            <button
                                onClick={() => setResponse(null)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;