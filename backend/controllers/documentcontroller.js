const express = require('express');
const router = express.Router();

const Document = require('../models/document');  // Assuming you have a Document model

// Get documents based on user id
router.get('/api/documents/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log('Fetching documents for userId:', userId);  // Add this line
      const documents = await Document.find({ userId });
      console.log('Fetched documents:', documents);  // Add this line
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Create a new document
router.post('/api/create-document/:userId', async (req, res) => {
    try {
      const { name, date_of_creation } = req.body;
      const userId = req.params.userId;
  
      // Check if a document with the same name already exists for the user
      const existingDocument = await Document.findOne({ name, userId });
      if (existingDocument) {
        return res.status(400).json({ error: 'Document with the same name already exists.' });
      }
  
      // Create a new document if the name is unique
      const newDocument = await Document.create({ name, userId, date_of_creation });
      res.json(newDocument);
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Delete a document based on document id
router.delete('/api/delete-document/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    await Document.findByIdAndDelete(documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update the name of a document based on document id
router.put('/api/update-document/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { name } = req.body;
    const updatedDocument = await Document.findByIdAndUpdate(documentId, { name }, { new: true });
    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;