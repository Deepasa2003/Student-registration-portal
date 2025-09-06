//  References 
const form = document.getElementById('studentForm');
const formSection = document.getElementById('formSection');
const studentList = document.getElementById('studentList');
const addBtn = document.getElementById('addBtn');
const themeToggle = document.getElementById('themeToggle');
const emptyMsg = document.getElementById('emptyMsg');
const photoInput = document.getElementById('photo');

// Load students from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];

//  Render Cards
function renderList() {
  studentList.innerHTML = '';

  if (students.length === 0) {
    emptyMsg.style.display = "block";
    return;
  } else {
    emptyMsg.style.display = "none";
  }

  students.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <div class="actions">
        <button class="edit-btn" onclick="editStudent(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete-btn" onclick="deleteStudent(${i})"><i class="fa-solid fa-trash"></i></button>
      </div>
      <h3>${s.name}</h3>
      <div class="avatar">
        ${s.photo 
          ? `<img src="${s.photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
          : s.name.charAt(0).toUpperCase()}
      </div>
      <div class="student-details">
        <p><i class="fa-solid fa-id-badge"></i> ${s.id}</p>
        <p><i class="fa-solid fa-envelope"></i> ${s.email}</p>
        <p><i class="fa-solid fa-phone"></i> ${s.phone}</p>
      </div>
    `;
    studentList.appendChild(card);
  });
}

// Add Student 
form.addEventListener('submit', e => {
  e.preventDefault();

  const id = document.getElementById('studentId').value.trim();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!/^\d+$/.test(id)) return alert("ID must be numbers only");
  if (!/^[A-Za-z ]+$/.test(name)) return alert("Name must be letters only");
  if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Invalid email");
  if (!/^\d{10,}$/.test(phone)) return alert("Phone must be at least 10 digits");

  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      students.push({ id, name, email, phone, photo: reader.result });
      localStorage.setItem('students', JSON.stringify(students)); // ✅ Save after add
      renderList();
      form.reset();
      formSection.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    students.push({ id, name, email, phone, photo: "" });
    localStorage.setItem('students', JSON.stringify(students)); // ✅ Save after add
    renderList();
    form.reset();
    formSection.classList.add('hidden');
  }
});

// Edit Student
function editStudent(index) {
  const s = students[index];
  document.getElementById('studentId').value = s.id;
  document.getElementById('name').value = s.name;
  document.getElementById('email').value = s.email;
  document.getElementById('phone').value = s.phone;

  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students)); // ✅ Save after remove old
  renderList();
  formSection.classList.remove('hidden');
}

//  Delete Student 
function deleteStudent(index) {
  if (confirm("Delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students)); // ✅ Save after delete
    renderList();
  }
}

//  Toggle Form 
addBtn.addEventListener('click', () => {
  formSection.classList.toggle('hidden');
  emptyMsg.style.display = "none"; // Hide message while adding
});

// Theme Toggle 
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.innerHTML = document.body.classList.contains('dark-mode')
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

// First Load 
renderList();
