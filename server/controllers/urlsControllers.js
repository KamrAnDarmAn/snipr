const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const validUrl = require("valid-url");
const { nanoid } = require("nanoid");

async function createUrl(req, res) {
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
}

async function getAllUrls(req, res) {
  try {
    const urls = await prisma.url.findMany({
      where: { userId: req.id }, // Fixed from req.userId
    });
    res.json({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getUrlById(req, res) {
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
}

async function updateUrl(req, res) {
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
}

async function deleteUrl(req, res) {
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
}

module.exports = {
  createUrl,
  getAllUrls,
  deleteUrl,
  getUrlById,
  updateUrl,
};
