const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
// 每頁預計顯示的item數目
const FRIENDS_PER_PAGE = 16

const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const friends = []
let filterFriends = []
let currentPage = 1

//  render Friends datapanel
function renderFriendsPanel(data) {
  // render HTML
  let rawHTML = ''
  data.forEach((friend) => {
    rawHTML += `<div class="col-sm-3 mb-2">
        <div class="card">
          <img src="${friend.avatar}" class="card-img-top" alt="friends-avatar">
          <div class="card-body">
            <h5 class="card-title fw-semibold fs-4">${friend.name} </h5>
            <div class="d-flex align-items-center">
              <div class="me-auto p-2 fs-6 text-muted"><i class="fa-solid fa-flag"> ${friend.region}</i></div>
              <div class="p-2"><a href="#" class="btn btn-info text-white btn-sm btn-friends-show" data-bs-toggle="modal"
              data-bs-target="#modal-friends" data-id='${friend.id}'>More</a></div>
               <div class="p-2"><i class="fa-solid fa-heart-circle-plus btn btn-outline-light text-info btn-add-favorite" data-id="${friend.id}"></i></div>
            </div>
          </div>
        </div>
      </div>`
  })
  // paste in dataPanel
  dataPanel.innerHTML = rawHTML
}

// render paginator 計算需要被分成幾頁
function renderPaginator(amount) {
  //calculate the total pages
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//  friends modal
function showFriendsPanel(id) {
  const avatar = document.querySelector('#modal-friends-avatar')
  const title = document.querySelector('#modal-friends-title')
  const email = document.querySelector('#modal-friends-email')
  const gender = document.querySelector('#modal-friends-gender')
  const age = document.querySelector('#modal-friends-age')
  const region = document.querySelector('#modal-friends-region')
  const birthday = document.querySelector('#modal-friends-birthday')

  // SHOW_API Asynchronous 
  axios.get(INDEX_URL + '/' + id)
    .then(function (response) {
      //(6) paste to friends modal
      const data = response.data
      console.log(data.avatar)
      avatar.innerHTML = `<img src="${data.avatar}" class="rounded-circle" alt="friends-avatar">`
      title.textContent = `${data.name}  ${data.surname}`
      email.innerHTML = `email: <a href="mailto: ${data.email}">${data.email}</a>`
      gender.textContent = `gender: ${data.gender}`
      age.textContent = `age: ${data.age}`
      region.textContent = `region: ${data.region}`
      birthday.textContent = `birthday: ${data.birthday}`
    })
    .catch(function (error) {
    })

}

// for add friend to favorite page
function addToFavorite(id) {
  // 取得資料
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  // create a variable for filter favorite friend 回傳第一組
  const friend = friends.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('The pen pal has been added!!')
  }
  //只放進一組
  list.push(friend)
  //每放進一組就存起來，console.log(list)才會變成多個元素的陣列
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
}

// for paginator  items of every page
function getFriendsByPage(page) {
  //若filterFriends為空陣列，data為friends
  const data = filterFriends.length? filterFriends : friends 
  // 起點
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

//  add listener to 'MORE'  Asynchronous
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const target = event.target
  //  IF click MORE, show Friends Modal
  if (target.matches('.btn-friends-show')) {
    // console.log(target.dataset)  DOMStringMap....{id:...}
    showFriendsPanel(Number(target.dataset.id))
    // IF click Favorite,addToFavorite
  } else if (target.matches('.btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
  }
})

// add listener to 'PAGE' 
paginator.addEventListener('click', function onPageClicked(event) {
  //以防點擊到的不是page
    if (event.target.tagName !== 'A') return
  
  const page = Number(event.target.dataset.page)
  // render the panel (not paginator)
  renderFriendsPanel(getFriendsByPage(page))
})

//add listener to 'search form'
searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
 
  filterFriends = friends.filter((friend) => 
    friend.name.toLowerCase().trim().includes(keyword) ||
    friend.gender.toLowerCase().includes(keyword)||
    friend.region.toLowerCase().includes(keyword))

  if (filterFriends.length === 0) {
    return alert (`Cannot find any pen pal with ${keyword}`)
  }
  console.log(filterFriends)
  console.log(filterFriends.length)
  //currentPage = 1
  renderPaginator(filterFriends.length)
  renderFriendsPanel(getFriendsByPage(currentPage))  
})

//  INDEX_API ()  Asynchronous
axios.get(INDEX_URL)
  .then(function (response) {
    //Array(200)
    // add to array(friends)
    friends.push(...response.data.results)
    // render friends, 就不是一次代入全部了，預設代入第一頁
    renderFriendsPanel(getFriendsByPage(1))
    // render paginator
    renderPaginator(friends.length)
  })
  .catch(function (error) {
  })


