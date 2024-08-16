const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const cors = require('cors');
app.use(cors(`*`));

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

// Get all movies with their reviews
app.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        reviews: true,
      },
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single movie by ID with its reviews
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movies = await prisma.movie.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          image: true,  
          reviews: true,  
        },
      });
      res.json(movies);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Add a new movie
// app.post('/movies', async (req, res) => {
//   const { title, description } = req.body;
//   try {
//     const newMovie = await prisma.movie.create({
//       data: { title, description },
//     });
//     res.status(201).json(newMovie);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Add a new review to a movie
app.post('/movies/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        content,
        author,
        movie: { connect: { id: parseInt(id) } },
      },
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a review
// app.put('/reviews/:id', async (req, res) => {
//   const { id } = req.params;
//   const { content } = req.body;
//   try {
//     const updatedReview = await prisma.review.update({
//       where: { id: parseInt(id) },
//       data: { content },
//     });
//     res.json(updatedReview);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Delete a review
app.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
