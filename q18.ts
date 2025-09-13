// ---------- Types ----------
type ActivityLog = {
  studentId: number;
  activity: string;  // e.g. "login", "quiz", "assignment", "logout"
  timestamp: Date;
};

// ---------- Sample Data ----------
const logs: ActivityLog[] = [
  { studentId: 1, activity: "login", timestamp: new Date("2025-09-01T10:00:00") },
  { studentId: 2, activity: "quiz", timestamp: new Date("2025-09-01T10:05:00") },
  { studentId: 1, activity: "assignment", timestamp: new Date("2025-09-01T10:10:00") },
  { studentId: 3, activity: "quiz", timestamp: new Date("2025-09-01T10:15:00") },
  { studentId: 2, activity: "logout", timestamp: new Date("2025-09-01T10:20:00") }
];

// ---------- a. Unique Students ----------
function getUniqueStudents(logs: ActivityLog[]): number[] {
  const set = new Set<number>(logs.map(l => l.studentId));
  return [...set];
}

// ---------- b. Filter by Activity ----------
function filterByActivity(logs: ActivityLog[], activity: string): ActivityLog[] {
  return logs.filter(l => l.activity === activity);
}

// ---------- c. Student Activity Count ----------
function countActivities(logs: ActivityLog[]): Map<number, number> {
  return logs.reduce((map, log) => {
    map.set(log.studentId, (map.get(log.studentId) || 0) + 1);
    return map;
  }, new Map<number, number>());
}

// ---------- d. Most Active Student ----------
function mostActiveStudent(logs: ActivityLog[]): number | null {
  const counts = countActivities(logs);
  let maxStudent: number | null = null;
  let maxCount = 0;

  for (const [studentId, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      maxStudent = studentId;
    }
  }
  return maxStudent;
}

// ---------- e. Thread-Safe Activity Queue ----------
class ActivityQueue {
  private queue: ActivityLog[] = [];
  private locked: boolean = false;
  private waiting: (() => void)[] = [];

  // Simple async lock (mutex-like)
  private async acquireLock() {
    while (this.locked) {
      await new Promise<void>(resolve => this.waiting.push(resolve));
    }
    this.locked = true;
  }

  private releaseLock() {
    this.locked = false;
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      if (resolve) resolve();
    }
  }

  async enqueue(log: ActivityLog): Promise<void> {
    await this.acquireLock();
    try {
      this.queue.push(log);
    } finally {
      this.releaseLock();
    }
  }

  async dequeue(): Promise<ActivityLog | undefined> {
    await this.acquireLock();
    try {
      return this.queue.shift();
    } finally {
      this.releaseLock();
    }
  }
}

// ---------- Run Demo ----------
(async () => {
  console.log("a. Unique Students:", getUniqueStudents(logs)); 
  console.log("b. Quiz Logs:", filterByActivity(logs, "quiz")); 
  console.log("c. Activity Count:", countActivities(logs)); 
  console.log("d. Most Active Student:", mostActiveStudent(logs)); 

  // Thread-safe queue test
  const queue = new ActivityQueue();
  await queue.enqueue({ studentId: 4, activity: "login", timestamp: new Date() });
  console.log("e. Dequeue from Queue:", await queue.dequeue());
})();
