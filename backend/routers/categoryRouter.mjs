import express from "express";
import Category from "../models/CategorySchema.mjs";

const categoryRouter = express.Router();

categoryRouter.post("/", async (req, res) => {
  try {
    const { userId, name, type } = req.body;
    const categoryObject = new Category({ userId, name, type });
    await categoryObject.save();
    res
      .status(201)
      .json({ message: "Category successfully created", data: categoryObject });
  } catch (error) {
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
});

categoryRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userCategory = await Category.find({ userId: userId });
    res.status(200).json(userCategory);
  } catch (error) {
    res.status(500).json({ message: "Error Occured", error: error.message });
  }
});

export default categoryRouter;
