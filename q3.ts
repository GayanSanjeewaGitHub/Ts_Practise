// Question 3: Type-Safe List Transformations

// Q:
// Write a function doubleNumbers that takes a list of numbers and returns a list where each number is doubled. Enforce strict typing.


function doubleNumbers(nums: number[]): number[] {
  return nums.map(n => n * 2);
}

// ✅ Example
console.log(doubleNumbers([1, 2, 3, 4]));



Question 4: Combining Tuples, Maps, and Lists

Q:
You are given a list of product tuples:
type Product = [string, number]; // [productName, price]

Create a function groupByPriceRange that groups products into a Map<string, Product[]> where the key is "cheap" (price < 50) or "expensive" (price >= 50


type Product = [string, number]; // [productName, price]

function groupByPriceRange(products: Product[]): Map<string, Product[]> {
  const result = new Map<string, Product[]>();
  result.set("cheap", []);
  result.set("expensive", []);

  for (const product of products) {
    const [name, price] = product;
    if (price < 50) {
      result.get("cheap")!.push(product);
    } else {
      result.get("expensive")!.push(product);
    }
  }

  return result;
}

// ✅ Example
const products: Product[] = [
  ["Pen", 10],
  ["Notebook", 40],
  ["Headphones", 100],
  ["Keyboard", 75],
];

console.log(groupByPriceRange(products));
Output: Map(2) 
{ 'cheap' => [ [ 'Pen', 10 ], [ 'Notebook', 40 ] ],
                 'expensive' => [ [ 'Headphones', 100 ], [ 'Keyboard', 75 ] ] }


// that ! at the end of result.get("cheap")! is a TypeScript thing called the non-null assertion operator.



// 2. Enable JSON Streaming

// Instead of sending one huge JSON at the end, you stream results in chunks so clients start processing early.

// Example with Express & JSON streaming