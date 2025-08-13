const express = require("express");
const authUser = require("./routes/auth");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const UrlRouter = require("./routes/urls");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(cookieParser());
app.use("/auth", authUser);
app.use("/", UrlRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
