// You are building a university course enrollment system. Each student can enroll in multiple courses, and you want to:

// Store the student-course enrollments.

// Find all courses a student is enrolled in.

// Find all students enrolled in a specific course.

// Print the number of students in each course.

// Use TypeScript with arrays and maps to implement this.


// University Enrollment System

class EnrollmentSystem {
  private studentToCourses: Map<string, string[]> = new Map();
  private courseToStudents: Map<string, string[]> = new Map();

  // Enroll a student in a course
  enroll(student: string, course: string): void {
    // Add course to student's list
    if (!this.studentToCourses.has(student)) {
      this.studentToCourses.set(student, []);
    }
    this.studentToCourses.get(student)!.push(course);

    // Add student to course's list
    if (!this.courseToStudents.has(course)) {
      this.courseToStudents.set(course, []);
    }
    this.courseToStudents.get(course)!.push(student);
  }

  // Get all courses of a student
  getCoursesOfStudent(student: string): string[] {
    return this.studentToCourses.get(student) || [];
  }

  // Get all students of a course
  getStudentsOfCourse(course: string): string[] {
    return this.courseToStudents.get(course) || [];
  }

  // Print number of students in each course
  printCourseStats(): void {
    for (const [course, students] of this.courseToStudents.entries()) {
      console.log(`${course}: ${students.length} student(s)`);
    }
  }
}

// ----------------- Example Usage -----------------
const system = new EnrollmentSystem();

// Enroll students
system.enroll("Alice", "Math");
system.enroll("Alice", "Physics");
system.enroll("Bob", "Math");
system.enroll("Charlie", "Biology");
system.enroll("Charlie", "Math");

// Queries
console.log("Alice's Courses:", system.getCoursesOfStudent("Alice"));
console.log("Students in Math:", system.getStudentsOfCourse("Math"));

// Stats
system.printCourseStats();
