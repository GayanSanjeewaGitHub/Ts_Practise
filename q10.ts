/******************************************************************************************
 *  10 CLASSIC INTERVIEW PROBLEMS – SINGLE FILE
 *  ---------------------------------------------------------------
 *  Each section contains:
 *  – A concise problem statement (as an interviewer would ask it)
 *  – A fully-typed TypeScript solution
 *  – A short driver block so you can execute / unit-test from the command line
 *
 *  Compile:  tsc --strict --lib es2020 index.ts
 *  Run:      node index.js
 ******************************************************************************************/

/*---------------------------------------------------------
 Problem 1 – Valid Anagram
-----------------------------------------------------------*/
/*
 Interviewer:
 "Given two ASCII strings s and t, write a function that returns true
  if t is an anagram of s.  What is the time and space complexity?"
*/
function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;

    const freq = new Array<number>(256).fill(0);
    for (let i = 0; i < s.length; i++) {
        freq[s.charCodeAt(i)]++;
        freq[t.charCodeAt(i)]--;
    }
    for (const count of freq) if (count !== 0) return false;
    return true;
}




/* driver */
console.log("\n1.  Valid Anagram");
console.log(isAnagram("nameless", "salesman")); // true
console.log(isAnagram("rat", "car"));            // false

/*---------------------------------------------------------
 Problem 2 – Find First and Last Position of Target
-----------------------------------------------------------*/
/*
 Interviewer:
 "We have a sorted number array that may contain duplicates.
  Implement a function that returns the first and last index of target
  in O(log n) time.  If the target is absent return [-1, -1]."
*/
function searchRange(nums: number[], target: number): [number, number] {
    const find = (left: number, right: number, first: boolean): number => {
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (nums[mid] > target || (first && nums[mid] === target)) right = mid - 1;
            else left = mid + 1;
        }
        return left;
    };

    const start = find(0, nums.length - 1, true);
    if (start === nums.length || nums[start] !== target) return [-1, -1];
    const end = find(start, nums.length - 1, false) - 1;
    return [start, end];
}

/* driver */
console.log("\n2.  First & Last Position");
console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log(searchRange([1], 0));                  // [-1, -1]

/*---------------------------------------------------------
 Problem 3 – Kth Largest Element in an Array
-----------------------------------------------------------*/
/*
 Interviewer:
 "Design an algorithm that returns the k-th largest element of an unsorted
  number array in O(n log k) time and O(k) extra space.  Discuss why the
  min-heap approach is preferable to full sorting."
*/
function findKthLargest(nums: number[], k: number): number {
    const minH = new MinHeap<number>();
    for (const n of nums) {
        minH.insert(n);
        if (minH.size() > k) minH.extract();
    }
    return minH.peek()!;
}

/* minimal min-heap implementation */
class MinHeap<T> {
    private data: T[] = [];
    constructor(private compare: (a: T, b: T) => number = (a, b) => (a as any) - (b as any)) {}
    size() { return this.data.length; }
    peek() { return this.data[0]; }
    insert(val: T) {
        this.data.push(val);
        this.siftUp(this.data.length - 1);
    }
    extract(): T | undefined {
        if (this.data.length === 0) return undefined;
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length) {
            this.data[0] = last;
            this.siftDown(0);
        }
        return top;
    }
    private siftUp(idx: number) {
        while (idx > 0) {
            const parent = (idx - 1) >> 1;
            if (this.compare(this.data[idx], this.data[parent]) < 0) {
                [this.data[idx], this.data[parent]] = [this.data[parent], this.data[idx]];
                idx = parent;
            } else break;
        }
    }
    private siftDown(idx: number) {
        while (true) {
            let min = idx, left = idx * 2 + 1, right = left + 1;
            if (left < this.data.length && this.compare(this.data[left], this.data[min]) < 0) min = left;
            if (right < this.data.length && this.compare(this.data[right], this.data[min]) < 0) min = right;
            if (min !== idx) {
                [this.data[idx], this.data[min]] = [this.data[min], this.data[idx]];
                idx = min;
            } else break;
        }
    }
}

/* driver */
console.log("\n3.  Kth Largest");
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4

/*---------------------------------------------------------
 Problem 4 – Symmetric Tree
-----------------------------------------------------------*/
/*
 Interviewer:
 "Check whether a binary tree is a mirror image of itself.
  Solve recursively and then explain how you would do it iteratively."
*/
class TreeNode {
    constructor(public val: number, public left: TreeNode | null = null, public right: TreeNode | null = null) {}
}

function isSymmetric(root: TreeNode | null): boolean {
    const dfs = (l: TreeNode | null, r: TreeNode | null): boolean => {
        if (!l && !r) return true;
        if (!l || !r || l.val !== r.val) return false;
        return dfs(l.left, r.right) && dfs(l.right, r.left);
    };
    return root ? dfs(root.left, root.right) : true;
}

/* driver */
console.log("\n4.  Symmetric Tree");
const symTree = new TreeNode(1, new TreeNode(2, new TreeNode(3), new TreeNode(4)),
                                  new TreeNode(2, new TreeNode(4), new TreeNode(3)));
console.log(isSymmetric(symTree)); // true
const asymTree = new TreeNode(1, new TreeNode(2, null, new TreeNode(3)),
                                   new TreeNode(2, null, new TreeNode(3)));
console.log(isSymmetric(asymTree)); // false

