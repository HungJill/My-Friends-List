const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'

const dataPanel = document.querySelector('#data-panel')
const friends = JSON.parse(localStorage.getItem('favoriteFriends')) || []

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
               <div class="p-2"><i class="fa-solid fa-heart-circle-minus btn btn-outline-light text-dark btn-remove-favorite" data-id="${friend.id}"></i></div>
            </div>
          </div>
        </div>
      </div>`
  })
  // paste in dataPanel
  dataPanel.innerHTML = rawHTML
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

// for remove item from favorite
function removeFromFavorite(id) {
  // 以防陣列id錯誤或陣列是空的
  if (!friends || !friends.length) return
  // check the site of item
  const index = friends.findIndex((friend) => friend.id === id)
  if (index === -1) return
  friends.splice(index, 1)
  //存回localstorage
  localStorage.setItem('favoriteFriends', JSON.stringify(friends))
  renderFriendsPanel(friends)
}
//  add listener to 'MORE'  Asynchronous
dataPanel.addEventListener('click', function onPanelClicked(event) {
  const target = event.target
  //  IF click MORE, show Friends Modal
  if (target.matches('.btn-friends-show')) {
    // console.log(target.dataset)  DOMStringMap....{id:...}
    showFriendsPanel(Number(target.dataset.id))
    // IF click Favorite,addToFavorite
  } else if (target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(target.dataset.id))
  }
})
renderFriendsPanel(friends)


