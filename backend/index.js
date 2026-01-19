// index.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to mock students file
const studentsFile = path.resolve("./students.json");

// Load students
let students = [];
try {
    const data = fs.readFileSync(studentsFile, "utf-8");
    students = JSON.parse(data);
    if (!Array.isArray(students)) students = [];
} catch (err) {
    console.error("Error loading students.json. Make sure it exists.", err);
    students = [];
}

// POST endpoint for opportunity processing
app.post("/process-opportunity", (req, res) => {
    const { opportunityText } = req.body;
    if (!opportunityText || opportunityText.trim() === "") {
        return res.status(400).json({ error: "Opportunity text is required." });
    }

    // Simple category detection (for demo purposes)
    let category = "General";
    const text = opportunityText.toLowerCase();
    if (text.includes("internship")) category = "Internship";
    else if (text.includes("job") || text.includes("placement")) category = "Job";
    else if (text.includes("scholarship") || text.includes("grant")) category = "Scholarship";

    // Find students whose interests match (simple keyword match)
    const alertedStudents = students.filter(s =>
        s.interests.some(interest => text.includes(interest.toLowerCase()))
    );

    // Students who didn't match
    const missedStudents = students.filter(s => !alertedStudents.includes(s));

    // Send response
    res.json({
        opportunity: opportunityText,
        category,
        alertedStudents,
        missedStudents
    });
});

// Start server
app.listen(PORT, () => {
    console.log('Backend running on http://localhost:${PORT}');
});