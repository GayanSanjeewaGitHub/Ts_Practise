
/**
 *You are asked to write a TypeScript program to manage student records.
Each student can be either a LocalStudent or an InternationalStudent.
Both types share common properties but differ slightly.

Tasks:

Define appropriate types or interfaces for both.

Write a function printStudentInfo() that takes any student and prints their details.

Write a generic function getFirstItem<T>() that returns the first element of an array of any type.
 */
// 1. Define types / interfaces
interface Student {
  id: number;
  name: string;
  age: number;
}

interface LocalStudent extends Student {
  city: string;
  type: "local";
}

interface InternationalStudent extends Student {
  country: string;
  visaStatus: string;
  type: "international";
}

// 2. Use Union type
type AnyStudent = LocalStudent | InternationalStudent;

// 3. Function to print student info
function printStudentInfo(student: AnyStudent): void {
  console.log(`Name: ${student.name}, Age: ${student.age}`);
  if (student.type === "local") {
    console.log(`City: ${student.city}`);
  } else {
    console.log(`Country: ${student.country}, Visa: ${student.visaStatus}`);
  }
}

// 4. Generic function
function getFirstItem<T>(items: T[]): T | undefined {
  return items[0];
}

// 5. Example usage
const s1: LocalStudent = { id: 1, name: "Alex", age: 20, city: "Colombo", type: "local" };
const s2: InternationalStudent = { id: 2, name: "Yuki", age: 22, country: "Japan", visaStatus: "Valid", type: "international" };

printStudentInfo(s1);
printStudentInfo(s2);

const nums = [10, 20, 30];
console.log("First number:", getFirstItem(nums));




/*

Name: Alex, Age: 20
City: Colombo
Name: Yuki, Age: 22
Country: Japan, Visa: Valid
First number: 10


*/
