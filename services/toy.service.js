const fs = require('fs')
const Toys = require('../data/toy.json')

const PAGE_SIZE = 3

module.exports = {
  query,
  save,
  remove,
  getById,
}

function query(criteria) {
  const { filterBy, sortBy } = criteria

  let filteredToys = Toys
  let filter = {
    name: filterBy?.name || '',
    inStock: filterBy?.inStock === 'false' ? false : true || false,
    labels: filterBy?.labels || [],
    page: filterBy?.page || 0,
  }
  let regex = new RegExp(filter.name, 'i')
  filteredToys = filteredToys.filter(
    toy =>
      regex.test(toy.name) &&
      (!filter.inStock || toy.inStock === filter.inStock) &&
      (!filter.labels.length || filter.labels.some(label => toy.labels.includes(label)))
  )
  console.log(filteredToys.forEach(toy => console.log(toy.inStock === filter.inStock)));
  // console.log(filteredToys);
  if (filter.page) {
    const startIdx = filter.page * PAGE_SIZE
    filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
  }

  if (!sortBy?.by && !sortBy?.desc) return Promise.resolve(filteredToys)
  sortBy.by === 'name'
    ? filteredToys.sort((toy1, toy2) => toy1[sortBy.by].localeCompare(toy2[sortBy.by]))
    : filteredToys.sort((toy1, toy2) => { return (toy1[sortBy.by] - toy2[sortBy.by]) * sortBy.desc })

  return Promise.resolve(filteredToys)
}

function save(toy) {
  console.log(toy)
  if (toy._id) {
    const idx = Toys.findIndex(currToy => currToy._id === toy._id)
    if (idx === -1) return Promise.reject('No such Toy')
    Toys[idx] = toy
  } else {
    toy._id = _makeId()
    toy.createdAt = Date.now()

    Toys.push(toy)
  }

  return _saveToysToFile().then(() => toy)
}

function getById(ToyId) {
  const Toy = Toys.find(Toy => Toy._id === ToyId)
  return Promise.resolve(Toy)
}

function remove(ToyId) {
  const idx = Toys.findIndex(Toy => Toy._id === ToyId)
  if (idx === -1) return Promise.reject('No such Toy')

  Toys.splice(idx, 1)
  return _saveToysToFile()
}

function _makeId(length = 5) {
  let txt = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(Toys, null, 2)
    fs.writeFile('./data/Toy.json', content, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}
