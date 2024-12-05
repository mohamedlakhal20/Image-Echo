/**document.addEventListener('DOMContentLoaded', () => {
  const imageGallery = document.getElementById('imageGallery');

  // جلب الصور من الخادم عند تحميل الصفحة
  fetch('http://localhost:3333/images')
    .then(response => response.json())
    .then(images => {
      images.forEach(image => {
        // إنشاء عنصر لكل صورة
        const newDiv = document.createElement('div');
        newDiv.classList.add('profile-container');
        newDiv.innerHTML = `
          <h3 class="type">${image.name}</h3>
          <img class="ci" src="${image.url}" alt="${image.name}">
          <div class="buttons-container">
            <i class="fa fa-thumbs-up like-icon" data-name="${image.name}"></i>
            <span class="like-count">${image.likes}</span>
            <i class="fa fa-download download-icon"></i>
          </div>
        `;

        // إعداد زر الإعجاب
        const likeIcon = newDiv.querySelector('.like-icon');
        const likeCount = newDiv.querySelector('.like-count');
        const imageName = likeIcon.getAttribute('data-name');

        // تحقق من إذا كان المستخدم قد أعجب بالصورة من قبل
        const liked = localStorage.getItem(`liked_${imageName}`);

        // إذا كان قد أعجب بالصورة، لا يمكنه الإعجاب مرة أخرى
        if (liked) {
          likeIcon.style.pointerEvents = 'none'; // تعطيل الزر
          likeIcon.style.color = 'gray'; // تغيير اللون لتوضيح أنه لا يمكن الإعجاب مرة أخرى
        }

        likeIcon.addEventListener('click', () => {
          if (!liked) {
            // إرسال طلب إلى الخادم لزيادة الإعجابات
            fetch('http://localhost:3333/like', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ imageName })
            })
            .then(response => response.json())
            .then(data => {
              likeCount.textContent = data.likes; // تحديث العداد
              localStorage.setItem(`liked_${imageName}`, 'true'); // حفظ حالة الإعجاب للمستخدم
              likeIcon.style.pointerEvents = 'none'; // تعطيل الزر بعد الإعجاب
              likeIcon.style.color = 'gray'; // تغيير اللون لتوضيح أنه لا يمكن الإعجاب مرة أخرى
            })
            .catch(error => console.error('Error liking image:', error));
          }
        });

        // إعداد زر التحميل
        const downloadIcon = newDiv.querySelector('.download-icon');
        downloadIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          const link = document.createElement('a');
          link.href = image.url;
          link.download = image.name; // تحميل الصورة
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });

        imageGallery.appendChild(newDiv);
      });
    })
    .catch(error => console.error('Error fetching images:', error));
});
 */
document.addEventListener('DOMContentLoaded', () => {
  const imageGallery = document.getElementById('imageGallery');
  
  // تحقق إذا كان المستخدم جديدًا
  const isNewUser = !localStorage.getItem('visited');
  if (isNewUser) {
    // إذا كان مستخدم جديد، قم بتعيين عنصر في localStorage
    localStorage.setItem('visited', 'true');
    console.log('Welcome, new user!');
  } else {
    console.log('Welcome back, returning user!');
  }

  // جلب الصور من الخادم عند تحميل الصفحة
  fetch('http://localhost:3333/images')
    .then(response => response.json())
    .then(images => {
      images.forEach(image => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('profile-container');
        newDiv.innerHTML = `
          <h3 class="type">${image.name}</h3>
          <img class="ci" src="${image.url}" alt="${image.name}">
          <div class="buttons-container">
            <i class="fa fa-thumbs-up like-icon" data-name="${image.name}"></i>
            <span class="like-count">${image.likes}</span>
            <i class="fa fa-download download-icon"></i>
          </div>
        `;

        // إعداد زر الإعجاب
        const likeIcon = newDiv.querySelector('.like-icon');
        const likeCount = newDiv.querySelector('.like-count');

        // إذا كان المستخدم قد أعجب بالصورة سابقًا
        const liked = localStorage.getItem(`liked_${image.name}`);

        // إذا كان قد أعجب بالصورة من قبل، تعطيل زر الإعجاب
        if (liked) {
          likeIcon.style.pointerEvents = 'none'; // تعطيل الزر
          likeIcon.style.color = 'gray'; // تغيير اللون
        }

        likeIcon.addEventListener('click', () => {
          if (!liked) {
            fetch('http://localhost:3333/like', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageName: image.name,
                userId: localStorage.getItem('userId'), // إرسال معرف المستخدم
              }),
            })
              .then(response => response.json())
              .then(data => {
                likeCount.textContent = data.likes;
                localStorage.setItem(`liked_${image.name}`, 'true'); // حفظ حالة الإعجاب
                likeIcon.style.pointerEvents = 'none';
                likeIcon.style.color = 'gray';
              })
              .catch(error => console.error('Error liking image:', error));
          }
        });

        imageGallery.appendChild(newDiv);
      });
    })
    .catch(error => console.error('Error fetching images:', error));
});

