async function fetchAll() {
  try {
    // Fire all requests in parallel immediately
    const p1 = fetch("https://api.example.com/1").then(r => r.json());
    const p2 = fetch("https://api.example.com/2").then(r => r.json());
    const p3 = fetch("https://api.example.com/3").then(r => r.json());
    const p4 = fetch("https://api.example.com/4").then(r => r.json());

    // Group 1: aggregate res1 + res2
    const group1Promise = Promise.all([p1, p2]).then(([d1, d2]) => {
      // custom aggregation logic
      return { group: "first-two", data: [...d1, ...d2] };
    });

    // Group 2: aggregate res3 + res4
    const group2Promise = Promise.all([p3, p4]).then(([d3, d4]) => {
      return { group: "last-two", data: [...d3, ...d4] };
    });

    // Final aggregation (both groups in parallel)
    const finalResult = await Promise.all([group1Promise, group2Promise]).then(
      ([g1, g2]) => {
        return { allData: [...g1.data, ...g2.data] };
      }
    );

    console.log("Final aggregated result:", finalResult);
  } catch (err) {
    console.error("One of the calls failed:", err);
  }
}
