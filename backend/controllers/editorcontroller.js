const Document = require('../models/document');
const express = require('express');
const router = express.Router();
const pdf = require('html-pdf');
const htmlToDocx = require('html-to-docx');
const fs = require('fs');

router.get('/get/:userId/:documentId', async (req, res) => {
  try {
    const document = await Document.findOne({
      userId: req.params.userId,
      _id: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ content: document.content });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// UPDATE document content
router.put('/update/:userId/:documentId', async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
        {
          userId: req.params.userId,
          _id: req.params.documentId,
        },
        { $set: { 'content.text': req.body.content.text } },
        { new: true }
      );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully' });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DOWNLOAD document content
router.get('/download/:userId/:documentId/:format', async (req, res) => {
    try {
      const document = await Document.findOne({
        userId: req.params.userId,
        _id: req.params.documentId,
      });
  
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
  
      // Get the content of the document
      const documentText = document.content.text;
  
      if (req.params.format === 'pdf') {
        // PDF conversion
        const pdfOptions = { format: 'Letter' };
        pdf.create(documentText, pdfOptions).toBuffer((err, buffer) => {
          if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          // Set response headers for the download
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=document.${req.params.format}`);
  
          // Send the generated PDF buffer
          res.send(buffer);
        });
      } else if (req.params.format === 'doc') {
        // DOC conversion
        const docxBuffer = await htmlToDocx(documentText);
        
        // Set response headers for the download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=document.${req.params.format}`);
        
        // Send the generated DOC buffer
        res.send(docxBuffer);
      } else {
        return res.status(400).json({ error: 'Invalid format specified' });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
