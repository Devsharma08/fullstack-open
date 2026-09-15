const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '1',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
  {
    _id: '2',
    title: 'Canonicalization: A Key to Data Quality',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/canonicalization.html',
    likes: 7,
  },
  {
    _id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2008/07/08/this-is-not-the-same.html',
    likes: 3,
  },
  {
    _id: '4',
    title: 'The Humble Programmer',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/users/EWD/transcriptions/EWD03xx/EWD340.html',
    likes: 12,
  },
]

test('dummy returns one', () => {
  assert.strictEqual(listHelper.dummy([]), 1)
})

describe('total likes', () => {
  test('of an empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('of a list with multiple blogs is the sum of likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 27)
  })
})

describe('favorite blog', () => {
  test('is the blog with the most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[3])
  })
})

describe('most blogs', () => {
  test('is the author with the most blog posts', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'Edsger W. Dijkstra',
      blogs: 2,
    })
  })
})

describe('most likes', () => {
  test('is the author with the most total likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
