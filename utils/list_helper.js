const totalLikes = posts => {
  let total = 0;
  if (posts.length === 0) { return total; }
  posts.map(post => total += post.likes);
  
  return total;
}

const favoriteBlog = posts => {
  let topLiked = { likes: 0 };
  posts.map(post => {
    if (post.likes > topLiked.likes) {
      topLikes = { 
        title: post.title,
        author: post.author,
        likes: post.likes
      };
    }

    return topLiked;
  });
}

module.exports = {
  totalLikes,
  favoriteBlog
};