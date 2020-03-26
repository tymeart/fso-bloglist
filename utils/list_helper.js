const totalLikes = posts => {
  let total = 0;
  if (posts.length === 0) { return total; }
  posts.map(post => total += post.likes);
  
  return total;
}

const favoriteBlog = posts => {
  let topLiked = { likes: 0 };
  if (posts.length === 0) { return 'No blogs provided.' }
  
  posts.map(post => {
    if (post.likes > topLiked.likes) {
      topLiked = { 
        title: post.title,
        author: post.author,
        likes: post.likes
      };
    }
  });

  if (topLiked.likes === 0) {
    return 'There is no favorite yet.';
  }

  return topLiked;
}

module.exports = {
  totalLikes,
  favoriteBlog
};