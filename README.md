You are asked to build a small TypeScript module to analyze student performance.

This task will test your understanding of:

Interfaces & Union types

Conditional types

Optional chaining (?.) and nullish coalescing (??)

Array methods (map, filter, reduce)

Generics with default type parameters

as const and spread operators (...)



1️⃣ Define Data Models

You are given two categories of students:

a) Local students:
Each local student lives in a specific city.

b) International students:
Each international student comes from a country and has a visa status.


const students: AnyStudent[] = [
  { id: 1, name: "Alex", age: 20, city: "Colombo", type: "local", marks: [85, 90, 80], contact: { email: "alex@mail.com" } },
  { id: 2, name: "Yuki", age: 22, country: "Japan", visaStatus: "Valid", type: "international", marks: [60, 75, 70] },
  { id: 3, name: "Lina", age: 23, country: "India", visaStatus: "Expired", type: "international", marks: [92, 89, 95] },
  { id: 4, name: "Ravi", age: 21, city: "Kandy", type: "local" }, // no marks
];




const result = analyzeStudents(students);
console.log("Top Students:", result.topStudents);
console.log("Overall Average:", result.overallAvg);

console.log("Names:", extractValues(students, "name"));
console.log("Cities/Countries:", students.map(s => 
  getStudentField(s, "type") === "local" ? 
  getStudentField(s, "city") : 
  getStudentField(s, "country")
));


Top Students: [
  { id: 1, name: 'Alex', age: 20, city: 'Colombo', type: 'local', marks: [85, 90, 80], contact: [Object], avg: 85 },
  { id: 3, name: 'Lina', age: 23, country: 'India', visaStatus: 'Expired', type: 'international', marks: [92, 89, 95], avg: 92 }
]
Overall Average: 76.33
Names: [ 'Alex', 'Yuki', 'Lina', 'Ravi' ]
Cities/Countries: [ 'Colombo', 'Japan', 'India', 'Kandy' ]
