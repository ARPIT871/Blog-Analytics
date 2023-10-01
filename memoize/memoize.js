const axios = require('axios');
const _ = require('lodash');

// ---------A function that performs the blog search-------
const performBlogSearch = async (query) => {
  try {
    // Make the API request to fetch blog data
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    if (!response || !response.data || !response.data.blogs) {
      console.log('No data found in the API response');
      return []; // Return an empty array if no data is found
    }

    const blogs = response.data.blogs;

    // Filter blogs based on the query (case-insensitive)
    const filteredBlogs = _.filter(blogs, (blog) => {
      const blogTitle = blog.title.replace(/\s/g, '').toLowerCase();
      const queryWithoutSpaces = query.replace(/\s/g, '').toLowerCase();
      return blogTitle == queryWithoutSpaces;
    });

    return filteredBlogs;
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to be handled by the caller
  }
};

//  A memoized  of the search function
const memoizedBlogSearch = _.memoize(performBlogSearch, (query) => query.toLowerCase());


// -------------Analytics memoized part---------

const getAnalytics = async () => {
  try {
    // Make the API request to fetch blog data
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    if (!response || !response.data || !response.data.blogs) {
      console.log('No data found in the API response');
      return {}; // Return an empty object if no data is found
    }

    const blogs = response.data.blogs;

    // Calculate the total number of blogs
    const totalBlogs = blogs.length;

    // Find the blog with the longest title
    const longestBlog = _.maxBy(blogs, (blog) => blog.title.length);

    // Determine the number of blogs with "privacy" in the title
    const privacyBlogs = _.filter(blogs, (blog) => _.includes(blog.title.toLowerCase(), 'privacy'));

    // Create an array of unique blog titles
    const uniqueTitles = _.uniqBy(blogs, 'title');

    return {
      totalBlogs,
      longestBlog: longestBlog.title,
      privacyBlogCount: privacyBlogs.length,
      uniqueTitles: uniqueTitles.map((blog) => blog.title),
    };
  } catch (error) {
    console.error(error);
    throw error; // Throw the error to be handled by the caller
  }
};

// Create a memoized version of the analytics function
const memoizedGetAnalytics = _.memoize(getAnalytics);

module.exports = {
  memoizedBlogSearch,
  memoizedGetAnalytics
};
