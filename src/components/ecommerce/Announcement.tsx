import React, { useState } from 'react';

interface Notification {
  id: number;
  message: string;
  date: string;
}

const initialNotifications = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  message: `This is notification message number ${i + 1}`,
  date: new Date().toLocaleDateString(),
}));

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [nextId, setNextId] = useState<number>(initialNotifications.length + 1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState<string>('');

  const handleAddClick = () => setIsAdding(true);
  const handleCancel = () => {
    setIsAdding(false);
    setNewMessage('');
    setMenuOpenId(null);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const newNotif: Notification = {
      id: nextId,
      message: newMessage.trim(),
      date: new Date().toLocaleDateString(),
    };
    setNotifications([newNotif, ...notifications]);
    setNextId(nextId + 1);
    handleCancel();
  };

  const startEdit = (id: number, currentMessage: string) => {
    setEditingId(id);
    setEditingMessage(currentMessage);
    setMenuOpenId(null);
  };

  const saveEdit = (id: number) => {
    setNotifications(
      notifications.map(n => n.id === id ? { ...n, message: editingMessage } : n)
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingMessage('');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this announcement?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
    setMenuOpenId(null);
  };

  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mt-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Announcement</h2>
        {!isAdding && (
          <button
            onClick={handleAddClick}
            className="px-3 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            New Announcement
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4">
          <form onSubmit={handleSubmit} className="mb-4">
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-2 mb-2 placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
              placeholder="Enter announcement message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </form>
          <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">Previous Announcements</h4>
          <div className="max-h-40 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="relative mb-2 p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                {editingId === notif.id ? (
                  <div className="flex space-x-2">
                    <input
                      className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-1"
                      value={editingMessage}
                      onChange={(e) => setEditingMessage(e.target.value)}
                    />
                    <button
                      onClick={() => saveEdit(notif.id)}
                      className="px-2 py-1 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm flex-1">{notif.message}</p>
                    {/* Context menu icon */}
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === notif.id ? null : notif.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                      </svg>
                    </button>
                    {menuOpenId === notif.id && (
                      <div className="absolute top-6 right-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                        <button onClick={() => startEdit(notif.id, notif.message)} className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(notif.id)} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAdding && (
        <div className="overflow-y-auto max-h-80">
          {notifications.map((notif) => (
            <div key={notif.id} className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="text-sm text-gray-800 dark:text-gray-100">{notif.message}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">{notif.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
