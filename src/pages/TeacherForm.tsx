import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Teacher {
  name: string;
  role: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  password: string;
   tenantId: string;
}

const initialState: Teacher = {
  name: '',
  role: '',
  position: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  tenantId: '',
};

const TeacherForm: React.FC = () => {
  const [formData, setFormData] = useState<Teacher>(initialState);

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
    const response = await axios.post(
      'http://localhost:8080/api/teachers',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'tenant': tenant, // ✅ fixed this
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      alert('Teacher added successfully!');
      setFormData(initialState);
    } else {
      alert(`Failed to add teacher. Status: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error:', error);
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    alert(`Error: ${message}`);
  }
};





  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'role', label: 'Role' },
    { name: 'position', label: 'Position' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'address', label: 'Address' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'tenantId', label: 'Tenant ID' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-black text-black dark:text-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Teacher</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="mb-1 text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name as keyof Teacher]}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white p-2 rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-full mt-4 bg-green-600 dark:bg-green-500 text-white py-2 rounded hover:bg-green-700 dark:hover:bg-green-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;
