import React, { useEffect, useState } from "react"; 
import axiosInstance from "../../axios/axiosinstance";
import { format } from "date-fns";

type Book = {
  id: number;
  title: string;
};

type BookEntry = {
  bookId: number | null;
  bookName: string;
  issueDate: string;
  returnDate: string;
};

const LibraryIssuePage: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<BookEntry[]>([
    {
      bookId: null,
      bookName: "",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      returnDate: "",
    },
  ]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axiosInstance.get("/api/library/books", {
          headers: {
            "tenant": sessionStorage.getItem('tenant'),
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setAllBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      }
    };

    fetchBooks();
  }, []);

  const handleStudentIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setStudentId(id);
    
    if (id.trim() === "") {
      setStudentName("");
      return;
    }

    try {
      const res = await axiosInstance.get(`/api/students/${id}`, {
        headers: {
          "tenant": sessionStorage.getItem('tenant'),
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      setStudentName(res.data.name || "");
    } catch (err) {
      console.error("Failed to fetch student", err);
      setStudentName("");
    }
  };

  const handleBookIdChange = async (index: number, bookId: string) => {
    const updatedBooks = [...books];
    
    if (bookId.trim() === "") {
      updatedBooks[index].bookId = null;
      updatedBooks[index].bookName = "";
      setBooks(updatedBooks);
      return;
    }

    const parsedId = parseInt(bookId, 10);
    if (isNaN(parsedId)) {
      updatedBooks[index].bookId = null;
      updatedBooks[index].bookName = "";
      setBooks(updatedBooks);
      return;
    }

    updatedBooks[index].bookId = parsedId;

    try {
      const res = await axiosInstance.get(`/api/library/books/${parsedId}`, {
        headers: {
          "tenant": sessionStorage.getItem('tenant'),
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
      });
      updatedBooks[index].bookName = res.data.title || "";
    } catch (err) {
      console.error("Failed to fetch book", err);
      updatedBooks[index].bookName = "";
    }

    setBooks(updatedBooks);
  };

  const handleBookChange = (index: number, field: string, value: string) => {
    const updatedBooks = [...books];

    if (field === "bookId") {
      handleBookIdChange(index, value);
      return;
    }

    (updatedBooks[index] as any)[field] = value;
    setBooks(updatedBooks);
  };

  const addBook = () => {
    setBooks([
      ...books,
      {
        bookId: null,
        bookName: "",
        issueDate: format(new Date(), "yyyy-MM-dd"),
        returnDate: "",
      },
    ]);
  };

  const removeBook = (index: number) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const handleSubmit = async () => {
    const tenant = sessionStorage.getItem('tenant');
    const token = sessionStorage.getItem('token');

    if (!studentId) {
      alert("Please enter a Student ID");
      return;
    }

    const validBooks = books.filter(book => book.bookId !== null);
    if (validBooks.length === 0) {
      alert("Please add at least one valid book");
      return;
    }

    try {
      for (const book of validBooks) {
        await axiosInstance.post(
          `/api/library/books/${book.bookId}/issue`,
          null,
          {
            params: { studentId: parseInt(studentId, 10), bookId: book.bookId },
            headers: {
              'tenant': tenant,
              'Authorization': 'Bearer ' + token
            },
          }
        );
      }

      alert("Books issued successfully!");
      setStudentId("");
      setStudentName("");
      setBooks([
        {
          bookId: null,
          bookName: "",
          issueDate: format(new Date(), "yyyy-MM-dd"),
          returnDate: "",
        },
      ]);
    } catch (err) {
      console.error("Error issuing books", err);
      alert("Failed to issue books.");
    }
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
          className="relative border p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 space-y-4"
        >
          {books.length > 1 && (
            <button
              onClick={() => removeBook(index)}
              className="absolute top-2 right-2 text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          )}

          <div>
            <label className="block font-medium">Book ID</label>
            <input
              type="text"
              value={book.bookId || ''}
              onChange={(e) =>
                handleBookChange(index, "bookId", e.target.value)
              }
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-500 dark:text-white"
              placeholder="Enter Book ID"
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
              {format(new Date(book.issueDate), "dd-MM-yyyy")} to{" "}
              {book.returnDate ? format(new Date(book.returnDate), "dd-MM-yyyy") : "--"}
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
};

export default LibraryIssuePage;