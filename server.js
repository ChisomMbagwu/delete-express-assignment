const studentDB = require("./db/database.json");
const express = require("express");
const uuid = require("uuid").v4();
const writeFile = require("./helper/writefile");
const PORT = 5000;

const app = express();
app.use(express.json());
app.post("/create-student", async (req, res) => {
    const { name, email, age, gender, isMarried } = req.body;

    if (!name) return res.status(400).json({ message: "Please enter your name" });
    if (!email) return res.status(400).json({ message: "Please enter your email" });
    if (!age) return res.status(400).json({ message: "Please enter your age" });
    if (!gender) return res.status(400).json({ message: "Please enter your gender" });
    if (isMarried === undefined) return res.status(400).json({ message: "Please specify if you are married" });

    const student = {
        id: uuid(),
        name,
        email: email.toLowerCase(),
        age,
        gender,
        isMarried,
    };

    studentDB.push(student);
    try {
        await writeFile(studentDB);
        return res.status(201).json({ message: "Student created successfully", data: student });
    } catch (err) {
        return res.status(500).json({ message: "Failed to save student", error: err.message });
    }
});


app.get("/all-students", (req, res) => {
    const students = studentDB.length;
    
if (students === 0) {
return res.status(404).json({

  message: "No students found",

});

}

res.status(200).json({
message: "All students below",
total: studentDB.length,
data: studentDB,
});
});

app.get("/student/:id", (req, res) => {
const { id } = req.params;
const student = studentDB.find((e) => {
return e.id === id;
});

if (!student) {
res.status(404).json({
    message: "No student found",
});

}

res.status(200).json({
message: "Student available",
data: student,
});

});

app.put("/update-student/:id", async (req, res) => {

const { name, age, email, gender, isMarried } = req.body;
const { id } = req.params;

const student = studentDB.find((e) => {
return e.id === id;
});

if (!student) {
return res.status(404).json({
    message: "No student found",
});

}

const update = {
name: name ?? student.name,
age: age ?? student.age,
email: email ?? student.email,
gender: gender ?? student.gender,
isMarried: isMarried ?? student.isMarried,
};

const index = studentDB.findIndex((e) => {
return e.id === student.id;
});

const result = { ...student, ...update };

studentDB[index] = result;
await writeFile(studentDB);

res.status(200).json({
message: "Student updated successfully",
data: result,
});

});

app.delete("/delete-student/:id", async (req, res) => {

const { id } = req.params;
const index = studentDB.findIndex((student) => student.id === id);

if (index === -1) {
res.status(404).json({
    message: "No student Of that ID found",
});

}

console.log(index);
const deleteStudent = studentDB.splice(index, 1);

console.log(studentDB);

await writeFile(studentDB);
res.status(200).json({
message: "Student deleted successfully",
data: deleteStudent,
});

});

app.delete("/delete-all", async (req, res) => {

if (studentDB.length < 1) {
return res.status(404).json({
  message: `No student found in the database ${studentDB.length}`,
});

}

studentDB.splice(0);

await writeFile(studentDB);
res.status(200).json({
message: "All students deleted successfully",
data: studentDB,
});

});

app.listen(PORT, () => {
console.log(`Server is running on PORT ${PORT}`);

});