/*

You are building a small TypeScript utility to analyze student performance data for a university.

Each student can be a LocalStudent or InternationalStudent, and may have optional marks for subjects.

Tasks:

Create proper interfaces and union types for students.

Use optional chaining (?.) and nullish coalescing (??) to safely handle missing marks.

Write a function to:

Filter students with an average score above 70.

Map them to a summary object { name, avgScore }.

Use reduce to calculate the overall average of all students.

Add a generic function that extracts any property from an array of objects.



*/


// 1. Define interfaces and union types
interface StudentBase {
  id: number;
  name: string;
  age: number;
  marks?: number[]; // Optional marks
}

interface LocalStudent extends StudentBase {
  city: string;
  type: "local";
}

interface InternationalStudent extends StudentBase {
  country: string;
  visaStatus: string;
  type: "international";
}

type AnyStudent = LocalStudent | InternationalStudent;

// 2. Function to calculate average safely using optional chaining and ??
function calculateAverage(student: AnyStudent): number {
  const marks = student.marks ?? []; // use [] if marks is null or undefined
  const total = marks.reduce((sum, m) => sum + m, 0);
  return marks.length > 0 ? total / marks.length : 0;
}

// 3. Main function to analyze student performance
function analyzeStudents(students: AnyStudent[]) {
  // Filter students with avg > 70
  const topStudents = students
    .map(s => ({ ...s, avg: calculateAverage(s) }))
    .filter(s => s.avg > 70);

  // Map to summary
  const summary = topStudents.map(s => ({
    name: s.name,
    avgScore: s.avg,
    location: s.type === "local" ? s.city : s.country,
  }));

  // Use reduce to find overall average
  const overallAvg =
    students.reduce((sum, s) => sum + calculateAverage(s), 0) / students.length;

  return { summary, overallAvg };
}

// 4. Generic function to extract any property
function extractProperty<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

// 5. Example data
const students: AnyStudent[] = [
  { id: 1, name: "Alex", age: 20, city: "Colombo", type: "local", marks: [80, 90, 70] },
  { id: 2, name: "Yuki", age: 22, country: "Japan", visaStatus: "Valid", type: "international", marks: [75, 65, 70] },
  { id: 3, name: "Ravi", age: 21, city: "Kandy", type: "local" }, // no marks
  { id: 4, name: "Lina", age: 23, country: "India", visaStatus: "Expired", type: "international", marks: [95, 88, 92] },
];

// 6. Execute analysis
const result = analyzeStudents(students);
console.log("Top Students Summary:", result.summary);
console.log("Overall Average:", result.overallAvg.toFixed(2));

// 7. Extract property using generic function
console.log("Student Names:", extractProperty(students, "name"));



/*

Top Students Summary: [
  { name: 'Alex', avgScore: 80, location: 'Colombo' },
  { name: 'Lina', avgScore: 91.66666666666667, location: 'India' }
]
Overall Average: 65.83
Student Names: [ 'Alex', 'Yuki', 'Ravi', 'Lina' ]


*/

