async function fetchJson(url: string) {
  const res = await fetch(url);

  // If server supports streaming large JSON
  if (res.body) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
    return JSON.parse(result); // full JSON reconstructed
  }

  // Fallback: normal JSON
  return res.json();
}

async function fetchAll() {
  try {
    // Fire requests in parallel
    const [p1, p2, p3, p4] = [
      fetchJson("https://api.example.com/1"),
      fetchJson("https://api.example.com/2"),
      fetchJson("https://api.example.com/3"),
      fetchJson("https://api.example.com/4"),
    ];

    // Group aggregation
    const [g1, g2] = await Promise.all([
      Promise.all([p1, p2]).then(([d1, d2]) => ({ group: "first-two", data: [...d1, ...d2] })),
      Promise.all([p3, p4]).then(([d3, d4]) => ({ group: "last-two", data: [...d3, ...d4] })),
    ]);

    // Final result
    const finalResult = { allData: [...g1.data, ...g2.data] };
    console.log("Final aggregated result:", finalResult);
  } catch (err) {
    console.error("One of the calls failed:", err);
  }
}
