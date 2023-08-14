import express from "express";
const app = express();
app.get("/", function (req, res) {
    res.render("index.ejs");

});
app.listen("3000",()=>{
    console.log(`server is running on port 3000`);
});