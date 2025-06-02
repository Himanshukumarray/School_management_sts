import React, { useState, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  DateClickArg,
} from '@fullcalendar/interaction';
import axiosInstance from '../axios/axiosinstance';
import { EventClickArg } from '@fullcalendar/core/index.js';

interface EventData {
  id?: number;
  heading: string;
  subject: string;
  description: string;
  startDate: string;
  endDate: string;
  createdByTeacherId: number;
  status: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    heading: '',
    subject: '',
    description: '',
    startDate: '',
    endDate: '',
    createdByTeacherId: sessionStorage.getItem('userId') ? Number(sessionStorage.getItem('userId')) : 1,
    status: 'Upcoming',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/events/status/Upcoming', {
        headers: {
          tenant: sessionStorage.getItem('tenant'),
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        }
      });
      const mapped = res.data.map((event: EventData) => ({
        id: event.id,
        title: event.heading,
        start: event.startDate,
        end: event.endDate,
      }));
      setEvents(mapped);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

 const role = sessionStorage.getItem('userRole');


  const handleDateClick = (arg: DateClickArg) => {
    setFormData({
      heading: '',
      subject: '',
      description: '',
      startDate: arg.dateStr,
      endDate: arg.dateStr,
      createdByTeacherId: 1,
      status: 'Upcoming',
    });
    setEditingId(null);
    setModalOpen(true);
  };

 const handleEventClick = async (clickInfo: EventClickArg) => {
  const id = Number(clickInfo.event.id);
  setIsLoading(true);
  const teacherId = sessionStorage.getItem('userId'); 

  if (!teacherId) {
    console.error('No teacherId found in sessionStorage');
    setIsLoading(false);
    return;
  }

  try {
    const res = await axiosInstance.get(`/events/teacher/${teacherId}`, { 
      headers: {
        tenant: sessionStorage.getItem('tenant') || '',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      } 
    });

    const event = res.data.find((e: EventData) => e.id === id);
    if (event) {
      setFormData(event);
      setEditingId(id);
      setModalOpen(true);
    }
  } catch (error) {
    console.error('Error fetching event details:', error);
  } finally {
    setIsLoading(false);
  }
};


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/events/${editingId}`, formData, {
          headers: {
            tenant: sessionStorage.getItem('tenant'),
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          } 
        });
      } else {
        await axiosInstance.post('/events', formData, {
          headers: {
            tenant: sessionStorage.getItem('tenant'),
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          } 
        });
      }
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (editingId) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(`/events/${editingId}`, { 
          headers: {
            tenant: sessionStorage.getItem('tenant'),
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          } 
        });
        setModalOpen(false);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                School Calendar
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Academic Events & Schedules
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-40 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading...</span>
              </div>
            </div>
          )}
          
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
          />
        </div>
      </div>

      {/* Modal */}
       {role === 'teacher' && modalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40"
            onClick={() => setModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingId ? 'Edit Event' : 'Add New Event'}
                </h3>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter event title"
                    value={formData.heading}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                    placeholder="Add description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
                {editingId && (
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    editingId ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;