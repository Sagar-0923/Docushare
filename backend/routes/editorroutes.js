const express = require('express');
const editorcontroller = require('../controllers/editorcontroller');
const router = express.Router();

router.get('/get/:documentId', editorcontroller.getDocumentById);
router.put('/update/:documentId', editorcontroller.updateDocumentById);
router.get('/download/:documentId/:format', editorcontroller.downloadDocument);

module.exports = router;
