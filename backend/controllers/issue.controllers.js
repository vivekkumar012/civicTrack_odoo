

import { Issue } from "../Model/issue.model.js"; // Adjust path as needed
import cloudinary from '../utils/cloudinary.utils.js'; // adjust path


// Create new issue

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Photo is required." });
    }

    // Upload buffer from multer memory storage to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'civictrack_issues' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return next(error);
        }
        // Save issue with photo URL from Cloudinary
        const newIssue = new Issue({
          title,
          description,
          location,
          photo: result.secure_url,
        });

        newIssue.save()
          .then(savedIssue => {
            return res.status(201).json(savedIssue);
          })
          .catch(saveErr => {
            return next(saveErr);
          });
      }
    );

    // Pipe multer file buffer to cloudinary uploader
    result.end(req.file.buffer);

  } catch (error) {
    next(error);
  }
};


// Get all issues
export const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.log(error)
  }
};

// Get issue by ID
export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    console.log(error)
  }
};

// Update issue status
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["Pending", "InProgress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(updatedIssue);
  } catch (error) {
    console.log(error)
  }
};

// Delete issue by ID
export const deleteIssue = async (req, res, next) => {
  try {
    const deletedIssue = await Issue.findByIdAndDelete(req.params.id);
    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.log(error)
  }
};
