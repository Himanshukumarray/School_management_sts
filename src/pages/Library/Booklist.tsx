import React, { useState, ChangeEvent } from "react";

interface Book {
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
  description: string;
}

const dummyBooks: Book[] = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    bookCode: "B001",
    edition: "1st",
    publisher: "Penguin",
    category: "Self-help",
    language: "English",
    shelfNumber: "S1",
    totalCopies: 5,
    description: "An easy and proven way to build good habits and break bad ones."
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    bookCode: "B002",
    edition: "1st",
    publisher: "Prentice Hall",
    category: "Programming",
    language: "English",
    shelfNumber: "S2",
    totalCopies: 3,
    description: "A Handbook of Agile Software Craftsmanship."
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andy Hunt",
    isbn: "9780201616224",
    bookCode: "B003",
    edition: "2nd",
    publisher: "Addison-Wesley",
    category: "Programming",
    language: "English",
    shelfNumber: "S3",
    totalCopies: 4,
    description: "Your journey to mastery."
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "9781455586691",
    bookCode: "B004",
    edition: "1st",
    publisher: "Grand Central Publishing",
    category: "Productivity",
    language: "English",
    shelfNumber: "S4",
    totalCopies: 2,
    description: "Rules for focused success in a distracted world."
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    bookCode: "B005",
    edition: "3rd",
    publisher: "MIT Press",
    category: "Computer Science",
    language: "English",
    shelfNumber: "S5",
    totalCopies: 6,
    description: "Comprehensive guide to modern algorithm design."
  },
  {
    title: "The Power of Habit",
    author: "Charles Duhigg",
    isbn: "9780812981605",
    bookCode: "B006",
    edition: "1st",
    publisher: "Random House",
    category: "Self-help",
    language: "English",
    shelfNumber: "S6",
    totalCopies: 4,
    description: "Why we do what we do in life and business."
  },
  {
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    isbn: "9781491904244",
    bookCode: "B007",
    edition: "1st",
    publisher: "O'Reilly Media",
    category: "Programming",
    language: "English",
    shelfNumber: "S7",
    totalCopies: 3,
    description: "A deep dive into JavaScript core mechanisms."
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    isbn: "9781612680194",
    bookCode: "B008",
    edition: "1st",
    publisher: "Plata Publishing",
    category: "Finance",
    language: "English",
    shelfNumber: "S8",
    totalCopies: 7,
    description: "What the rich teach their kids about money."
  }
];

const BookListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBooks = dummyBooks.filter((book) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.publisher.toLowerCase().includes(searchLower) ||
      book.category.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(new Set(dummyBooks.map((book) => book.category)));

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((book, index) => (
          <div key={index} className="border dark:border-gray-700 p-4 rounded shadow bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Book Code:</strong> {book.bookCode}</p>
            <p><strong>Edition:</strong> {book.edition}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Language:</strong> {book.language}</p>
            <p><strong>Shelf:</strong> {book.shelfNumber}</p>
            <p><strong>Copies Available:</strong> {book.totalCopies}</p>
            <p className="mt-2"><strong>Description:</strong> {book.description}</p>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="mt-4 text-red-500">No books found matching the search.</p>
      )}
    </div>
  );
};

export default BookListPage;
