require("dotenv").config();
const express = require("express");
const cors = require("cors");

const parseRoute = require("./routes/parse");
const scoreRoute = require("./routes/score");
const chatRoute = require("./routes/chat");
const reportRoute = require("./routes/report");
const uploadRoute = require("./routes/upload");
const deleteRoute = require("./routes/delete");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/parse", parseRoute);
app.use("/api/score", scoreRoute);
app.use("/api/chat", chatRoute);
app.use("/api/report", reportRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/delete", deleteRoute);

app.get("/", (req, res) => res.send("Kharcha API running ✓"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
