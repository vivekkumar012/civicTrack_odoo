



import express from 'express';
import { createIssue, getAllIssues, getIssueById, updateIssueStatus, deleteIssue } from '../controllers/issue.controllers.js';
import { upload } from '../Middleware/multer.middleware.js';  // multer memory storage

const router = express.Router();

router.post('/', upload.single('photo'), createIssue);

router.get('/getAllIssues', getAllIssues);
router.get('/getIssueById:id', getIssueById);
router.patch('/:id/status', updateIssueStatus);
router.delete('/deleteIssue:id', deleteIssue);

export default router;


