import React, { useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from "../../axios/axiosinstance";

// Updated to match the backend entity structure
interface BookFormData {
  title: string;
  author: string;
  subject: string;
  purchaseDate: string;
  totalCopies: number;
  availableCopies: number;
  
  // We'll keep these fields for UI purposes but they won't be sent to the API
  isbn?: string;
  bookCode?: string;
  edition?: string;
  publisher?: string;
  category?: string;
  language?: string;
  shelfNumber?: string;
  description?: string;
  coverImage: File | null;
}

const AddBookForm: React.FC = () => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    subject: "",
    purchaseDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    totalCopies: 1,
    availableCopies: 1,
    
    // Additional UI fields
    isbn: "",
    bookCode: "",
    edition: "",
    publisher: "",
    category: "",
    language: "",
    shelfNumber: "",
    description: "",
    coverImage: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If category field is changed, update subject field as well
    if (name === "category") {
      setFormData((prev) => ({ ...prev, subject: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Create a book object that matches the backend entity structure
      const bookData = {
        title: formData.title,
        author: formData.author,
        subject: formData.subject || formData.category, // Use category as subject if subject is not provided
        purchaseDate: formData.purchaseDate,
        totalCopies: formData.totalCopies,
        availableCopies: formData.availableCopies,
        shelfNumber:formData.shelfNumber,
        isbn:formData.isbn,
        bookCode:formData.bookCode,
        publisher:formData.publisher,
        language:formData.language,
        category:formData.category,
        description:formData.description,
      };
      
      // Get the current tenant - this would typically come from your auth context or config
      const tenant = sessionStorage.getItem('tenant'); // Replace with actual tenant handling logic
      
      // Make API call to add the book - update with the correct API URL path from your error message
      const response = await axiosInstance.post("/library/books", bookData, {
        headers: {
          'Content-Type': 'application/json',
          'tenant': tenant,
          // Add authorization header if required
          'Authorization': 'Bearer ' + sessionStorage.getItem('token') // Assuming you store JWT token in sessionStorage
        },
       
      });
      
      console.log("Book added successfully:", response.data);
      setSuccess(true);
      
      // If you need to handle the cover image separately
      if (formData.coverImage) {
        // You might need a separate endpoint for image upload
        // This is just a placeholder for how you might handle it
        const imageFormData = new FormData();
        imageFormData.append('image', formData.coverImage);
        imageFormData.append('bookId', response.data.id.toString());
        
       await axiosInstance.post("/library/books/upload-cover", imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'tenant': tenant,
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          },
          withCredentials: true
        });
      }
      
      resetForm();
    } catch (err: any) {
      console.error("Error adding book:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response data:", err.response.data);
        console.log("Response status:", err.response.status);
        
        if (err.response.status === 403) {
          setError("Access forbidden. You may not have permission to add books or you're not properly authenticated.");
        } else {
          setError(`Failed to add book: ${err.response.data.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response received from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      subject: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      totalCopies: 1,
      availableCopies: 1,
      
      isbn: "",
      bookCode: "",
      edition: "",
      publisher: "",
      category: "",
      language: "",
      shelfNumber: "",
      description: "",
      coverImage: null,
    });
    setImagePreview(null);
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <h2 className="md:col-span-2 text-2xl font-semibold">Add New Book</h2>
      
      {success && (
        <div className="md:col-span-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Book added successfully.
        </div>
      )}
      
      {error && (
        <div className="md:col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Required fields according to entity */}
      <div>
        <label className="block font-medium mb-1">Book Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
        />
      </div>
      
      <div>
        <label className="block font-medium mb-1">Author *</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
        />
      </div>

      {/* Additional fields */}
      {[
        { label: "ISBN", name: "isbn" },
        { label: "Book Code", name: "bookCode" },
        { label: "Edition", name: "edition" },
        { label: "Publisher", name: "publisher" },
        { label: "Language", name: "language" },
        { label: "Shelf Number", name: "shelfNumber" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block font-medium mb-1">{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={(formData as any)[field.name]}
            onChange={handleChange}
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
          />
        </div>
      ))}

      {/* Category/Subject Dropdown */}
      <div>
        <label className="block font-medium mb-1">Category/Subject *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Science">Science</option>
          <option value="Programming">Programming</option>
          <option value="Biography">Biography</option>
        </select>
      </div>

      {/* Purchase Date */}
      <div>
        <label className="block font-medium mb-1">Purchase Date *</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
        />
      </div>

      {/* Total Copies */}
      <div>
        <label className="block font-medium mb-1">Total Copies *</label>
        <input
          type="number"
          name="totalCopies"
          value={formData.totalCopies}
          onChange={handleChange}
          min={1}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
        />
      </div>

      {/* Available Copies */}
      <div>
        <label className="block font-medium mb-1">Available Copies *</label>
        <input
          type="number"
          name="availableCopies"
          value={formData.availableCopies}
          onChange={handleChange}
          min={0}
          max={formData.totalCopies}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded h-24"
        />
      </div>

      {/* Image Upload */}
      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Cover Preview"
            className="mt-2 h-32 object-cover rounded border dark:border-gray-700"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="md:col-span-2 flex justify-end gap-4">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded hover:bg-gray-300"
          disabled={isLoading}
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Book"}
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;