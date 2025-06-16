import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Users, GraduationCap, AlertCircle, Loader2, RefreshCw, Edit3, Shield, Building2 } from 'lucide-react';
import axiosInstance from '../axios/axiosinstance';

interface TeacherProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  position: string;
}

interface StudentProfile {
  id: number;
  studentAdmissionId: string;
  studentClassRollNo: string;
  admissionDate: string;
  name: string;
  email: string;
  password: string;
  address: string;
  mobile: string;
  parentRelation: string;
  currentClass: string;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
  role: string;
}

const UserProfiles: React.FC = () => {
  const [profile, setProfile] = useState<TeacherProfile | StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const userRole = sessionStorage.getItem('userRole');
  const userId = sessionStorage.getItem('userId');
  const tenant = sessionStorage.getItem('tenant');
  const token = sessionStorage.getItem('token');

  const headers = {
    tenant: tenant || '',
    Authorization: `Bearer ${token}`,
  };

  const fetchProfile = useCallback(async (isRefresh = false) => {
    if (!userRole || !userId || !token) {
      setError('Authentication required. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await axiosInstance.get(
        `/students/details`,
        {
          headers,
          params: { role: userRole, id: userId },
          timeout: 10000,
        }
      );
      
      if (response.data) {
        setProfile(response.data);
      } else {
        setError('No profile data found.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('Access denied. Insufficient permissions.');
        } else if (err.response?.status === 404) {
          setError('Profile not found.');
        } else if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Please try again.');
        } else {
          setError(err.response?.data?.message || 'Unable to load profile data. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userRole, userId, token, tenant]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleRefresh = () => {
    fetchProfile(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getFieldIcon = (fieldType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      name: <User className="w-5 h-5" />,
      email: <Mail className="w-5 h-5" />,
      phone: <Phone className="w-5 h-5" />,
      mobile: <Phone className="w-5 h-5" />,
      address: <MapPin className="w-5 h-5" />,
      date: <Calendar className="w-5 h-5" />,
      id: <CreditCard className="w-5 h-5" />,
      parent: <Users className="w-5 h-5" />,
      class: <GraduationCap className="w-5 h-5" />,
      role: <Shield className="w-5 h-5" />,
      position: <Building2 className="w-5 h-5" />,
    };
    return iconMap[fieldType] || <User className="w-5 h-5" />;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'teacher':
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-sm rounded-xl p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h3>
                <p className="text-gray-600">Please wait while we fetch your information...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-sm rounded-xl p-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="p-4 bg-red-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Unable to Load Profile</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => fetchProfile()}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-sm rounded-xl p-12">
            <div className="text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Data</h3>
              <p className="text-gray-600">No profile information is currently available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isTeacher = userRole === 'teacher';
  const isStudent = userRole === 'student';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.name || 'User Profile'}
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(profile.role)}`}>
                      {getFieldIcon('role')}
                      <span className="ml-2 capitalize">{profile.role || userRole}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField 
                    label="Full Name" 
                    value={profile.name} 
                    icon={getFieldIcon('name')}
                  />
                  <ProfileField 
                    label="Email Address" 
                    value={profile.email} 
                    icon={getFieldIcon('email')}
                  />
                  <ProfileField 
                    label="Role" 
                    value={profile.role} 
                    icon={getFieldIcon('role')}
                    className="capitalize"
                  />
                  {isTeacher && (
                    <ProfileField 
                      label="Position" 
                      value={(profile as TeacherProfile).position} 
                      icon={getFieldIcon('position')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information - Sidebar on desktop */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-gray-500" />
                  Contact Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {isTeacher && (
                  <>
                    <ProfileField 
                      label="Phone" 
                      value={(profile as TeacherProfile).phone} 
                      icon={getFieldIcon('phone')}
                      compact
                    />
                    <ProfileField 
                      label="Address" 
                      value={(profile as TeacherProfile).address} 
                      icon={getFieldIcon('address')}
                      compact
                    />
                  </>
                )}
                {isStudent && (
                  <ProfileField 
                    label="Mobile" 
                    value={(profile as StudentProfile).mobile} 
                    icon={getFieldIcon('mobile')}
                    compact
                  />
                )}
              </div>
            </div>

            {/* Quick Stats for Students */}
            {isStudent && (
              <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                    Quick Info
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <ProfileField 
                    label="Class" 
                    value={(profile as StudentProfile).currentClass} 
                    icon={getFieldIcon('class')}
                    compact
                  />
                  <ProfileField 
                    label="Roll No." 
                    value={(profile as StudentProfile).studentClassRollNo} 
                    icon={getFieldIcon('id')}
                    compact
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student-specific detailed sections */}
        {isStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Academic Details */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                  Academic Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <ProfileField 
                  label="Admission ID" 
                  value={(profile as StudentProfile).studentAdmissionId} 
                  icon={getFieldIcon('id')}
                />
                <ProfileField 
                  label="Admission Date" 
                  value={formatDate((profile as StudentProfile).admissionDate)} 
                  icon={getFieldIcon('date')}
                />
                <ProfileField 
                  label="Current Class" 
                  value={(profile as StudentProfile).currentClass} 
                  icon={getFieldIcon('class')}
                />
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-gray-500" />
                  Parent/Guardian
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <ProfileField 
                  label="Parent Name" 
                  value={(profile as StudentProfile).parentName} 
                  icon={getFieldIcon('parent')}
                />
                <ProfileField 
                  label="Relationship" 
                  value={(profile as StudentProfile).parentRelation} 
                  icon={getFieldIcon('parent')}
                  className="capitalize"
                />
                <ProfileField 
                  label="Parent Mobile" 
                  value={(profile as StudentProfile).parentMobile} 
                  icon={getFieldIcon('phone')}
                />
                <ProfileField 
                  label="Parent Email" 
                  value={(profile as StudentProfile).parentEmail} 
                  icon={getFieldIcon('email')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Address Section for Students */}
        {isStudent && (
          <div className="mt-6">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  Address Information
                </h2>
              </div>
              <div className="p-6">
                <ProfileField 
                  label="Residential Address" 
                  value={(profile as StudentProfile).address} 
                  icon={getFieldIcon('address')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField: React.FC<{ 
  label: string; 
  value?: string; 
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}> = ({ label, value, icon, className = '', compact = false }) => {
  if (compact) {
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <span className={`text-gray-900 text-sm pl-7 ${className}`}>
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-gray-900 pl-7 ${className}`}>
        {value ? (
          <span className="block py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
            {value}
          </span>
        ) : (
          <span className="block py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-400 italic">
            Not provided
          </span>
        )}
      </div>
    </div>
  );
};

export default UserProfiles;