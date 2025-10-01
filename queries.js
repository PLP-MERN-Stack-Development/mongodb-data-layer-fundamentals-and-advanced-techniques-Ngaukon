// Find all books in a specific genre (e.g., Fiction)
db.books.find({ genre: "Fiction" })

// Find books published after a certain year (e.g., after 1950)
db.books.find({ published_year: { $gt: 1950 } })

// Find books by a specific author (e.g., George Orwell)
db.books.find({ author: "George Orwell" })

// Update the price of a specific book (e.g., The Hobbit → new price 20.99)
db.books.updateOne(
  { title: "The Hobbit" },             // filter: find this book
  { $set: { price: 20.99 } }           // update: set new price
)

// Delete a book by its title (e.g., delete Moby Dick)
db.books.deleteOne({ title: "Moby Dick" })




// Task 3: Advanced Queries

// Find books that are both in stock and published after 2010
db.books.find({
  in_stock: true,                      // condition 1: must be in stock
  published_year: { $gt: 2010 }        // condition 2: published after 2010
})


// Use projection to return only the title, author, and price fields
db.books.find(
  {},                                  // no filter (all books)
  { title: 1, author: 1, price: 1, _id: 0 } // projection: include only these fields
)


// Implement sorting to display books by price

// (a) Ascending order (lowest price first)
db.books.find().sort({ price: 1 })

// (b) Descending order (highest price first)
db.books.find().sort({ price: -1 })


// Pagination with limit and skip (5 books per page)

// Page 1: first 5 books
db.books.find().limit(5)

// Page 2: skip first 5, then take next 5
db.books.find().skip(5).limit(5)

// Page 3: skip first 10, then take next 5
db.books.find().skip(10).limit(5)



// Task 4: Aggregation Pipeline

// An aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",                 // group by genre
      avgPrice: { $avg: "$price" }   // calculate average price per genre
    }
  }
])

// An aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",                 // group by author
      totalBooks: { $sum: 1 }         // count how many books per author
    }
  },
  {
    $sort: { totalBooks: -1 }         // sort by book count, highest first
  },
  {
    $limit: 1                         // keep only the top author
  }
])

// Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: { 
        decade: { 
          $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ]
        }                            // floor(year/10)*10 → decade (e.g., 1950s)
      },
      count: { $sum: 1 }              // count how many books per decade
    }
  },
  {
    $sort: { "_id.decade": 1 }        // sort by decade ascending
  }
])




// Task 5: Indexing

// Create an ascending index on the "title" field
db.books.createIndex({ title: 1 })

// Create a compound index on author + published_year
db.books.createIndex({ author: 1, published_year: -1 })

// Use explain() to compare performance
db.books.find({ title: "The Hobbit" }).explain("executionStats")
