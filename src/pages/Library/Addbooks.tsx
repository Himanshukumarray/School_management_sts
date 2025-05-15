import React, { useState, ChangeEvent, FormEvent } from "react";

interface BookFormData {
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
  coverImage: File | null;
}

const dummyBookDatabase: BookFormData[] = [];

const AddBookForm: React.FC = () => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    bookCode: "",
    edition: "",
    publisher: "",
    category: "",
    language: "",
    shelfNumber: "",
    totalCopies: 1,
    description: "",
    coverImage: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dummyBookDatabase.push(formData);
    console.log("Book added to dummy database:", formData);
    console.log("Updated dummy database:", dummyBookDatabase);
    alert("Book added to dummy database!");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      bookCode: "",
      edition: "",
      publisher: "",
      category: "",
      language: "",
      shelfNumber: "",
      totalCopies: 1,
      description: "",
      coverImage: null,
    });
    setImagePreview(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <h2 className="md:col-span-2 text-2xl font-semibold">Add New Book</h2>

      {[ 
        { label: "Book Title", name: "title", required: true },
        { label: "Author", name: "author", required: true },
        { label: "ISBN", name: "isbn" },
        { label: "Book Code", name: "bookCode", required: true },
        { label: "Edition", name: "edition" },
        { label: "Publisher", name: "publisher" },
        { label: "Language", name: "language" },
        { label: "Shelf Number", name: "shelfNumber" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block font-medium mb-1">{field.label}{field.required && " *"}</label>
          <input
            type="text"
            name={field.name}
            value={(formData as any)[field.name]}
            onChange={handleChange}
            required={field.required}
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded"
          />
        </div>
      ))}

      {/* Category Dropdown */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
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
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>
    </form>
  );
};

export default AddBookForm;
