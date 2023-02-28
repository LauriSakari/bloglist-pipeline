/* eslint-disable no-undef */
const _ = require('lodash')
const Blogs = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
]

const nonExistingId = async () => {
  const blog = new Blogs({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blogs.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if ( blogs.length === 0 ) {
    return null
  }
  const favourite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  const printFavourite = {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  }
  return printFavourite
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(b => b.author)

  const blogsPerAuthor = _.values(_.groupBy(authors)).map(a => ({ author: a[0], blogs: a.length }))
  const result = blogsPerAuthor.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)

  return result
}

const mostLikes = (blogs) => {
  const result = blogs.reduce((authorsLikes, object) => {
    authorsLikes[object.author] = authorsLikes[object.author] || []
    authorsLikes[object.author].push(
      object.likes
    )
    return authorsLikes
  }, {})

  const entries = Object.entries(result)

  const mapped = entries.map(line => ([line[0], _.sum(line[1])]))
  const mostLikes = mapped.reduce((prev, current) => (prev[1] > current[1]) ? prev : current)
  const printResult = {
    author: mostLikes[0],
    likes: mostLikes[1]
  }
  return printResult
}


module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}