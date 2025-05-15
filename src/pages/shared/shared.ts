// shared.tsx

export interface StudentResult {
    rollNumber: string;
    name: string;
    dateOfBirth: string;
    math: number;
    science: number;
    english: number;
}

export const initialResults: StudentResult[] = [
    { rollNumber: 'RN001', name: 'Alice Johnson', dateOfBirth: '01/15/2005', math: 85, science: 78, english: 90 },
    { rollNumber: 'RN002', name: 'Bob Smith', dateOfBirth: '03/22/2005', math: 92, science: 88, english: 75 },
    { rollNumber: 'RN003', name: 'Charlie Lee', dateOfBirth: '05/10/2005', math: 78, science: 82, english: 80 },
    { rollNumber: 'RN004', name: 'Diana Patel', dateOfBirth: '07/30/2005', math: 88, science: 91, english: 85 },
    { rollNumber: 'RN005', name: 'Ethan Brown', dateOfBirth: '09/05/2005', math: 90, science: 79, english: 88 },
    { rollNumber: 'RN006', name: 'Fiona Davis', dateOfBirth: '11/12/2005', math: 81, science: 85, english: 82 },
    { rollNumber: 'RN007', name: 'George Wilson', dateOfBirth: '02/18/2005', math: 95, science: 89, english: 94 },
    { rollNumber: 'RN008', name: 'Hannah Martinez', dateOfBirth: '04/25/2005', math: 74, science: 77, english: 80 },
    { rollNumber: 'RN009', name: 'Ian Thompson', dateOfBirth: '06/08/2005', math: 82, science: 84, english: 79 },
    { rollNumber: 'RN010', name: 'Julia Clark', dateOfBirth: '08/14/2005', math: 89, science: 92, english: 86 },
];

export const formatDate = (iso: string) => {
    const [year, month, day] = iso.split('-');
    return `${month}/${day}/${year}`;
};

export const classData = {
    "10": {
        "A": [
            { rollNumber: "10A01", name: "Alice", dateOfBirth: "2009-06-01" },
            { rollNumber: "10A02", name: "Bob", dateOfBirth: "2009-06-02" },
            { rollNumber: "10A03", name: "Catherine", dateOfBirth: "2009-06-03" },
            { rollNumber: "10A04", name: "Daniel", dateOfBirth: "2009-06-04" },
            { rollNumber: "10A05", name: "Eva", dateOfBirth: "2009-06-05" },
            { rollNumber: "10A06", name: "Frank", dateOfBirth: "2009-06-06" },
            { rollNumber: "10A07", name: "Grace", dateOfBirth: "2009-06-07" },
            { rollNumber: "10A08", name: "Harry", dateOfBirth: "2009-06-08" },
            { rollNumber: "10A09", name: "Isla", dateOfBirth: "2009-06-09" },
            { rollNumber: "10A10", name: "Jack", dateOfBirth: "2009-06-10" }
        ],
        "B": [
            { rollNumber: "10B01", name: "Kiran", dateOfBirth: "2009-07-01" },
            { rollNumber: "10B02", name: "Liam", dateOfBirth: "2009-07-02" },
            { rollNumber: "10B03", name: "Mia", dateOfBirth: "2009-07-03" },
            { rollNumber: "10B04", name: "Noah", dateOfBirth: "2009-07-04" },
            { rollNumber: "10B05", name: "Olivia", dateOfBirth: "2009-07-05" },
            { rollNumber: "10B06", name: "Pranav", dateOfBirth: "2009-07-06" },
            { rollNumber: "10B07", name: "Quinn", dateOfBirth: "2009-07-07" },
            { rollNumber: "10B08", name: "Riya", dateOfBirth: "2009-07-08" },
            { rollNumber: "10B09", name: "Sahil", dateOfBirth: "2009-07-09" },
            { rollNumber: "10B10", name: "Tina", dateOfBirth: "2009-07-10" }
        ]
    },
    "11": {
        "A": [
            { rollNumber: "11A1", name: "David", dateOfBirth: "2008-05-20" },
            { rollNumber: "11A02", name: "Noah", dateOfBirth: "2009-07-04" }
        ],
        "B": [
            { rollNumber: "11B01", name: "Olivia", dateOfBirth: "2009-07-05" }
        ]
    }
};
