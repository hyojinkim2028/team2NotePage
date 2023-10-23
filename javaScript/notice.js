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

// 공지 데이터 가져오기
let docs = await getDocs(collection(db, 'notice'))
docs.forEach((doc) => {
  let row = doc.data()
  let id = doc.id
  let noticeTitle = row.noticeTitle
  let noticeContent = row.noticeContent

  let temp_html = `
        <div class="noticeBox" data-documentId=${id}>
        <div id="noticeTitle" class="noticeTitle"><h1 >${noticeTitle}</h1></div>
        <div id="noticeContent" class="noticeContent"><h5>${noticeContent}</h5></div>
      </div>
    `
  $('.subBox').append(temp_html)
})

// 공지 수정

$('.noticeTitle').on('click', async function () {
  let password = prompt('조장 비밀번호 입력!')
  if (password == 4646) {
    $('.mypostingbox').css('display', 'block')

    let id = this.parentNode.dataset.documentid

    // id 에 해당하는 데이터 값 불러옴
    let docRef = doc(db, 'notice', id)
    let docSnap = await getDoc(docRef)
    let docData = docSnap.data()

    // input에 기존 데이터 보여지게 함
    $('#titleInput').val(docData.noticeTitle)
    $('#contentInput').val(docData.noticeContent)

    // 입력하고 확인 누르면 수정되고 새로고침
    let editRef = doc(db, 'notice', id)
    $('#postingbtn').click(async function () {
      await updateDoc(editRef, {
        noticeTitle: $('#titleInput').val(),
        noticeContent: $('#contentInput').val(),
      })
      window.location.reload()
    })
  } else {
    alert('비밀번호 오류! 다시 시도하세요!')
  }

  // 수정 닫기 버튼 클릭시
  $('#closeBtn').click(function (event) {
    $('.mypostingbox').css('display', 'none')
  })
})
