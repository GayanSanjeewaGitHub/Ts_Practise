// Question 2: Using Maps with Type Safety

// Q:
// Create a function countWords that takes a string array and returns a Map<string, number> where the keys are words and the values are their frequency counts. Ensure type safety.


function countWords(words: string[]): Map<string, number> {
  const wordMap = new Map<string, number>();

  for (const word of words) {
    wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
  }

  return wordMap;
}

// ✅ Example
const result = countWords(["apple", "banana", "apple", "orange", "banana"]);
console.log(result);
// Output: Map(3) { 'apple' => 2, 'banana' => 2, 'orange' => 1 }
