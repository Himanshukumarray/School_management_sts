import React, { useState, useEffect, ChangeEvent } from "react";
import axiosInstance from "../../axios/axiosinstance";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  bookCode: string;
  edition: string;
  publisher: string;
  category: string;
  language: string;
  shelfNumber: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
  purchaseDate: string;
  subject: string;
}

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
       
        const response = await axiosInstance.get("/library/books", {
          headers: {
            "tenant": sessionStorage.getItem('tenant') ,
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        });
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBooks = books.filter((book) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      book.title?.toLowerCase().includes(searchLower) ||
      book.author?.toLowerCase().includes(searchLower) ||
      book.publisher?.toLowerCase().includes(searchLower) ||
      book.category?.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(new Set(books.map((book) => book.category))).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">Library Book List</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title, author, publisher, category..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded"
        />

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded"
        >
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="border dark:border-gray-700 p-4 rounded shadow bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Book Code:</strong> {book.bookCode}</p>
                <p><strong>Edition:</strong> {book.edition}</p>
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Category:</strong> {book.category}</p>
                <p><strong>Language:</strong> {book.language}</p>
                <p><strong>Shelf:</strong> {book.shelfNumber}</p>
                <p><strong>Total Copies:</strong> {book.totalCopies}</p>
                <p><strong>Available Copies:</strong> {book.availableCopies}</p>
                <p className="mt-2"><strong>Description:</strong> {book.description}</p>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <p className="mt-4 text-red-500">No books found matching the search.</p>
          )}
        </>
      )}
    </div>
  );
};

export default BookListPage;