/*---------------------------------------------------------
 Problem 5 – Generate Parentheses
-----------------------------------------------------------*/
/*
 Interviewer:
 "Return all combinations of n pairs of well-formed parentheses.
  What is the branching factor of your recursion tree?"
*/
function generateParenthesis(n: number): string[] {
    const res: string[] = [];
    const backtrack = (cur: string, open: number, close: number) => {
        if (cur.length === 2 * n) { res.push(cur); return; }
        if (open < n) backtrack(cur + "(", open + 1, close);
        if (close < open) backtrack(cur + ")", open, close + 1);
    };
    backtrack("", 0, 0);
    return res;
}

/* driver */
console.log("\n5.  Generate Parentheses (n=3)");
console.log(generateParenthesis(3)); // [ '((()))', '(()())', '(())()', '()(())', '()()()' ]

/*---------------------------------------------------------
 Problem 6 – Gas Station (Circular Tour)
-----------------------------------------------------------*/
/*
 Interviewer:
 "There is a circular route with gas stations.  You are given two arrays:
  gas[i] = amount available at station i, cost[i] = gas needed to reach i+1.
  Return the smallest starting index from which you can complete the loop,
  or -1 if impossible.  Achieve O(n) time and O(1) space."
*/
function canCompleteCircuit(gas: number[], cost: number[]): number {
    let total = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        const diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;
}

/* driver */
console.log("\n6.  Gas Station");
console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])); // 3
console.log(canCompleteCircuit([2, 3, 4], [3, 4, 3]));             // -1

/*---------------------------------------------------------
 Problem 7 – Course Schedule (Topological Sort)
-----------------------------------------------------------*/
/*
 Interviewer:
 "You have n courses and a list of prerequisite pairs.
  Is it possible to finish all courses?  Solve with both DFS and BFS
  and explain the complexity."
*/
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    /* DFS colour approach */
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const colour = new Array<number>(numCourses).fill(WHITE);
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    for (const [u, v] of prerequisites) adj[v].push(u);

    const dfs = (v: number): boolean => {
        colour[v] = GRAY;
        for (const nxt of adj[v]) {
            if (colour[nxt] === GRAY) return false; // back-edge => cycle
            if (colour[nxt] === WHITE && !dfs(nxt)) return false;
        }
        colour[v] = BLACK;
        return true;
    };

    for (let i = 0; i < numCourses; i++)
        if (colour[i] === WHITE && !dfs(i)) return false;
    return true;
}

/* driver */
console.log("\n7.  Course Schedule");
console.log(canFinish(2, [[1, 0]]));        // true
console.log(canFinish(2, [[1, 0], [0, 1]])); // false

/*---------------------------------------------------------
 Problem 8 – K-th Permutation
-----------------------------------------------------------*/
/*
 Interviewer:
 "Given n and k (1-based), return the k-th permutation of [1..n]
  without generating all n! permutations.  Explain the factorial
  number system you use."
*/
function getPermutation(n: number, k: number): string {
    const fact: number[] = [1];
    for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;

    const unused: number[] = Array.from({ length: n }, (_, i) => i + 1);
    let res = "";
    k--; // convert to 0-based
    for (let i = 1; i <= n; i++) {
        const block = fact[n - i];
        const idx = Math.floor(k / block);
        res += unused.splice(idx, 1)[0];
        k %= block;
    }
    return res;
}

/* driver */
console.log("\n8.  K-th Permutation");
console.log(getPermutation(4, 9)); // "2314"
console.log(getPermutation(3, 3)); // "213"

/*---------------------------------------------------------
 Problem 9 – Minimum Window Substring
-----------------------------------------------------------*/
/*
 Interviewer:
 "Given strings s and t, find the shortest substring of s that contains
  every character of t (including duplicates).  Achieve O(|s|+|t|) time."
*/
function minWindow(s: string, t: string): string {
    if (t.length > s.length) return "";
    const need = new Map<string, number>();
    for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
    let missing = need.size;
    let left = 0, start = 0, len = Infinity;

    for (let right = 0; right < s.length; right++) {
        const rc = s[right];
        if (need.has(rc)) {
            need.set(rc, need.get(rc)! - 1);
            if (need.get(rc)! === 0) missing--;
        }
        while (missing === 0) {
            if (right - left + 1 < len) { len = right - left + 1; start = left; }
            const lc = s[left++];
            if (need.has(lc)) {
                if (need.get(lc)! === 0) missing++;
                need.set(lc, need.get(lc)! + 1);
            }
        }
    }
    return len === Infinity ? "" : s.slice(start, start + len);
}

/* driver */
console.log("\n9.  Minimum Window");
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a"));               // "a"
console.log(minWindow("a", "aa"));              // ""

/*---------------------------------------------------------
 Problem 10 – Largest Rectangle in Histogram
-----------------------------------------------------------*/
/*
 Interviewer:
 "Given an array of bar heights, return the largest rectangle area
  that can be formed in the histogram.  Solve in O(n) time and O(n) space."
*/
function largestRectangleArea(heights: number[]): number {
    const stack: number[] = []; // indices in ascending height order
    let max = 0;
    heights = [...heights, 0]; // sentinel to flush remaining bars
    for (let i = 0; i < heights.length; i++) {
        while (stack.length && heights[stack[stack.length - 1]] > heights[i]) {
            const h = heights[stack.pop()!];
            const w = stack.length ? i - stack[stack.length - 1] - 1 : i;
            max = Math.max(max, h * w);
        }
        stack.push(i);
    }
    return max;
}

/* driver */
console.log("\n10. Largest Rectangle");
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 10
console.log(largestRectangleArea([2, 4]));             // 4

/******************************************************************************************
 *  End of file – feel free to add unit tests or export individual helpers above.
 ******************************************************************************************/