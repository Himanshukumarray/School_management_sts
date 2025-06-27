import React, { useState } from 'react';
import axiosInstance from "../../axios/axiosinstance";

interface Event {
  id: number;
  heading: string;
  subject: string;
  description: string;
  startDate: string;
  endDate: string;
  createdByTeacherId: number;
  status: string;
}

const initialEvents: Event[] = [];

export default function NotificationPanel() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    heading: '',
    subject: '',
    description: '',
    startDate: '',
    endDate: '',
    createdByTeacherId: 1, // Replace with dynamic ID as needed
    status: 'Upcoming',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.heading.trim()) return;

    try {
      const response = await axiosInstance.post('/api/events', newEvent, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          'tenant': sessionStorage.getItem('tenant'),
        },
      });

      const savedEvent: Event = response.data;
      setEvents([savedEvent, ...events]);
      setIsAdding(false);
      setNewEvent({
        heading: '',
        subject: '',
        description: '',
        startDate: '',
        endDate: '',
        createdByTeacherId: 1,
        status: 'Upcoming',
      });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event.');
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mt-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Event Announcements</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="px-3 py-1 bg-blue-500 text-white rounded-lg">
            Add Event
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
          <input name="heading" placeholder="Heading" value={newEvent.heading} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="subject" placeholder="Subject" value={newEvent.subject} onChange={handleChange} className="w-full p-2 border rounded" required />
          <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="date" name="startDate" value={newEvent.startDate} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="date" name="endDate" value={newEvent.endDate} onChange={handleChange} className="w-full p-2 border rounded" required />
          <select name="status" value={newEvent.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option>Upcoming</option>
            <option>Started</option>
            <option>Completed</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      )}

      {/* <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{event.heading}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{event.subject}</p>
            <p className="text-sm">{event.description}</p>
            <p className="text-xs text-gray-500">From {event.startDate} to {event.endDate}</p>
            <span className={`text-xs inline-block px-2 py-1 mt-2 rounded ${event.status === 'Upcoming' ? 'bg-yellow-300' : event.status === 'Started' ? 'bg-blue-300' : 'bg-green-300'}`}>
              {event.status}
            </span>
          </div>
        ))}
      </div> */}
    </div>
  );
}
