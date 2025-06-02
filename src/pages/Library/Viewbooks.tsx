import React, { useState } from "react";

import axiosInstance from "../../axios/axiosinstance";
import { format, parseISO, differenceInDays } from "date-fns";

interface BookIssue {
  id: number;
  bookId: number;
  studentId: number;
  studentName: string;
  bookName: string;
  bookCode: string;
  publisher: string;
  issueDate: string;
  returnDate: string;
  actualReturnDate?: string;
  fine: number;
}

const IssuedBooks: React.FC = () => {
  const [books, setBooks] = useState<BookIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  }
};



  const handleActualReturnDateChange = (index: number, date: string) => {
    const updated = [...books];
    updated[index].actualReturnDate = date;
    const due = parseISO(updated[index].returnDate);
    const actual = parseISO(date);
    const lateDays = differenceInDays(actual, due);
    updated[index].fine = lateDays > 0 ? lateDays * 5 : 0;
    setBooks(updated);
  };

  const handleSubmitBook = async (index: number) => {
    const book = books[index];
    try {
      await axiosInstance.post(`/library/books/return/${book.id}`, {}, { headers });
      alert("Book marked as returned successfully.");
    } catch (error) {
      console.error("Error submitting return:", error);
    }
  };

 

 const filteredBooks = books.filter(
  (b) =>
    !b.actualReturnDate &&
    (
      (b.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.bookName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.studentId?.toString().includes(searchTerm))
    )
);

const filteredSubmittedBooks = books.filter(
  (b) =>
    b.actualReturnDate &&
    (
      (b.studentName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.bookName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.studentId?.toString().includes(searchTerm))
    )
);


  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 text-black dark:text-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Issued Books Overview</h1>
        <>
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
      const id = parseInt(searchTerm);
      if (!isNaN(id)) {
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
                    <p><strong>Student:</strong> {book.studentName} ({book.studentId})</p>
                    <p><strong>Book:</strong> {book.bookName} ({book.bookCode})</p>
                    <p><strong>Publisher:</strong> {book.publisher} ({book.bookCode})</p>
                   <p><strong>Issue Date:</strong> {book.issueDate ? format(parseISO(book.issueDate), "dd-MM-yyyy") : "N/A"}</p>
                    <p><strong>Return Date:</strong> {book.returnDate ? format(parseISO(book.returnDate), "dd-MM-yyyy") : "N/A"}</p>
                    <p><strong>Actual Return Date:</strong> {book.actualReturnDate}</p>
                    <p><strong>Fine:</strong> ₹{book.fine || 0}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Student Name</th>
                  <th className="border p-2">Book Name</th>
                  <th className="border p-2">Publisher</th>
                  <th className="border p-2">Issue Date</th>
                  <th className="border p-2">Return Date</th>
                  <th className="border p-2">Actual Return Date</th>
                  <th className="border p-2">Fine</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border p-2 text-center text-gray-600 dark:text-gray-300">
                      No matching books found.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{book.studentName}</td>
                      <td className="border p-2">{book.bookName}</td>
                      <td className="border p-2">{book.publisher}</td>
                      <td className="border p-2">{format(parseISO(book.issueDate), "dd-MM-yyyy")}</td>
                      <td className="border p-2">{format(parseISO(book.returnDate), "dd-MM-yyyy")}</td>
                      <td className="border p-2">
                        <input
                          type="date"
                          value={book.actualReturnDate || ""}
                          onChange={(e) => handleActualReturnDateChange(idx, e.target.value)}
                          className="p-1 border rounded bg-slate-50 dark:bg-gray-700 dark:text-white"
                        />
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
        </>
      

      {!searchTerm && <p className="text-gray-600 dark:text-gray-300">Please enter a search term to filter books.</p>}
    </div>
  );
};

export default IssuedBooks;
