import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Plus, Edit, Eye, Save, X } from 'lucide-react';
import axiosInstance from '../axios/axiosinstance';

interface Syllabus {
  id: number;
  classId: number;
  semester: number;
  subject: string;
  syllabusContent: string;
}

interface SyllabusFormData {
  classId: number;
  semester: number;
  subject: string;
  syllabusContent: string;
}

const SyllabusManagement: React.FC = () => {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<SyllabusFormData>({
    classId: 1,
    semester: 1,
    subject: '',
    syllabusContent: ''
  });

  // Filter states
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  // Get user role from session/localStorage (implement based on your auth system)
  const getUserRole = (): string => {
    // Replace this with your actual session/auth logic
    const userRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
    return userRole || 'student'; // Default to student if no role found
  };

  const [userRole] = useState<string>(getUserRole());
  const isAdminOrTeacher = userRole === 'admin' || userRole === 'teacher';

  // Fetch syllabi based on class and semester
  const fetchSyllabi = async (classId: number, semester: number) => {
    setLoading(true);
    setError(null);
    
    try {
      
      
      const response = await axiosInstance.get(
        `/syllabus/class/${classId}/semester/${semester}`,
        {
            headers: {
          tenant: sessionStorage.getItem('tenant'),
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          }
        }
      );
      
      setSyllabi(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch syllabi');
      setSyllabi([]);
    } finally {
      setLoading(false);
    }
  };

  // Create or update syllabus
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
        await axiosInstance.post(
          '/syllabus',
          formData,
          {
            headers: {
          tenant: sessionStorage.getItem('tenant'),
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        }
          }
        );
        setSuccess('Syllabus created successfully!');
      

      // Reset form and refresh data
      resetForm();
      fetchSyllabi(selectedClass, selectedSemester);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save syllabus');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      classId: selectedClass,
      semester: selectedSemester,
      subject: '',
      syllabusContent: ''
    });
    setShowForm(false);
   
  };

 

  const handleAddNew = () => {
  
    setFormData({
      classId: selectedClass,
      semester: selectedSemester,
      subject: '',
      syllabusContent: ''
    });
    setShowForm(true);
  };

  // Load syllabi on component mount and when filters change
  useEffect(() => {
    fetchSyllabi(selectedClass, selectedSemester);
  }, [selectedClass, selectedSemester]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
             
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Syllabus Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isAdminOrTeacher ? 'Manage and view syllabi' : 'View syllabi'} for classes and semesters
                </p>
              </div>
            </div>
            
            {isAdminOrTeacher && (
              <button
                onClick={handleAddNew}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>Add Syllabus</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(classNum => (
                  <option key={classNum} value={classNum}>Class {classNum}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Form Modal */}
        {showForm && isAdminOrTeacher && (
          <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
               

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Class *
                      </label>
                      <select
                        value={formData.classId}
                        onChange={(e) => setFormData({...formData, classId: Number(e.target.value)})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(classNum => (
                          <option key={classNum} value={classNum}>Class {classNum}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Semester *
                      </label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value={1}>Semester 1</option>
                        <option value={2}>Semester 2</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      placeholder="Enter subject name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Syllabus Content *
                    </label>
                    <textarea
                      value={formData.syllabusContent}
                      onChange={(e) => setFormData({...formData, syllabusContent: e.target.value})}
                      required
                      rows={6}
                      placeholder="Enter detailed syllabus content"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-vertical"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Syllabi List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Syllabi for Class {selectedClass} - Semester {selectedSemester}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading syllabi...</span>
              </div>
            ) : syllabi.length === 0 ? (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No syllabi found for Class {selectedClass} - Semester {selectedSemester}
                </p>
                {isAdminOrTeacher && (
                  <button
                    onClick={handleAddNew}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Add the first syllabus
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {syllabi.map((syllabus) => (
                  <div
                    key={syllabus.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {syllabus.subject}
                          </h3>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            Class {syllabus.classId} - Sem {syllabus.semester}
                          </span>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {syllabus.syllabusContent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusManagement;