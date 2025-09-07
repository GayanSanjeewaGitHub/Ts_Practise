const obj={"a" : 1, "b": 2, "c": 3};

type key= keyof typeof obj; // "a" | "b" | "c"

let a : key= "a"; // valid
// let d : key= "d"; // invalid