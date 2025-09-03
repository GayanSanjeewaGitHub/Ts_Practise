// type Student = [string, number]; // [name, grade]

// Write a function getTopStudents that accepts an array of Student and returns only the students who scored above 80. Ensure type safety in your function.


type Student = [string, number]; // [name, grade]

function getTopStudents(students: Student[]): Student[] {
  return students.filter(([_, grade]) => grade > 80);
}

// ✅ Example
const students: Student[] = [
  ["Alice", 92],
  ["Bob", 76],
  ["Charlie", 88],
];

console.log(getTopStudents(students));
// Output: [ [ 'Alice', 92 ], [ 'Charlie', 88 ] ]
