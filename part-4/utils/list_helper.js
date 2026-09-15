const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  const counts = blogs.reduce((authors, blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
    return authors
  }, {})

  return Object.entries(counts).reduce((most, [author, count]) =>
    count > most.blogs ? { author, blogs: count } : most,
    { author: '', blogs: 0 }
  )
}

const mostLikes = (blogs) => {
  const likesByAuthor = blogs.reduce((authors, blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
    return authors
  }, {})

  return Object.entries(likesByAuthor).reduce((most, [author, likes]) =>
    likes > most.likes ? { author, likes } : most,
    { author: '', likes: 0 }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
