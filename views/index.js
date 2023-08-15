import { log } from "console";
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static("public"));
app.get("/", function (req, res) {
    res.render("index.ejs");
});
app.get("/student", function (req, res) {
    console.log("hii");
    res.render(__dirname + "/student.ejs");
});
app.get("/teacher", function (req, res) {
    // console.log("klkl");
    // console.log("klkl");
    // console.log("hii2");
    res.render(__dirname + "/teacher.ejs");
});
app.get("/assessment", function (req, res) {
    res.render(__dirname + "/assessment.ejs");
});
// app.post("/indexteacher", function (req, res) {
//     const a=5;
//     res.send("Your BMI is : " + a);
// });
app.listen("3000", () => {
    console.log(`server is running on port 3000`);
});