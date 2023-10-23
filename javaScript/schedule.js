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

let dataArray = []

let docRef = await getDocs(collection(db, 'schedule'))
docRef.forEach((doc) => {
  let id = doc.id
  let item = doc.data()
  item.id = id
  dataArray.push(item)

  let schedule = item.schedule
})
console.log(dataArray)

// pad method
Number.prototype.pad = function () {
  return this > 9 ? this : '0' + this
}
// 체크하기

// 달력 생성
const makeCalendar = (date) => {
  // 현재의 년도와 월 받아오기
  const currentYear = new Date(date).getFullYear()
  const currentMonth = new Date(date).getMonth() + 1

  // 한달전의 마지막 요일
  const firstDay = new Date(date.setDate(1)).getDay()
  // 현재 월의 마지막 날 구하기
  const lastDay = new Date(currentYear, currentMonth, 0).getDate()

  // 남은 박스만큼 다음달 날짜 표시
  const limitDay = firstDay + lastDay
  const nextDay = Math.ceil(limitDay / 7) * 7

  let htmlDummy = ''

  // 한달전 날짜 표시하기
  for (let i = 0; i < firstDay; i++) {
    htmlDummy += `<div class="noColor"></div>`
  }

  // 이번달 날짜 표시하기

  for (let i = 1; i <= lastDay; i++) {
    const date = `${currentYear}-${currentMonth}-${i}`

    const item = dataArray.find((ele) => {
      if (ele.date == date) {
        return ele
      }
    })
    console.log(item)
    let id = item?.id ? item.id : null
    let schedule = item?.schedule ? item.schedule : ''

    htmlDummy += `
      <div class='dayBox' data-documentId=${id}>
        ${i} </br>
        <span class='scheduleLine'>${schedule}</span>
      </div>
    `
  }

  // 다음달 날짜 표시하기
  for (let i = limitDay; i < nextDay; i++) {
    htmlDummy += `<div class="noColor"></div>`
  }

  document.querySelector(`.dateBoard`).innerHTML = htmlDummy
  document.querySelector(
    `.dateTitle`
  ).innerText = `${currentYear}년 ${currentMonth}월`
}

const date = new Date()

makeCalendar(date)

// 이전달 이동
document.querySelector(`.prevDay`).onclick = () => {
  makeCalendar(new Date(date.setMonth(date.getMonth() - 1)))
}

// 다음달 이동
document.querySelector(`.nextDay`).onclick = () => {
  makeCalendar(new Date(date.setMonth(date.getMonth() + 1)))
}

// 달력 칸 누르면 해당 날짜 스케쥴 입력창 팝업됨
$('.dayBox').click(async function () {
  let id = this.dataset.documentid
  console.log(id)
  let day = this.innerText
  let month = $('.dateTitle').html()
  let date = (month + day)
    .replace(/년/g, '-')
    .replace(/월/g, '-')
    .replace(/\s/gi, '')

  // 빈 값 또는 기존 스케쥴이 들어가있음.
  const docRef = doc(db, 'schedule', id)
  const docSnap = await getDoc(docRef)
  const docData = docSnap.data()
  let dayDate = docData?.date
    ? $('.todayDate').text(docData.date)
    : $('.todayDate').text(date)
  let daySchedule = docData?.schedule
    ? $('#scheduleContent').html(docData.schedule)
    : $('#scheduleContent').html('')
  console.log(docData)
  $('.schedulePopup').css('display', 'block')

  // 스케쥴 입력

  $('#schedulePopupSubmit').click(async function () {
    if ($('#scheduleContent').val() && !docData?.schedule) {
      const docRef = await addDoc(collection(db, 'schedule'), {
        date: date,
        schedule: $('#scheduleContent').val(),
      })
      window.location.reload()
    } else if (docData?.schedule) {
      const docRef = doc(db, 'schedule', id)
      await updateDoc(docRef, {
        schedule: $('#scheduleContent').val(),
      })
      window.location.reload()
    }
  })

  // 팝업창 닫기 누르면 창 닫힘
  $('.schedulePopupClose').click(function () {
    $('.schedulePopup').css('display', 'none')
  })
})
