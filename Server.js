const express = require('express');
const fs = require('fs'); // عشان نقرا ونكتب في الملف
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const POSTS_FILE = 'posts.json';

// 1. نقرا البوستات من الملف لو موجود
let posts = [];
if (fs.existsSync(POSTS_FILE)) {
  posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
} else {
  // لو اول مرة يشتغل نحط الـ 40 بوست دول
  posts = [
    { user: "ادمن", text: "اهلا بيكم في MY FACE BOOK 😍", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600" },
    { user: "حكيم", text: "الصبر مفتاح الفرج", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
    { user: "نكتجي", text: "واحد محش دخل الامتحان 😂", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600" },
    { user: "سفر", text: "نفسي اسافر المالديف", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600" },
    { user: "طباخ", text: "انا طبخت اندومي ده انجاز", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600" }
  ];
  // كمل انت الـ 40 هنا لو عايز
}

// 2. دالة للحفظ في الملف
function savePosts() {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

let currentUser = "زائر";

// صفحة تسجيل الدخول
app.get('/', (req, res) => {
  res.send(`
  <html dir="rtl" lang="ar">
  <head><meta charset="UTF-8"><title>MY FACE BOOK</title></head>
  <body style="font-family: Arial; background: #1877f2; text-align:center; padding-top:100px; margin:0;">
    <div style="background:white; width:300px; margin:auto; padding:20px; border-radius:10px;">
      <h1 style="color:#1877f2;">MY FACE BOOK</h1>
      <form action="/login" method="post">
        <input name="username" placeholder="اكتب اسمك" required style="width:90%; padding:10px; margin:10px 0; border-radius:5px; border:1px solid #ccc;">
        <button style="background:#1877f2; color:white; border:none; padding:10px 20px; border-radius:5px; width:100%;">دخول</button>
      </form>
    </div>
  </body></html>`);
});

app.post('/login', (req, res) => {
  currentUser = req.body.username;
  res.redirect('/home');
});

// الصفحة الرئيسية
app.get('/home', (req, res) => {
  let html = `
  <html dir="rtl" lang="ar">
  <head><meta charset="UTF-8"><title>MY FACE BOOK</title></head>
  <body style="font-family: Arial; background: #f0f2f5; margin:0;">
    <div style="background:#1877f2; color:white; padding:15px; position:sticky; top:0;">
      <h2 style="margin:0;">MY FACE BOOK - اهلا ${currentUser}</h2>
    </div>
    
    <div style="max-width:600px; margin:20px auto; padding:0 10px;">
      
      <!-- فورم اضافة بوست -->
      <div style="background:white; padding:15px; border-radius:8px; margin-bottom:20px;">
        <h3>اكتب بوست جديد</h3>
        <form action="/addpost" method="post">
          <textarea name="text" placeholder="في ايه جديد؟" required style="width:95%; padding:10px; height:60px; border:1px solid #ccc; border-radius:5px;"></textarea><br>
          <input name="image" placeholder="رابط الصورة اختياري" style="width:95%; padding:10px; margin:10px 0; border:1px solid #ccc; border-radius:5px;">
          <br>
          <button style="background:#42b72a; color:white; border:none; padding:10px 20px; border-radius:5px; font-weight:bold;">نشر</button>
        </form>
      </div>

      <!-- البوستات -->
      ${posts.map(p => `
        <div style="background:white; margin:10px 0; padding:15px; border-radius:8px;">
          <b style="color:#1877f2;">${p.user}</b>
          <p>${p.text}</p>
          ${p.image ? `<img src="${p.image}" style="width:100%; border-radius:8px; margin-top:10px;">` : ''}
        </div>
      `).join('')}
    </div>
  </body></html>`;
  res.send(html);
});

// اضافة بوست جديد + حفظ
app.post('/addpost', (req, res) => {
  let newPost = {
    user: currentUser,
    text: req.body.text,
    image: req.body.image
  };
  posts.unshift(newPost);
  savePosts(); // هنا بنحفظ في الملف
  res.redirect('/home');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
