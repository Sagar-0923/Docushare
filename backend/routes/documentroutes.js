const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentcontroller');

router.get('/get/:userId', documentController.getDocumentsByUserId);
router.post('/create', documentController.createDocument);
router.delete('/delete', documentController.deleteDocumentByName);
router.put('/update', documentController.updateDocumentContent);

module.exports = router;
