import express,{ Router } from "express";
import axios from 'axios';

const Reviews = express.Router();


Reviews.get('/proxy-image/:id', async (req, res) => {
    const imageId = req.params.id;
  
    try {
    
      const imageUrl = `https://drive.google.com/uc?id=${imageId}`;
  
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
      });
  
      res.setHeader('Content-Type', 'image/jpeg'); 
  
      response.data.pipe(res);
    } catch (error) {
      console.error('Error fetching image:', error.message);
      res.status(500).send('Error fetching image');
    }
  });
  

export default Reviews;