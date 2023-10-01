const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import memoized functions for blog search and analytics
const { memoizedBlogSearch, memoizedGetAnalytics } = require('./memoize/memoize'); // Update the path as needed

// Middleware to fetch and analyze blog data
app.use('/api/blog-stats', async (req, res, next) => {
  try {
    const analytics = await memoizedGetAnalytics();
    res.status(200).json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    res.status(400).json({ error: "Query Parameter is required" });
    return;
  }

  try {
    const searchResults = await memoizedBlogSearch(query);
    res.json(searchResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware for unhandled errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${port}`);
});
