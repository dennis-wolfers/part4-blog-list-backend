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

const mostBlogs = (blogs) => {
  const authorWithTheMostBlogs = { blogs: 0 }
  const numberOfBlogsPerAuthor = {}

  blogs.map((blog) => {
    numberOfBlogsPerAuthor[blog.author] ? numberOfBlogsPerAuthor[blog.author]++ : numberOfBlogsPerAuthor[blog.author] = 1
  })

  for (const property in numberOfBlogsPerAuthor) {
    if (numberOfBlogsPerAuthor[property] > authorWithTheMostBlogs.blogs) {
      authorWithTheMostBlogs.author = property
      authorWithTheMostBlogs.blogs = numberOfBlogsPerAuthor[property]
    }
  }

  return authorWithTheMostBlogs
}

const mostLikes = (blogs) => {
  const authorWithTheMostLikes = { author: '', likes: 0 }
  const authorTotalLikes = {}

  blogs.map(blog => {
    authorTotalLikes[blog.author] ? authorTotalLikes[blog.author] += blog.likes : authorTotalLikes[blog.author] = blog.likes
  })

  for (const property in authorTotalLikes) {
    if (authorTotalLikes[property] > authorWithTheMostLikes.likes) {
      authorWithTheMostLikes.author = property
      authorWithTheMostLikes.likes = authorTotalLikes[property]
    }
  }
  console.log(authorWithTheMostLikes)
  return authorWithTheMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}