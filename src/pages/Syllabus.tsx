import React, { useState } from 'react';

// Type definitions
type Book = {
  title: string;
  author: string;
  publisher?: string;
};

type Subject = {
  id: string;
  name: string;
  syllabus: string[];
  books: Book[];
  description?: string;
};

type ClassData = {
  classNumber: number;
  subjects: Subject[];
};

// More realistic dummy data with expanded information
const classData: ClassData[] = [
  {
    classNumber: 1,
    subjects: [
      {
        id: "class1-math",
        name: 'Mathematics',
        description: 'Foundational mathematics concepts for young learners',
        syllabus: ['Numbers 1-100', 'Basic Addition', 'Basic Subtraction', 'Shapes and Patterns', 'Measurement'],
        books: [
          { title: 'Fun with Numbers', author: 'R. Sharma', publisher: 'Kids Publishing' },
          { title: 'Math Magic Class 1', author: 'NCERT', publisher: 'NCERT Publications' }
        ],
      },
      {
        id: "class1-eng",
        name: 'English',
        description: 'Introduction to language and vocabulary building',
        syllabus: ['Alphabets', 'Phonetics', 'Basic Grammar', 'Simple Sentences', 'Reading Stories'],
        books: [
          { title: 'English Primer', author: 'S. Mehta', publisher: 'Oxford Press' },
          { title: 'Words and Meanings', author: 'J. Wilson', publisher: 'Kids Publishing' }
        ],
      },
      {
        id: "class1-evs",
        name: 'Environmental Studies',
        description: 'Understanding our surroundings and environment',
        syllabus: ['Plants & Animals', 'My Family', 'My School', 'Food & Nutrition', 'Water & Air'],
        books: [
          { title: 'My Surroundings', author: 'K. Agarwal', publisher: 'Learning Press' },
          { title: 'EVS for Class 1', author: 'NCERT', publisher: 'NCERT Publications' }
        ],
      }
    ],
  },
  {
    classNumber: 5,
    subjects: [
      {
        id: "class5-math",
        name: 'Mathematics',
        description: 'Intermediate arithmetic and geometry concepts',
        syllabus: ['Fractions', 'Decimals', 'Geometry', 'Measurement', 'Data Handling'],
        books: [
          { title: 'Mathematics for Class 5', author: 'R.S. Aggarwal', publisher: 'S. Chand Publishing' },
          { title: 'Math Magic Class 5', author: 'NCERT', publisher: 'NCERT Publications' }
        ],
      },
      {
        id: "class5-science",
        name: 'Science',
        description: 'Understanding natural phenomena and scientific principles',
        syllabus: ['Living World', 'Materials', 'Energy', 'Our Environment', 'Natural Resources'],
        books: [
          { title: 'Science for Class 5', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Science Explorations', author: 'V. Singh', publisher: 'Learning Press' }
        ],
      },
      {
        id: "class5-social",
        name: 'Social Studies',
        description: 'Understanding society, history, and geography',
        syllabus: ['India and the World', 'Ancient Civilizations', 'Maps and Directions', 'Natural Resources', 'Local Government'],
        books: [
          { title: 'Social Studies for Class 5', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Our Past and Present', author: 'P. Kumar', publisher: 'Education Publishers' }
        ],
      }
    ],
  },
  {
    classNumber: 8,
    subjects: [
      {
        id: "class8-math",
        name: 'Mathematics',
        description: 'Advanced arithmetic, algebra, and geometry',
        syllabus: ['Algebra', 'Quadrilaterals', 'Mensuration', 'Data Handling', 'Rational Numbers'],
        books: [
          { title: 'Mathematics for Class 8', author: 'R.D. Sharma', publisher: 'Dhanpat Rai Publications' },
          { title: 'Math Textbook for Class 8', author: 'NCERT', publisher: 'NCERT Publications' }
        ],
      },
      {
        id: "class8-science",
        name: 'Science',
        description: 'Core concepts in physics, chemistry, and biology',
        syllabus: ['Force and Pressure', 'Chemical Effects of Current', 'Cell Structure', 'Reproduction', 'Metals and Non-metals'],
        books: [
          { title: 'Science for Class 8', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Comprehensive Science', author: 'Lakhmir Singh', publisher: 'S. Chand Publishing' }
        ],
      },
      {
        id: "class8-social",
        name: 'Social Science',
        description: 'In-depth study of history, geography, and civics',
        syllabus: ['Modern Indian History', 'Geography of Resources', 'Understanding Constitution', 'Agricultural Patterns', 'Industrial Revolution'],
        books: [
          { title: 'Social Science for Class 8', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'History and Civics', author: 'A. Sengupta', publisher: 'Oxford Publications' }
        ],
      }
    ],
  },
  {
    classNumber: 10,
    subjects: [
      {
        id: "class10-math",
        name: 'Mathematics',
        description: 'Comprehensive math preparing for board examinations',
        syllabus: ['Real Numbers', 'Polynomials', 'Triangles', 'Statistics', 'Trigonometry', 'Coordinate Geometry'],
        books: [
          { title: 'Mathematics for Class 10', author: 'R.D. Sharma', publisher: 'Dhanpat Rai Publications' },
          { title: 'NCERT Mathematics', author: 'NCERT', publisher: 'NCERT Publications' }
        ],
      },
      {
        id: "class10-science",
        name: 'Science',
        description: 'Comprehensive science preparing for board examinations',
        syllabus: ['Chemical Reactions', 'Electricity', 'Magnetic Effects', 'Light', 'Human Physiology', 'Natural Resources'],
        books: [
          { title: 'Science for Class 10', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Concepts of Physics', author: 'H.C. Verma', publisher: 'Bharati Bhawan Publishers' }
        ],
      },
      {
        id: "class10-social",
        name: 'Social Science',
        description: 'Comprehensive study of society, politics, and economics',
        syllabus: ['India and Contemporary World', 'Democratic Politics', 'Understanding Economic Development', 'Resources and Development', 'Manufacturing Industries'],
        books: [
          { title: 'Social Science for Class 10', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Contemporary World History', author: 'V.K. Joshi', publisher: 'VK Global Publications' }
        ],
      }
    ],
  },
  {
    classNumber: 12,
    subjects: [
      {
        id: "class12-physics",
        name: 'Physics',
        description: 'Advanced physics concepts for senior secondary',
        syllabus: ['Electrostatics', 'Current Electricity', 'Magnetic Effects', 'Electromagnetic Induction', 'Modern Physics', 'Optics'],
        books: [
          { title: 'Concepts of Physics Vol I & II', author: 'H.C. Verma', publisher: 'Bharati Bhawan Publishers' },
          { title: 'Physics Part I & II', author: 'NCERT', publisher: 'NCERT Publications' }
        ],
      },
      {
        id: "class12-chemistry",
        name: 'Chemistry',
        description: 'Advanced chemistry concepts for senior secondary',
        syllabus: ['Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Organic Compounds', 'Biomolecules'],
        books: [
          { title: 'Chemistry Part I & II', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Modern Approach to Chemistry', author: 'S. Chand', publisher: 'S. Chand Publishing' }
        ],
      },
      {
        id: "class12-maths",
        name: 'Mathematics',
        description: 'Advanced mathematics for senior secondary',
        syllabus: ['Relations and Functions', 'Algebra', 'Calculus', 'Vectors', 'Linear Programming', 'Probability'],
        books: [
          { title: 'Mathematics Part I & II', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Mathematics for Class 12', author: 'R.D. Sharma', publisher: 'Dhanpat Rai Publications' }
        ],
      },
      {
        id: "class12-economics",
        name: 'Economics',
        description: 'Comprehensive economics for senior secondary',
        syllabus: ['Microeconomics', 'Macroeconomics', 'National Income', 'Money and Banking', 'Balance of Payments', 'Development Experience'],
        books: [
          { title: 'Introductory Microeconomics & Macroeconomics', author: 'NCERT', publisher: 'NCERT Publications' },
          { title: 'Advanced Economics', author: 'S. Roy', publisher: 'Academic Publishers' }
        ],
      }
    ],
  }
];

// Component for displaying syllabus
const SyllabusPage = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Get the classes we have data for
  const availableClasses = classData.map(data => data.classNumber);
  
  // Find the selected class data
  const currentClassData = selectedClass 
    ? classData.find(data => data.classNumber === selectedClass) 
    : null;

  // Find the selected subject data
  const currentSubject = selectedSubject && currentClassData
    ? currentClassData.subjects.find(subject => subject.id === selectedSubject)
    : null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            School Syllabus Portal
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
              Dashboard
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm">
              Help
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar for class selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Select Class</h2>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSubject(null);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedClass === cls
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  } ${!availableClasses.includes(cls) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!availableClasses.includes(cls)}
                >
                  Class {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="md:col-span-3">
            {selectedClass && currentClassData ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Class {selectedClass} - Curriculum Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Select a subject below to view detailed syllabus and recommended books
                  </p>
                </div>
                <div className="p-4">
                  {/* Subject tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentClassData.subjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => setSelectedSubject(subject.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          selectedSubject === subject.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {subject.name}
                      </button>
                    ))}
                  </div>

                  {/* Selected subject details */}
                  {currentSubject ? (
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                          {currentSubject.name}
                        </h3>
                        {currentSubject.description && (
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {currentSubject.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Syllabus section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Syllabus Topics
                          </h4>
                          <ul className="space-y-2">
                            {currentSubject.syllabus.map((topic, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-medium mr-3 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Books section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            Recommended Books
                          </h4>
                          <ul className="space-y-4">
                            {currentSubject.books.map((book, idx) => (
                              <li key={idx} className="border-l-4 border-green-200 dark:border-green-900 pl-3">
                                <h5 className="font-medium text-gray-800 dark:text-white">{book.title}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300">by {book.author}</p>
                                {book.publisher && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{book.publisher}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                        Select a Subject
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Choose a subject from above to view its syllabus and recommended books
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-blue-500 dark:text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome to the Syllabus Portal
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Select a class from the sidebar to view subjects and their detailed syllabus
                </p>
                <div className="flex justify-center gap-3">
                  {availableClasses.slice(0, 3).map(cls => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Class {cls}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusPage;