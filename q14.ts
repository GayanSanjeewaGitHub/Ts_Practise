import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const THIRD_PARTY_API = "https://api.example.com/movies"; 

app.get("/movies/:id", async (req: Request, res: Response) => {
      const movieId = req.params.id;

 try {
    // Call third-party API
    const response = await fetch(`${THIRD_PARTY_API}/${movieId}`);
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch movie info" });
    }

    // Assume the third-party API returns JSON like:
    // { id: "123", title: "Inception", actors: ["Leonardo", "Ellen", "Tom"] }
    const data = await response.json();

    // Extract actors list
    const actors: string[] = data.actors || [];

    // Return actors as JSON
    return res.json({
      movieId,
      actors
    });
  } catch (err) {
    console.error("Error fetching third-party API:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }


});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});