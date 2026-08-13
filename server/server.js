const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// READ
app.get("/api/students", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM students ORDER BY id ASC"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get students" });
    }
});

// CREATE
app.post("/api/students", async (req, res) => {
    try {
        const { name, age, course } = req.body;

        const [result] = await pool.query(
            "INSERT INTO students (name, age, course) VALUES (?, ?, ?)",
            [name, age, course]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            age,
            course
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create student" });
    }
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, course } = req.body;

        await pool.query(
            `UPDATE students
             SET name = ?, age = ?, course = ?
             WHERE id = ?`,
            [name, age, course, id]
        );

        res.json({ message: "Student updated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update student" });
    }
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM students WHERE id = ?",
            [id]
        );

        res.json({ message: "Student deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete student" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});