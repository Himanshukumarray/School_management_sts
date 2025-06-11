import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios/axiosinstance";
import { format, parseISO, differenceInDays } from "date-fns";

interface BookIssue {
  id: number;
  bookId: number;
  studentId: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  fine: number;
  instruction: string | null;
}

const IssuedBooks: React.FC = () => {
  const [books, setBooks] = useState<BookIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState("1"); // default for testing
  const [showSubmitted, setShowSubmitted] = useState(false);

  const tenant = sessionStorage.getItem("tenant");
  const token = sessionStorage.getItem("token");

  const headers = {
    tenant,
    Authorization: `Bearer ${token}`,
  };

  const fetchIssuedBookById = async (bookId: number) => {
    try {
      const res = await axiosInstance.get(`/library/books/${bookId}/issues`, { headers });
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching book issues by Book ID:", error);
      alert("Failed to fetch book issues. Check console for details.");
    }
  };

  

  const handleSubmitBook = async (index: number) => {
    const book = books[index];
    try {
      await axiosInstance.post(`/library/books/return/${book.id}`, {}, { headers });
      alert("Book marked as returned successfully.");
      fetchIssuedBookById(book.bookId); 
    } catch (error) {
      console.error("Error submitting return:", error);
    }
  };

  // Add calculated fine if book not returned
  const booksWithCalculatedFine = books.map((book) => {
    if (!book.returnDate) {
      const due = parseISO(book.dueDate);
      const today = new Date();
      const lateDays = differenceInDays(today, due);
      return {
        ...book,
        fine: lateDays > 0 ? lateDays * 5 : 0,
      };
    }
    return book;
  });

  const filteredBooks = booksWithCalculatedFine.filter(
    (b) =>
      !b.returnDate &&
      (b.studentId.toString().includes(searchTerm) || b.bookId.toString().includes(searchTerm))
  );

  const filteredSubmittedBooks = booksWithCalculatedFine.filter(
    (b) =>
      b.returnDate &&
      (b.studentId.toString().includes(searchTerm) || b.bookId.toString().includes(searchTerm))
  );
  useEffect(() => {
    const id = parseInt(searchTerm);
    if (!isNaN(id)) {
      fetchIssuedBookById(id);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 text-black dark:text-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Issued Books Overview</h1>

      <div className="mb-6 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search by Book ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <button
          onClick={() => {
            const id = parseInt(searchTerm.trim());
            if (!isNaN(id) && id > 0) {
              fetchIssuedBookById(id);
            } else {
              alert("Please enter a valid numeric Book ID to search.");
            }
          }}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Search Book ID
        </button>
        
      </div>

      {showSubmitted ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Submitted Books</h2>
          {filteredSubmittedBooks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No matching submitted books found.</p>
          ) : (
            filteredSubmittedBooks.map((book, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-lg mb-5 bg-slate-200 dark:bg-gray-700 dark:border-gray-600"
              >
                <p><strong>Book ID:</strong> {book.bookId}</p>
                <p><strong>Student ID:</strong> {book.studentId}</p>
                <p><strong>Issue Date:</strong> {book.issueDate ? format(parseISO(book.issueDate), "dd-MM-yyyy") : "N/A"}</p>
                <p><strong>Due Date:</strong> {book.dueDate ? format(parseISO(book.dueDate), "dd-MM-yyyy") : "N/A"}</p>
                <p><strong>Return Date:</strong> {book.returnDate ? format(parseISO(book.returnDate), "dd-MM-yyyy") : "N/A"}</p>
                <p><strong>Fine:</strong> ₹{book.fine || 0}</p>
                {book.instruction && <p><strong>Instruction:</strong> {book.instruction}</p>}
              </div>
            ))
          )}
        </div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Book ID</th>
              <th className="border p-2">Student ID</th>
              <th className="border p-2">Issue Date</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Return Date</th>
              <th className="border p-2">Fine</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-2 text-center text-gray-600 dark:text-gray-300">
                  No issued books found for this Book ID.
                </td>
              </tr>
            ) : (
              filteredBooks.map((book, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{book.bookId}</td>
                  <td className="border p-2">{book.studentId}</td>
                  <td className="border p-2">{format(parseISO(book.issueDate), "dd-MM-yyyy")}</td>
                  <td className="border p-2">{format(parseISO(book.dueDate), "dd-MM-yyyy")}</td>
                  <td className="border p-2">
                    <input
                      className="p-2 border"
                    />
                    {book.returnDate || ""}
                  </td>
                  <td className="border p-2">₹{book.fine || 0}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleSubmitBook(idx)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Bottom messages */}
      {books.length === 0 && searchTerm && (
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          No books found for Book ID: {searchTerm}
        </p>
      )}
      {!searchTerm && (
        <p className="text-gray-600 dark:text-gray-300">
          Please enter a Book ID to search for issued books.
        </p>
      )}
    </div>
  );
};

export default IssuedBooks;
