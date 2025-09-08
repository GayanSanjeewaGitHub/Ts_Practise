function isAnagram(s, t) {
    if (s.length !== t.length)
        return false;
    var freq = [];
    for (var i = 0; i < 256; i++) {
        freq[i] = 0;
    }
    for (var i = 0; i < s.length; i++) {
        freq[s.charCodeAt(i)]++;
        console.log(freq[s.charCodeAt(i)]);
        console.log(freq[s.charCodeAt(i)]++);
        freq[t.charCodeAt(i)]--;
    }
    for (var i = 0; i < freq.length; i++) {
        if (freq[i] !== 0)
            return false;
    }
    return true;
}
// console.log(isAnagram("anagram", "nagaram")); // true
console.log("ABC".charCodeAt(0)); // 65
console.log("ABC".charCodeAt(1)); // 65
console.log("ABC".charCodeAt(2)); // 66   
