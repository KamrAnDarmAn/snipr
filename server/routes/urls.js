const verifyToken = require("../middlewares/authMiddleware");

const router = require("express").Router();

const {
  createUrl,
  deleteUrl,
  getAllUrls,
  getUrlById,
  updateUrl,
} = require("../controllers/urlsControllers");

router.post("/create", verifyToken, createUrl);
router.get("/get", verifyToken, getAllUrls);
router.get("/get/:id", getUrlById);
router.put("/update/:id", verifyToken, updateUrl);
router.delete("/delete/:id", verifyToken, deleteUrl);

module.exports = router;
