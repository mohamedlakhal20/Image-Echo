'use strict';

var express = require('express');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var app = express();

// تمكين CORS لجميع الطلبات
app.use(cors());
app.use(express.json());

// تقديم الصور من مجلد "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// مسار ملف البيانات
const dataFilePath = path.join(__dirname, 'data.json');

// قراءة بيانات الصور من `data.json`
function getImages() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data.json:', err);
    return [];
  }
}

// حفظ بيانات الصور والإعجابات إلى `data.json`
function saveImages(images) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(images, null, 2));
  } catch (err) {
    console.error('Error saving data.json:', err);
  }
}

// نقطة النهاية للحصول على الصور
app.get('/images', function (req, res) {
  // جلب البيانات من `data.json`
  const images = getImages();
  res.json(images);
});

// نقطة النهاية لزيادة الإعجابات
app.post('/like', function (req, res) {
  const imageName = req.body.imageName;

  // جلب البيانات من `data.json`
  let images = getImages();
  const image = images.find(function (img) {
    return img.name === imageName;
  });

  if (image) {
    // زيادة عدد الإعجابات
    image.likes += 1;
    // حفظ التحديثات في `data.json`
    saveImages(images);
    res.json({ likes: image.likes });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// تشغيل الخادم
const PORT = 3333;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});
/** */
app.post('/like', function (req, res) {
    const { imageName, userId } = req.body;
    let images = getImages();  // جلب البيانات من `data.json`
    
    const image = images.find(function (img) {
      return img.name === imageName;
    });
  
    if (image) {
      if (!image.likedBy.includes(userId)) {
        image.likes += 1;
        image.likedBy.push(userId);  // إضافة `userId` إلى قائمة المعجبين
        saveImages(images);  // حفظ التحديثات في `data.json`
      }
      res.json({ likes: image.likes });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });
  