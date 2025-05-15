import React, { useState } from "react";
import { format, differenceInDays, parseISO } from "date-fns";

type Student = {
  id: string;
  name: string;
};

type Book = {
  code: string;
  name: string;
};

const dummyStudents: Student[] = [
  { id: "001", name: "robin" },
  { id: "002", name: "himanshu" },
];

const dummyBooks: Book[] = [
  { code: "B101", name: "Atomic Habits" },
  { code: "B102", name: "Clean Code" },
  { code: "B103", name: "The Pragmatic Programmer" },
];

type BookEntry = {
  bookCode: string;
  bookName: string;
  issueDate: string;
  returnDate: string;
 
};



const LibraryIssuePage: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [books, setBooks] = useState<BookEntry[]>([
    {
      bookCode: "",
      bookName: "",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      returnDate: "",
     
    },
  ]);

  const removeBook = (index: number) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setStudentId(id);
    const student = dummyStudents.find((s) => s.id === id);
    setStudentName(student ? student.name : "");
  };

  const handleBookChange = (index: number, field: string, value: string) => {
    const updatedBooks = [...books];
    if (field in updatedBooks[index]) {
      (updatedBooks[index] as any)[field] = value;
    }

    if (field === "bookCode") {
      const book = dummyBooks.find((b) => b.code === value);
      updatedBooks[index].bookName = book ? book.name : "";
    }

    if (field === "returnDate") {
      const dueDate = parseISO(updatedBooks[index].issueDate);
      const returnDate = parseISO(value);
      const lateDays = differenceInDays(returnDate, dueDate) - 14;
     
    }

    setBooks(updatedBooks);
  };

  const addBook = () => {
    setBooks([
      ...books,
      {
        bookCode: "",
        bookName: "",
        issueDate: format(new Date(), "yyyy-MM-dd"),
        returnDate: "",
       
      },
    ]);
  };

  const handleSubmit = () => {
   
    console.log("Student ID:", studentId);
    console.log("Student Name:", studentName);
    console.log("Books Issued:", books);

    setStudentId("");
    setStudentName("");
    setBooks([
      {
        bookCode: "",
        bookName: "",
        issueDate: format(new Date(), "yyyy-MM-dd"),
        returnDate: "",
       
      },
    ]);
  };

  return (
  <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 text-black dark:text-white shadow rounded-lg mt-10">

      <h1 className="text-2xl font-bold mb-4">Library Book Issue</h1>

      <div className="mb-4 dark:bg-grey-600">
        <label className="block font-semibold">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={handleStudentIdChange}
          className="mt-1 w-full border p-2 rounded"
          placeholder="Enter Student ID"
        />
      </div>
      {studentName && (
  <div className="mb-6">
    <label className="block font-semibold">Student Name</label>
    <input
      type="text"
      value={studentName}
      disabled
      className="mt-1 w-full border p-2 rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-500 dark:text-white"
    />
  </div>
)}

<h2 className="text-xl font-semibold mb-3">Books to Issue</h2>
{books.map((book, index) => (
  <div
    key={index}
    className="relative border p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 space-y-4">
     {books.length > 1 && (
      <button
        onClick={() => removeBook(index)}
        className="absolute top-2 right-2 text-red-600 hover:underline text-sm"
      >
        Remove
      </button>
    )}
    <div>
      <label className="block font-medium">Book Code</label>
      <input
        type="text"
        value={book.bookCode}
        onChange={(e) =>
          handleBookChange(index, "bookCode", e.target.value)
        }
        className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-500 dark:text-white"
        placeholder="Enter Book Code"
      />
    </div>

    <div>
      <label className="block font-medium">Book Name</label>
      <input
        type="text"
        value={book.bookName}
        disabled
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-500"
      />
    </div>

    <div>
      <label className="block font-medium">Issue → Return</label>
      <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
        {format(parseISO(book.issueDate), "dd-MM-yyyy")} to{" "}
        {book.returnDate ? format(parseISO(book.returnDate), "dd-MM-yyyy") : "--"}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={book.issueDate}
          onChange={(e) =>
            handleBookChange(index, "issueDate", e.target.value)
          }
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-500 dark:text-white"
        />
        <input
          type="date"
          value={book.returnDate}
          onChange={(e) =>
            handleBookChange(index, "returnDate", e.target.value)
          }
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-500 dark:text-white"
        />
      </div>
    </div>
  </div>
))}

<div className="flex flex-col sm:flex-row gap-4">
  <button
    onClick={addBook}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
  >
    + Add Another Book
  </button>

  <button
    onClick={handleSubmit}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    Submit
  </button>
</div>
</div>

    );
    }

export default LibraryIssuePage;
