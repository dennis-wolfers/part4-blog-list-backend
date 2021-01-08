const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  if (blogs.length === 1) return blogs[0].likes

  return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max.apply(Math, blogs.map(blog => blog.likes))
  const mostLikedBlogs = blogs.filter(blog => blog.likes === mostLikes)
  const mostLikedBlog = {
    title: mostLikedBlogs[0].title,
    author: mostLikedBlogs[0].author,
    likes: mostLikedBlogs[0].likes
  }

  return mostLikedBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}