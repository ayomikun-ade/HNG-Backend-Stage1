require("dotenv").config();
const express = require("express");
const { handleRequest } = require("./controllers/controller");

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("true proxy", true);

app.get("/api/hello", handleRequest);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Server running. Go to <a href='/api/hello'>/api/hello</a> and add you name to the query"
    );
});

//listening on port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
