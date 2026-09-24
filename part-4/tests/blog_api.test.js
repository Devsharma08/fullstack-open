require('dotenv').config()
const { test, describe, beforeEach, before, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    title: 'Canonicalization: A Key to Data Quality',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/canonicalization.html',
    likes: 7,
  },
]

let token = null
let userId = null

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloglist')
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  const savedUser = await user.save()
  userId = savedUser._id

  // Create initial blogs with user reference
  const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: savedUser._id }))
  const savedBlogs = await Blog.insertMany(blogsWithUser)

  // Add blog IDs to user's blogs array
  savedUser.blogs = savedBlogs.map(blog => blog._id)
  await savedUser.save()

  // Login to get token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
  token = loginResponse.body.token
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('blogs include user information', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert.ok(blog.user)
      assert.strictEqual(blog.user.username, 'root')
    })
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added with valid token', async () => {
    const newBlog = {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2008/07/08/this-is-not-the-same.html',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const titles = response.body.map((blog) => blog.title)
    assert.ok(titles.includes('Clean Code'))
  })

  test('blog without token returns 401', async () => {
    const newBlog = {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2008/07/08/this-is-not-the-same.html',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title returns 400', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://test.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blog without url returns 400', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('a blog can be deleted by its creator', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map((blog) => blog.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  test('deleting non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString()
    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('deleting blog without token returns 401', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })

  test('updating non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString()
    const updatedBlog = {
      title: 'Updated',
      author: 'Author',
      url: 'https://test.com',
      likes: 10,
    }

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(updatedBlog)
      .expect(404)
  })
})

describe('GET /api/users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('users include their blogs', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
    assert.ok(response.body[0].blogs)
    assert.strictEqual(response.body[0].blogs.length, initialBlogs.length)
  })

  test('password hash is not included in response', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body[0].passwordHash, undefined)
  })
})

describe('POST /api/users', () => {
  test('a valid user can be created', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 2)

    const usernames = response.body.map((user) => user.username)
    assert.ok(usernames.includes('testuser'))
  })

  test('user without username returns 400', async () => {
    const newUser = {
      name: 'Test User',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
  })

  test('user without password returns 400', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
  })

  test('username shorter than 3 chars returns 400', async () => {
    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
  })

  test('password shorter than 3 chars returns 400', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'ab',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
  })

  test('duplicate username returns 400', async () => {
    const newUser = {
      username: 'root',
      name: 'Another Root',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 1)
  })
})

describe('POST /api/login', () => {
  test('login succeeds with correct credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    assert.ok(response.body.token)
    assert.strictEqual(response.body.username, 'root')
    assert.strictEqual(response.body.name, 'Superuser')
  })

  test('login fails with wrong password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)
  })

  test('login fails with non-existent user', async () => {
    await api
      .post('/api/login')
      .send({ username: 'nonexistent', password: 'sekret' })
      .expect(401)
  })
})

after(async () => {
  await mongoose.connection.close()
})