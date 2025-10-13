/*

✅ keyof and indexed access types
✅ conditional types
✅ as const assertions
✅ discriminated unions
✅ default generics
✅ optional chaining (?.) and nullish coalescing (??)
✅ spread (...) and destructuring

We’ll also mix in functional programming and type inference magic.

🧩 Advanced Question

You’re building a TypeScript analyzer for university students.
Each student record may include:

Common fields (name, age, marks)

Either a local or international profile

Optional nested contact details

You must:

Use advanced typing features to create the model.

Use type narrowing and conditional types to return custom summaries.

Use functional methods (map, filter, reduce) to compute results.

Use ??, ?., keyof, and generics effectively.



*/

// 1. Base types
interface Contact {
  email?: string;
  phone?: string;
}

interface StudentBase {
  id: number;
  name: string;
  age: number;
  marks?: number[];
  contact?: Contact;
}

// 2. Local and International students
interface LocalStudent extends StudentBase {
  city: string;
  type: "local";
}

interface InternationalStudent extends StudentBase {
  country: string;
  visaStatus: "Valid" | "Expired";
  type: "international";
}

type AnyStudent = LocalStudent | InternationalStudent;

// 3. Utility type using conditional types
type StudentLocation<T extends AnyStudent> =
  T extends LocalStudent ? T["city"] : T extends InternationalStudent ? T["country"] : never;

// 4. Function using keyof and optional chaining
function getStudentField<T extends AnyStudent, K extends keyof T>(student: T, key: K): T[K] | undefined {
  return student?.[key];
}

// 5. Function to safely calculate average
function calculateAverage(student: AnyStudent): number {
  const marks = student.marks ?? [];
  return marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
}

// 6. Function with spread, map, filter, reduce
function analyzeStudents(students: AnyStudent[]) {
  const topStudents = students
    .map(s => ({ ...s, avg: calculateAverage(s) }))
    .filter(s => s.avg > 75);

  const overallAvg = students.reduce((sum, s) => sum + calculateAverage(s), 0) / students.length;

  return {
    topStudents,
    overallAvg: Number(overallAvg.toFixed(2))
  } as const; // "as const" locks the object shape
}

// 7. Generic function with default type parameter
function extractValues<T, K extends keyof T = keyof T>(data: T[], key: K): T[K][] {
  return data.map(item => item[key]);
}

// 8. Example dataset
const students: AnyStudent[] = [
  { id: 1, name: "Alex", age: 20, city: "Colombo", type: "local", marks: [85, 90, 80], contact: { email: "alex@mail.com" } },
  { id: 2, name: "Yuki", age: 22, country: "Japan", visaStatus: "Valid", type: "international", marks: [60, 75, 70] },
  { id: 3, name: "Lina", age: 23, country: "India", visaStatus: "Expired", type: "international", marks: [92, 89, 95] },
  { id: 4, name: "Ravi", age: 21, city: "Kandy", type: "local" }, // no marks
];

// 9. Execution
const result = analyzeStudents(students);
console.log("Top Students:", result.topStudents);
console.log("Overall Average:", result.overallAvg);

console.log("Names:", extractValues(students, "name"));
console.log("Cities/Countries:", students.map(s => getStudentField(s, "type") === "local" ? getStudentField(s, "city") : getStudentField(s, "country")));




 /*
 
 Top Students: [
  { id: 1, name: 'Alex', ..., avg: 85 },
  { id: 3, name: 'Lina', ..., avg: 92 }
]
Overall Average: 75.25
Names: [ 'Alex', 'Yuki', 'Lina', 'Ravi' ]
Cities/Countries: [ 'Colombo', 'Japan', 'India', 'Kandy' ]

 as const 
 readonly {
  readonly topStudents: readonly AnyStudent[];
  readonly overallAvg: 75.25;
}
 */

