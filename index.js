const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/users", (req, res) => {
  res.json({ a: "a", b: "b" });
});

app.get("/api", (req, res) => {
  res.json({ message: "User created successfully" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
