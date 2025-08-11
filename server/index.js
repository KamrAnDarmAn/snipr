const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();
const express = require("express");
const { nanoid } = require("nanoid");
const authUser = require("./routes/auth");
const verifyToken = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const validUrl = require("valid-url");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(cookieParser());
app.use("/auth", authUser);

const PORT = process.env.PORT || 3001;

app.post("/create", verifyToken, async (req, res) => {
  try {
    const userId = req.id;
    const { originalUrl } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }
    if (!validUrl.isWebUri(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const uuid = nanoid(6);
    const url = await prisma.url.create({
      data: {
        longUrl: originalUrl,
        shortUrl: uuid,
        userId, // Simplified, since userId is required
      },
    });

    res.json({ message: "URL created successfully", url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/get", verifyToken, async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      where: { userId: req.id }, // Fixed from req.userId
    });
    res.json({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const url = await prisma.url.findUnique({
      where: { shortUrl: id },
      select: { longUrl: true },
    });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    await prisma.url.update({
      where: { shortUrl: id },
      data: { click: { increment: 1 } },
    });

    res.redirect(url.longUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { originalUrl } = req.body;

    if (!validUrl.isWebUri(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const existingUrl = await prisma.url.findUnique({
      where: { shortUrl: id },
    });
    if (!existingUrl) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (existingUrl.userId !== req.id) {
      return res.status(403).json({ error: "Unauthorized: Not your URL" });
    }

    const shortId = nanoid(6);
    const existingShortUrl = await prisma.url.findUnique({
      where: { shortUrl: shortId },
    });
    if (existingShortUrl) {
      return res
        .status(409)
        .json({ error: "Generated short URL already exists" });
    }

    const url = await prisma.url.update({
      where: { shortUrl: id },
      data: { longUrl: originalUrl, shortUrl: shortId },
    });

    res.status(200).json({ message: "URL updated successfully", url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existingUrl = await prisma.url.findUnique({
      where: { shortUrl: id },
    });
    if (!existingUrl) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (existingUrl.userId !== req.id) {
      return res.status(403).json({ error: "Unauthorized: Not your URL" });
    }

    await prisma.url.delete({ where: { shortUrl: id } });
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
