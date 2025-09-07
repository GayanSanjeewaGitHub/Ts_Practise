class Employee {
  name: string;
  salary: number;

  constructor(name: string, salary: number) {
          this.name = name;
          this.salary = salary;
  }
  promote() : void {
    this.salary += 10000;
  }
}