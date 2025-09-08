// You are building a student performance system. Each student has an ID, name, and a list of scores in different subjects.

// Store the student data in a list.

// Also create a map where the key = student ID and the value = average score.

// Sort the list of students by name in ascending order.

// Sort the map by average score in ascending order.

// Print both results clearly.



// ✅ Example Data

// ID=101, Name=Alice, Scores=[85, 90, 78]

// ID=102, Name=Bob, Scores=[70, 88, 92]

// ID=103, Name=Charlie, Scores=[95, 85, 100]



type Student = {
  id: number;
  name: string;
  scores: number[];
};

// Step 1: Create a list of students
const students: Student[] = [
  { id: 101, name: "Alice", scores: [85, 90, 78] },
  { id: 102, name: "Bob", scores: [70, 88, 92] },
  { id: 103, name: "Charlie", scores: [95, 85, 100] },
];


// Step 2: Create a map of studentId -> average score
const studentAverageMap: Map<number, number> = new Map();


students.forEach(student=>{
const avg = student.scores.reduce((sum, val) =>sum +val,0)/student.scores.length;
studentAverageMap.set(student.id, avg);

});

[...students].sort(
    (a,b)=>a.name.localeCompare(b.name)
);


new Map([...studentAverageMap.entries()].sort((a,b)=>a[1]-b[1]));

console.log("📋 Students sorted by name:");
studentsSortedByName.forEach((s) =>
  console.log(`ID=${s.id}, Name=${s.name}, Scores=${s.scores}`)
);

console.log("\n📊 Student averages sorted by score:");
studentAverageSorted.forEach((avg, id) =>
  console.log(`ID=${id}, Average Score=${avg}`)
);