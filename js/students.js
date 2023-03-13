let studentsRow = document.getElementById("students");
const firstName = document.getElementById("firstName");
const avatar = document.getElementById("avatar");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const field = document.getElementById("field");
const birthday = document.getElementById("birthday");
const isWork = document.getElementById("isWork")

const phoneNumber = document.getElementById("phoneNumber");

const studentForm = document.getElementById("studentForm");
const studentModal = document.getElementById("studentModal");
const studentBtn = document.getElementById("studentAddBtn");
const modalOpenBtn = document.getElementById("modalOpenBtn");

let selected = null;
const teacherId = localStorage.getItem("teacherId");
console.log(teacherId);
const getStudentCard = ({
  avatar,
  firstName,
  lastName,
  phoneNumber,
  email,
  id,
  birthday,
  isWork,
  field,
}) => {
  return `<div class="card">
   <div class="teacher-avatar mt-3">
   <img src=${avatar} class="card-img-top" alt="avatar"/></div>
    <div class="card-body">
      <h5 class="card-title text-center">O'quvchi ma'lumotlari:</h5>

      <div class="teacherName d-flex flex-wrap">
        <p class="card-text m-0 my-1">Ismi:</p>
        <p class="card-text m-0 my-1 name ms-1">${firstName}</p>
      </div>
      <div class="teacherLastname d-flex flex-wrap">
        <p class="card-text m-0 my-1">Familiyasi:</p>
        <p class="card-text m-0 my-1 lastName ms-1">${lastName}</p>
      </div>
      <div class="teacherLastname d-flex flex-wrap">
      <p class="card-text m-0 my-1">Tug'ilgan sanasi:</p>
      <p class="card-text m-0 my-1 lastName ms-1">${birthday}</p>
    </div>
    <div class="teacherLastname d-flex flex-wrap">
    <p class="card-text m-0 my-1">Ishlaydimi:</p>
    <p class="card-text m-0 my-1 lastName ms-1">${isWork ? "Ha" : "Yo'q"}</p>
  </div>
      <div class="teacherPhoneNumber d-flex flex-wrap">
        <p class="card-text m-0 my-1">Telefon raqami:</p>
        <p class="card-text m-0 my-1 phoneNumber ms-1">${phoneNumber}</p>
      </div>

      <div class="teacherEmail d-flex flex-wrap">
        <p class="card-text m-0 my-1">Email:</p>
        <p class="card-text m-0 my-1 email ms-1">${email}</p>
      </div>
      <div class="teacherEmail d-flex flex-wrap">
      <p class="card-text m-0 my-1">Ma'lumot:</p>
      <p class="card-text m-0 my-1 email ms-1">${field}</p>
    </div>

      <div class="btn-group d-flex justify-content-between my-2 align-items-center gap-2">
      <button class="btn btn-secondary" onclick="deleteStudent(${id})" >O'chirish</button>
      <button class="btn btn-secondary" onclick="editStudent(${id})" data-bs-toggle="modal" data-bs-target="#studentModal" >Tahrirlash</button>
      </div>
    </div>
  </div>`;
};

async function getStudents() {
  studentsRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `teacher/${teacherId}/student`);
  let students = await res.json();
  studentsRow.innerHTML = "";
  students.forEach((student) => {
    studentsRow.innerHTML += getStudentCard(student);
  });
}

getStudents();

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(studentModal).hide();
    let data = {
      firstName: firstName.value,
      lastName: lastName.value,
      avatar: avatar.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      field: field.value,
      birthday: birthday.value,
      isWork: isWork.checked,
    };
    if (selected) {
      fetch(ENDPOINT + `teacher/${teacherId}/student/${selected}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        console.log("Student is edited");
        alert("Student is edited");
        getStudents();
        emptyForm();
      });
    } else {
      fetch(ENDPOINT + `teacher/${teacherId}/student`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Student is added");
        getStudents();
        emptyForm();
      });
    }
    window.location.reload();
  }
});

function editStudent(id) {
  selected = id;
  studentBtn.innerHTML = "Save student";
  fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      firstName.value = res.firstName;
      lastName.value = res.lastName;
      avatar.value = res.avatar;
      email.value = res.email;
      phoneNumber.value = res.phoneNumber;
      field.value = res.field;
      birthday.value = res.birthday;
      isWork.checked = res.isWork;
    });
}

function deleteStudent(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`, {
      method: "DELETE",
    }).then(() => {
      getStudents();
    });
  }
}

function emptyForm() {
  firstName.value = "";
  lastName.value = "";
  phoneNumber.value = "";
  field.value = "";
  birthday.value = ""
  avatar.value = "";
  isWork.checked = "";
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
});
