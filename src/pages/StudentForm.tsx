import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Student {
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
  tenantId: string;
}

const initialState: Student = {
  studentAdmissionId: '',
  studentClassRollNo: '',
  admissionDate: '',
  name: '',
  email: '',
  password: '',
  address: '',
  mobile: '',
  parentRelation: '',
  currentClass: '',
  parentName: '',
  parentMobile: '',
  parentEmail: '',
  tenantId: '',
};

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<Student>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Student added successfully!');
        setFormData(initialState);
      } else {
        alert('Failed to add student.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fields = [
    { name: 'studentAdmissionId', label: 'Admission ID' },
    { name: 'studentClassRollNo', label: 'Class Roll No' },
    { name: 'admissionDate', label: 'Admission Date', type: 'date' },
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'address', label: 'Address' },
    { name: 'mobile', label: 'Mobile' },
    { name: 'parentRelation', label: 'Parent Relation' },
    { name: 'currentClass', label: 'Current Class' },
    { name: 'parentName', label: 'Parent Name' },
    { name: 'parentMobile', label: 'Parent Mobile' },
    { name: 'parentEmail', label: 'Parent Email' },
    { name: 'tenantId', label: 'Tenant ID' },
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
              required
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
