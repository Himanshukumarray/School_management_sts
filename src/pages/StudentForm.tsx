import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import axiosInstance from '../axios/axiosinstance';

interface Student {
  studentAdmissionId: string;
  studentClassRollNo: string;
  admissionDate: string;
  name: string;
  dob : string;
  email: string;
  password: string;
  address: string;
  mobile: string;
  parentRelation: string;
  currentClass: string;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
}

const initialState: Student = {
  studentAdmissionId: '',
  studentClassRollNo: '',
  admissionDate: '',
  name: '',
  dob: '',
  email: '',
  password: '',
  address: '',
  mobile: '',
  parentRelation: '',
  currentClass: '',
  parentName: '',
  parentMobile: '',
  parentEmail: '',
};

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<Student>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const token = sessionStorage.getItem('token');
  const tenant = sessionStorage.getItem('tenant');

  if (!token || !tenant) {
    alert('You are not authorized. Please log in first.');
    return;
  }

  try {
    const response = await axiosInstance.post(
      '/students',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'tenant': tenant, 
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      alert('Student added successfully!');
      setFormData(initialState);
    } else {
      alert(`Failed to add Student. Status: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error:', error);
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    alert(`Error: ${message}`);
  }
};

  const fields = [
    { name: 'studentAdmissionId', label: 'Admission ID' },
    { name: 'studentClassRollNo', label: 'Class Roll No' },
    { name: 'admissionDate', label: 'Admission Date', type: 'date' },
    { name: 'name', label: 'Name' },
    { name: 'dob', label: 'DOB',type: 'date' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address' },
    { name: 'mobile', label: 'Mobile' },
    { name: 'currentClass', label: 'Current Class' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'parentName', label: 'Parent Name' },
    { name: 'parentRelation', label: 'Parent Relation' },
    { name: 'parentMobile', label: 'Parent Mobile' },
    { name: 'parentEmail', label: 'Parent Email' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-black text-black dark:text-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="mb-1 text-sm font-medium">
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              name={field.name}
              id={field.name}
              value={formData[field.name as keyof Student]}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white p-2 rounded"
              // required
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-full mt-4 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
