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
app.get("/teacher", function (req, res) {
    res.render(__dirname + "/teacher.ejs")
});
// app.post("/indexteacher", function (req, res) {
//     const a=5;
//     res.send("Your BMI is : " + a);
// });
app.listen("3000", () => {
    console.log(`server is running on port 3000`);
});