import React, { useState, useEffect } from 'react';
import { Users, Search, Calendar, Phone, Mail, MapPin, User } from 'lucide-react';
import axios from 'axios';

interface Student {
    id: number;
    studentAdmissionId: string;
    studentClassRollNo: string;
    admissionDate: string;
    name: string;
    email: string;
    address: string;
    mobile: string;
    parentRelation: string;
    dob: string;
    currentClass: string;
    parentName: string;
    parentMobile: string;
    parentEmail: string;
    tenantId: string;
}

const ViewStudentDetails: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('admin'); // Get from session

    // Available classes
    const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    // Simulate getting role from session
    useEffect(() => {
        // In real app, you would get this from your session management
        const roleFromSession = sessionStorage.getItem('userRole') || 'admin';
        setUserRole(roleFromSession);
    }, []);

    const fetchStudents = async (classValue: string) => {
        if (!classValue) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(
                `http://localhost:8080/api/students/by-class?studentClass=${classValue}&role=${userRole}`,
                {
                    headers: {
                        'tenant': sessionStorage.getItem('tenant') || '',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Student[] = response.data;
            setStudents(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch students');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (classValue: string) => {
        setSelectedClass(classValue);
        if (classValue) {
            fetchStudents(classValue);
        } else {
            setStudents([]);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
                                <p className="text-gray-600 dark:text-gray-300">Manage students by class - Role: {userRole}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <div className="flex-1">
                            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Class
                            </label>
                            <select
                                id="class-select"
                                value={selectedClass}
                                onChange={(e) => handleClassChange(e.target.value)}
                                className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                            >
                                <option value="">Choose a class...</option>
                                {classes.map((cls) => (
                                    <option key={cls} value={cls}>
                                        Class {cls}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading students...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading students</h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Students Table */}
                {!loading && !error && students.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Students in Class {selectedClass} ({students.length} students)
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Student Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Parent Info
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {students.map((student) => (
                                        <tr key={`${student.id}-${student.studentAdmissionId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {student.studentAdmissionId}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Roll: {student.studentClassRollNo}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                        {student.email}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                        {student.mobile}
                                                    </div>
                                                    <div className="flex items-start text-sm text-gray-900 dark:text-white">
                                                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="truncate max-w-xs">{student.address}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.parentName}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">({student.parentRelation})</div>
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                        {student.parentMobile}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                        {student.parentEmail}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                        DOB: {formatDate(student.dob)}
                                                    </div>
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        Admission: {formatDate(student.admissionDate)}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Class: {student.currentClass}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Tenant: {student.tenantId}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && selectedClass && students.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                No students found in Class {selectedClass}.
                            </p>
                        </div>
                    </div>
                )}

                {/* No Class Selected */}
                {!selectedClass && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                        <div className="text-center">
                            <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Select a class</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Choose a class from the dropdown above to view students.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewStudentDetails;