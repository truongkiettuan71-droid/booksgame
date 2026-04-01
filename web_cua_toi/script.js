// ===== Biến toàn cục =====
let currentUser = localStorage.getItem("currentUser") || null;
const loginDiv = document.getElementById("loginDiv");
const homeDiv = document.getElementById("home");
const welcomeDiv = document.getElementById("welcome");
const listDiv = document.getElementById("list");
const readerDiv = document.getElementById("reader");
const titleH3 = document.getElementById("title");
const contentDiv = document.getElementById("content");
const quizDiv = document.getElementById("quizDiv");
const leaderboardDiv = document.getElementById("leaderboard");
const totalDiv = document.getElementById("total");
const leaderboardHomeDiv = document.getElementById("leaderboardHome");

const loginMusic = document.getElementById("loginMusic");
const homeMusic = document.getElementById("homeMusic");

let currentBook = null;
let userAnswersQuiz = {};
let quizTimerInterval;

// ===== Danh sách truyện =====
const books = [
  {name:"Tấm Cám", file:"tam_cam.txt"},
  {name:"Thạnh Sanh", file:"thanh_sanh.txt"},
  {name:"Tam Quốc – Hồi Trống Cổ Thành", file:"tam_quoc.txt"}
];

// ===== Quiz =====
const quizzes = {
  "Tấm Cám":[
    {q:"Tấm sống với ai?", options:["Bố mẹ","Cô dì","Bà mẹ ghẻ","Chú"], answer:"Bà mẹ ghẻ"},
    {q:"Ai giúp Tấm biến thành chim vàng?", options:["Ông bụt","Cô tiên","Bà mẹ ghẻ","Cám"], answer:"Ông bụt"},
    {q:"Tấm tìm được gì sau mỗi lần thử thách?", options:["Vàng","Trống","Bùa","Của cải"], answer:"Vàng"},
    {q:"Cám có tính cách thế nào?", options:["Hiền","Xấu","Ganh tỵ","Dễ thương"], answer:"Ganh tỵ"},
    {q:"Tấm trở thành gì cuối cùng?", options:["Công chúa","Người thường","Bà tiên","Nông dân"], answer:"Công chúa"},
    {q:"Ai giúp Tấm trong những lúc khó khăn?", options:["Ông Bụt","Cám","Bố mẹ","Người lạ"], answer:"Ông Bụt"}
  ],
  "Thạnh Sanh":[
    {q:"Thạnh Sanh sinh ra thế nào?", options:["Bình thường","Kỳ lạ","Từ cây","Không rõ"], answer:"Kỳ lạ"},
    {q:"Ai giúp Thạnh Sanh đánh thắng gian thần?", options:["Ông Bụt","Quân sĩ","Cậu bạn","Người lạ"], answer:"Ông Bụt"},
    {q:"Thạnh Sanh được công nhận là gì?", options:["Vua","Quan","Người hùng","Người thường"], answer:"Người hùng"},
    {q:"Ai đối đầu với Thạnh Sanh?", options:["Gian thần","Cám","Bà mẹ ghẻ","Người dân"], answer:"Gian thần"},
    {q:"Thạnh Sanh sống ở đâu?", options:["Làng","Thành phố","Rừng","Biển"], answer:"Làng"},
    {q:"Ai giúp Thạnh Sanh gặp may mắn?", options:["Ông Bụt","Người lạ","Gia đình","Bạn"], answer:"Ông Bụt"}
  ],
  "Tam Quốc – Hồi Trống Cổ Thành":[
    {q:"Tam Quốc diễn ra ở đâu?", options:["Trung Quốc","Nhật Bản","Hàn Quốc","Việt Nam"], answer:"Trung Quốc"},
{q:"Ai là anh hùng nổi tiếng?", options:["Lưu Bị","Tôn Quyền","Tào Tháo","Quan Vũ"], answer:"Lưu Bị"},
    {q:"Ai cầm quân giỏi nhất?", options:["Quan Vũ","Trương Phi","Tào Tháo","Lưu Bị"], answer:"Quan Vũ"},
    {q:"Tam Quốc chia làm bao nhiêu nước?", options:["2","3","4","5"], answer:"3"},
    {q:"Hồi trống cổ thành nói về gì?", options:["Chiến tranh","Tình yêu","Thương mại","Nông nghiệp"], answer:"Chiến tranh"},
    {q:"Ai là chiến lược gia nổi tiếng?", options:["Khổng Minh","Lưu Bị","Tào Tháo","Quan Vũ"], answer:"Khổng Minh"}
  ]
};

// ===== Kiểm tra login khi load =====
if(currentUser){
  loginDiv.style.display="none";
  homeDiv.style.display="flex";
  welcomeDiv.innerText="Xin chào, "+currentUser+"!";
  loginMusic.pause();
  homeMusic.play();
  showList();
}else{
  loginDiv.style.display="flex";
  homeDiv.style.display="none";
  loginMusic.play();
}

// ===== Hàm login =====
function login(){
  let name = document.getElementById("username").value.trim();
  if(!name){ alert("Nhập tên bạn!"); return; }
  currentUser = name;
  localStorage.setItem("currentUser", name);

  loginDiv.style.display="none";
  homeDiv.style.display="flex";
  welcomeDiv.innerText="Xin chào, "+currentUser+"!";

  loginMusic.pause();
  homeMusic.play();

  showList();
}

// ===== Logout =====
function logout(){
  currentUser=null;
  localStorage.removeItem("currentUser");
  loginDiv.style.display="flex";
  homeDiv.style.display="none";
  leaderboardDiv.style.display="none";
  homeMusic.pause();
  loginMusic.play();
}

// ===== Danh sách truyện =====
function showList(){
  if(!currentUser) return;
  listDiv.innerHTML="";
  books.forEach(book=>{
    let div = document.createElement("div");
    div.className="book";
    div.innerText = book.name;
    div.onclick = ()=>loadBook(book);
    listDiv.appendChild(div);
  });
  homeDiv.style.display="flex";
  readerDiv.style.display="none";
  leaderboardDiv.style.display="none";

  showLeaderboardHome();
}

// ===== Load truyện =====
function loadBook(book){
  if(!currentUser){ alert("Nhập tên để tiếp tục!"); return; }
  currentBook = book;
  fetch(book.file)
    .then(res=>res.text())
    .then(txt=>{
      titleH3.innerText = book.name;
      contentDiv.innerText = txt;
      homeDiv.style.display="none";
      readerDiv.style.display="flex";
      leaderboardDiv.style.display="none";
      homeMusic.pause();
    });
}

// ===== Quay lại Home =====
function back(){
  readerDiv.style.display="none";
  homeDiv.style.display="flex";
  homeMusic.play();
}

// ===== Quiz =====
function startQuiz(){
  readerDiv.style.display="none";
  quizDiv.style.display="flex";
  userAnswersQuiz = {};
  showQuizQuestion(0);
}

// Hiển thị câu hỏi từng trang
function showQuizQuestion(index){
  quizDiv.innerHTML="";
  const quiz = quizzes[currentBook.name];
  if(index >= quiz.length){
    showTotal();
    return;
  }
const qObj = quiz[index];
  const h3 = document.createElement("h3");
  h3.innerText = qObj.q;
  quizDiv.appendChild(h3);

  qObj.options.forEach(opt=>{
    const btn = document.createElement("button");
    btn.className="quiz-btn";
    btn.innerText = opt;
    btn.onclick = ()=>{
      userAnswersQuiz[index] = opt;
      btn.style.fontWeight="bold";
      setTimeout(()=>showQuizQuestion(index+1), 500);
    }
    quizDiv.appendChild(btn);
  });
}

// ===== Lưu điểm tích lũy =====
function saveScore(user, score){
  let allScores = JSON.parse(localStorage.getItem("allScores") || "{}");
  if(!allScores[user]) allScores[user] = 0;
  allScores[user] += score;
  localStorage.setItem("allScores", JSON.stringify(allScores));
}

// ===== Lấy tất cả điểm =====
function getAllScores(){
  return JSON.parse(localStorage.getItem("allScores") || "{}");
}

// ===== Hiển thị leaderboard trong Home =====
function showLeaderboardHome(){
  leaderboardHomeDiv.innerHTML="";
  const allScores = getAllScores();
  let arr = [];
  for(let user in allScores){
    arr.push({user:user, score:allScores[user]});
  }
  arr.sort((a,b)=>b.score - a.score);
  if(arr.length===0){
    leaderboardHomeDiv.innerText="Chưa có ai ghi điểm!";
    return;
  }
  arr.forEach((item,i)=>{
    const p = document.createElement("p");
    p.innerText = (i+1)+". "+item.user+": "+item.score.toFixed(1)+" điểm";
    leaderboardHomeDiv.appendChild(p);
  });
}

// ===== Sau khi quiz xong =====
function showTotal(){
  quizDiv.style.display="none";
  leaderboardDiv.style.display="flex";

  const quiz = quizzes[currentBook.name];
  let score=0;
  quiz.forEach((q,i)=>{
    if(userAnswersQuiz[i]===q.answer) score+=10/quiz.length;
  });

  totalDiv.innerText = "Điểm lần này: "+score.toFixed(1)+" / 10";

  saveScore(currentUser, score);
  showLeaderboardHome();
}

// ===== Quay lại Home từ leaderboard =====
function backToHome(){
  leaderboardDiv.style.display="none";
  homeDiv.style.display="flex";
  showLeaderboardHome();
  homeMusic.play();
}
