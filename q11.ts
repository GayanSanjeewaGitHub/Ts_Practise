// function isAnagram(s: string, t: string): boolean {
//   if (s.length !== t.length) return false;

//   const freq: number[] = [];
//   for (let i = 0; i < 256; i++) {
//     freq[i] = 0;
//   }

 
//   for (let i = 0; i < s.length; i++) {
//     freq[s.charCodeAt(i)]++;
//     freq[t.charCodeAt(i)]--;
//   }

//   for (let i = 0; i < freq.length; i++) {
//     if (freq[i] !== 0) return false;
//   }

//   return true;
// }

// let a: string = "ABC"
// // console.log(isAnagram("anagram", "nagaram")); // true
// console.log (a.charCodeAt(0)) // 65
 