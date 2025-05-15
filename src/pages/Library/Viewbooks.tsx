import React, { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";

type IssuedBook = {
  studentId: string;
  publisher: string;
  studentName: string;
  bookCode: string;
  bookName: string;
  issueDate: string;
  returnDate: string;
  actualReturnDate?: string;
  fine?: number;
};

// Dummy data simulating issued books
const dummyIssuedBooks: IssuedBook[] = [
    {
      studentId: "001",
      studentName: "Robin",
      bookCode: "B101",
      bookName: "Atomic Habits",
      issueDate: "2024-04-01",
      returnDate: "2024-04-15",
      publisher: "Penguin Random House",
    },
    {
      studentId: "001",
      studentName: "Robin",
      bookCode: "B102",
      bookName: "Deep Work",
      issueDate: "2024-04-03",
      returnDate: "2024-04-17",
      publisher: "Grand Central Publishing",
    },
    {
      studentId: "001",
      studentName: "Robin",
      bookCode: "B103",
      bookName: "The Lean Startup",
      issueDate: "2024-04-05",
      returnDate: "2024-04-19",
      publisher: "Crown Business",
    },
    {
      studentId: "002",
      studentName: "Himanshu",
      bookCode: "B104",
      bookName: "The Pragmatic Programmer",
      issueDate: "2024-04-05",
      returnDate: "2024-04-19",
      publisher: "Addison-Wesley",
    },
    {
      studentId: "002",
      studentName: "Himanshu",
      bookCode: "B105",
      bookName: "Design Patterns",
      issueDate: "2024-04-08",
      returnDate: "2024-04-22",
      publisher: "Addison-Wesley",
    },
    {
      studentId: "003",
      studentName: "Aisha",
      bookCode: "B106",
      bookName: "Clean Code",
      issueDate: "2024-04-10",
      returnDate: "2024-04-24",
      publisher: "Prentice Hall",
    },
    {
      studentId: "003",
      studentName: "Aisha",
      bookCode: "B107",
      bookName: "Refactoring",
      issueDate: "2024-04-12",
      returnDate: "2024-04-26",
      publisher: "Addison-Wesley",
    },
    {
      studentId: "004",
      studentName: "Daniel",
      bookCode: "B108",
      bookName: "The Mythical Man-Month",
      issueDate: "2024-04-03",
      returnDate: "2024-04-17",
      publisher: "Addison-Wesley",
    },
    {
      studentId: "005",
      studentName: "Meera",
      bookCode: "B109",
      bookName: "Start With Why",
      issueDate: "2024-04-12",
      returnDate: "2024-04-26",
      publisher: "Portfolio",
    },
    {
      studentId: "006",
      studentName: "Arjun",
      bookCode: "B110",
      bookName: "Zero to One",
      issueDate: "2024-04-07",
      returnDate: "2024-04-21",
      publisher: "Crown Business",
    },
    {
      studentId: "007",
      studentName: "Lily",
      bookCode: "B111",
      bookName: "Can't Hurt Me",
      issueDate: "2024-04-15",
      returnDate: "2024-04-29",
      publisher: "Lioncrest Publishing",
    },
    {
      studentId: "008",
      studentName: "Karan",
      bookCode: "B112",
      bookName: "The Lean Startup",
      issueDate: "2024-04-18",
      returnDate: "2024-05-02",
      publisher: "Crown Business",
    },
    {
      studentId: "009",
      studentName: "Sophia",
      bookCode: "B113",
      bookName: "Thinking, Fast and Slow",
      issueDate: "2024-04-20",
      returnDate: "2024-05-04",
      publisher: "Farrar, Straus and Giroux",
    },
    {
      studentId: "010",
      studentName: "Ravi",
      bookCode: "B114",
      bookName: "The Alchemist",
      issueDate: "2024-04-22",
      returnDate: "2024-05-06",
      publisher: "HarperOne",
    },
    {
      studentId: "011",
      studentName: "Neha",
      bookCode: "B115",
      bookName: "The Art of Computer Programming",
      issueDate: "2024-04-25",
      returnDate: "2024-05-09",
      publisher: "Addison-Wesley",
    },
    {
      studentId: "012",
      studentName: "Vikram",
      bookCode: "B116",
      bookName: "Code Complete",
      issueDate: "2024-04-26",
      returnDate: "2024-05-10",
      publisher: "Microsoft Press",
    },
    {
      studentId: "013",
      studentName: "Rina",
      bookCode: "B117",
      bookName: "The Pragmatic Programmer",
      issueDate: "2024-04-28",
      returnDate: "2024-05-12",
      publisher: "Addison-Wesley",
    },
  ];
  
  

const Viewbooks: React.FC = () => {
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(dummyIssuedBooks);
  const [submittedBooks, setSubmittedBooks] = useState<IssuedBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmitted, setShowSubmitted] = useState(false);

  const handleActualReturnDateChange = (index: number, date: string) => {
    const updated = [...issuedBooks];
    updated[index].actualReturnDate = date;

    const expected = parseISO(updated[index].returnDate);
    const actual = parseISO(date);
    const lateDays = differenceInDays(actual, expected);

    updated[index].fine = lateDays > 0 ? lateDays * 5 : 0;
    setIssuedBooks(updated);
  };

  const handleSubmitBook = (index: number) => {
    const updatedIssued = [...issuedBooks];
    const submitted = updatedIssued.splice(index, 1)[0];
    alert(`Book "${submitted.bookName}" has been submitted.`);
    setIssuedBooks(updatedIssued);
    setSubmittedBooks((prev) => [...prev, submitted]);
  };

  const filterBooks = (books: IssuedBook[]) =>
    books.filter(
      (book) =>
        book.studentId.includes(searchTerm) ||
        book.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.bookName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredBooks = filterBooks(issuedBooks);
  const filteredSubmittedBooks = filterBooks(submittedBooks);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 text-black dark:text-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Issued Books Overview</h1>

      <input
        type="text"
        placeholder="Search by student ID, name, or book name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {searchTerm && (
        <>
         <div className="flex justify-between items-center mb-4">
         <button
            onClick={() => setShowSubmitted(!showSubmitted)}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            {showSubmitted ? "Hide Submitted Books" : "Show Submitted Books"}
          </button>
          <button
            onClick={() => setShowSubmitted(!showSubmitted)}
            className="mb-6 bg-purple-600 hover:bg-purple-900 text-white py-2 px-4 rounded"
          >
            Remove student
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
                    <p><strong>Issue Date:</strong> {format(parseISO(book.issueDate), "dd-MM-yyyy")}</p>
                    <p><strong>Return Date:</strong> {format(parseISO(book.returnDate), "dd-MM-yyyy")}</p>
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
                    <td colSpan={7} className="border p-2 text-center text-gray-600 dark:text-gray-300">
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
                      <td className="border p-2">{book.fine || 0}</td>
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
      )}
      {!searchTerm && <p className="text-gray-600 dark:text-gray-300">Please enter a search term to filter books.</p>}
    </div>
  );
};

export default Viewbooks;
