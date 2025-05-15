import React, { useState } from "react";

type RecipientType = "All Teachers" | "All Students" | "All Parents" | "Individual";
type IndividualFilter = "Teacher" | "Student" | "Parent" | "Manual";

const dummyTeachers = ["Alice Smith", "Bob Johnson", "Charlie Brown"];
const dummyStudents = ["John Doe", "Jane Roe", "Tommy Green"];
const dummyParents = ["Parent One", "Parent Two", "Parent Three"];

const maxFileSize = 50 * 1024 * 1024; // 50MB

const EmailComposer: React.FC = () => {
  const [recipientType, setRecipientType] = useState<RecipientType>("All Teachers");
  const [individualFilter, setIndividualFilter] = useState<IndividualFilter>("Teacher");
  const [individual, setIndividual] = useState<string>("");
  const [recipients, setRecipients] = useState<string[]>(["All Teachers"]);
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const handleAddRecipient = () => {
    if (recipientType === "Individual" && individual && !recipients.includes(individual)) {
      setRecipients([...recipients, individual]);
    } else if (recipientType !== "Individual" && !recipients.includes(recipientType)) {
      setRecipients([...recipients, recipientType]);
    }
  };

  const handleRemoveRecipient = (recipient: string) => {
    setRecipients(recipients.filter((r) => r !== recipient));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.size < maxFileSize);

    if (validFiles.length < selectedFiles.length) {
      alert("Some files were not added because they exceed 50MB.");
    }

    setFiles([...files, ...validFiles]);
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleSend = () => {
    console.log({ recipients, subject, message, files });
    alert("Message sent to: " + recipients.join(", "));
    
    setRecipientType("All Teachers");
    setIndividualFilter("Teacher");
    setIndividual("");
    setRecipients(["All Teachers"]);
    setSubject("");
    setMessage("");
    setFiles([]);
  };

  const getIndividualOptions = () => {
    if (individualFilter === "Teacher") return dummyTeachers;
    if (individualFilter === "Student") return dummyStudents;
    if (individualFilter === "Parent") return dummyParents;
    return [];
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-2xl p-6 border rounded shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Compose Message
        </h2>

        {/* Recipient Type */}
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Select Recipient Type</label>
          <select
            className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={recipientType}
            onChange={(e) => {
              setRecipientType(e.target.value as RecipientType);
              setIndividual(""); // reset on change
            }}
          >
            <option>All Teachers</option>
            <option>All Students</option>
            <option>All Parents</option>
            <option>Individual</option>
          </select>
        </div>

        {/* Individual Filters */}
        {recipientType === "Individual" && (
          <>
            <div className="mb-4">
              <label className="block mb-1 dark:text-gray-200">Choose Filter</label>
              <select
                className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={individualFilter}
                onChange={(e) => {
                  setIndividualFilter(e.target.value as IndividualFilter);
                  setIndividual("");
                }}
              >
                <option>Teacher</option>
                <option>Student</option>
                <option>Parent</option>
                <option>Manual</option>
              </select>
            </div>

            {individualFilter === "Manual" ? (
              <div className="mb-4">
                <label className="block mb-1 dark:text-gray-200">Enter Email</label>
                <input
                  type="email"
                  className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={individual}
                  onChange={(e) => setIndividual(e.target.value)}
                  placeholder="example@example.com"
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block mb-1 dark:text-gray-200">Select Person</label>
                <select
                  className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={individual}
                  onChange={(e) => setIndividual(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {getIndividualOptions().map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <button
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={handleAddRecipient}
        >
          ADD
        </button>

        {/* Recipient Chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {recipients.map((recipient) => (
            <div
              key={recipient}
              className="inline-flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-white"
            >
              {recipient}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveRecipient(recipient)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Subject and Message */}
        <input
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />

        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-gray-200">Upload Files</label>
          <input type="file" multiple className="dark:text-white" onChange={handleFileChange} />
          <p className="text-sm text-red-600 mt-1">
            Please upload files less than 50MB
          </p>

          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {files.map((file) => (
                <li key={file.name} className="flex justify-between items-center mt-1">
                  {file.name}
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="text-red-500 hover:text-red-700 text-xs ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;