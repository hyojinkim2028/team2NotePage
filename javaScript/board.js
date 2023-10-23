import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'
import { getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyCFGVHQxjx1VHGJPr7p04pJYT2V9qSgBWE',
  authDomain: 'sparta-b3aff.firebaseapp.com',
  projectId: 'sparta-b3aff',
  storageBucket: 'sparta-b3aff.appspot.com',
  messagingSenderId: '170544802639',
  appId: '1:170544802639:web:a1aaafc9f25bde5a5d733a',
  measurementId: 'G-9FNSVJPZX2',
}

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 게시판 데이터 가져오기
let docs = await getDocs(collection(db, 'board'))

$('#boardTbody').empty()
// 뭔가 번호방법이 있을거같은데 찾아봐야함
let idx = 1
docs.forEach((doc) => {
  let row = doc.data()
  let id = doc.id
  let boardDateTime = row.boardDateTime
  let boardTitle = row.boardTitle
  let boardContent = row.boardContent

  let temp_html = `
                <tr data-documentId=${id}>
                    <td>${idx++}</td>
                    <td>${boardDateTime}</td>
                    <td class="boardTitleTd">${boardTitle}</td>
                </tr>
            `
  $('#boardTbody').append(temp_html)
})

// 게시판 등록
$('#boardModalWriteBtn').on('click', async function () {
  let boardTitle = $('#boardTitle').val()
  let boardContent = $('#boardContent').val()

  let doc = {
    boardId: '',
    boardDateTime: getDateTime(),
    boardTitle: boardTitle,
    boardContent: boardContent,
  }
  await addDoc(collection(db, 'board'), doc)
  window.location.reload()
})

// 게시판 제목 클릭시
$(document).on('click', '.boardTitleTd', async function () {
  let id = this.parentNode.dataset.documentid

  let docRef = doc(db, 'board', id)
  let docSnap = await getDoc(docRef)
  let docData = docSnap.data()

  $('#boardTitle').val(docData.boardTitle)
  $('#boardContent').val(docData.boardContent)

  $('#boardModalWriteBtn').hide()
  $('#boardModalUpdateBtn').show()
  $('#boardModalDeleteBtn').show()

  let bsBoardModal = new bootstrap.Modal($('#boardModal'))
  bsBoardModal.show()

  // 수정버튼
  $('#boardModalUpdateBtn').click(async function () {
    await updateDoc(docRef, {
      boardTitle: $('#boardTitle').val(),
      boardContent: $('#boardContent').val(),
    })
    window.location.reload()
  })

  // 삭제버튼
  $('#boardModalDeleteBtn').click(async function () {
    await deleteDoc(docRef)
    window.location.reload()
  })
})

// 글쓰기 버튼 클릭시
$(document).on('click', '#boardModalBtn', function () {
  $('#boardModalForm')[0].reset()

  $('#boardModalWriteBtn').show()
  $('#boardModalUpdateBtn').hide()
  $('#boardModalDeleteBtn').hide()

  let bsBoardModal = new bootstrap.Modal($('#boardModal'))
  bsBoardModal.show()
})

function getDateTime() {
  let now = new Date()
  //연도 구하기
  let nowYear = now.getFullYear()
  //달 구하기
  let nowMonth = now.getMonth() + 1
  //일 구하기
  let nowDate = now.getDate()
  //현재 시 구하기
  let nowHours = now.getHours()
  //현재 분 구하기
  let nowMins = now.getMinutes()
  //현재 초 구하기
  let nowSec = now.getSeconds()

  let today = `${nowYear}-${nowMonth}-${nowDate} ${nowHours}:${nowMins}:${nowSec}`

  return today
}
