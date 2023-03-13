let teachersRow = document.getElementById("teachers");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const avatar = document.getElementById("avatar");
const phoneNumber = document.getElementById("phoneNumber");
const email = document.getElementById("email");
const groups = document.getElementById("groups");
const isMerried = document.getElementById("isMerried");

const teacherForm = document.getElementById("teacherForm");
const teacherModal = document.getElementById("teacherModal");
const teacherBtn = document.getElementById("teacherAddBtn");
const modalOpenBtn = document.getElementById("modalOpenBtn");
let pagination = document.querySelector(".pagination");

let selected = null;
let page = 1;
let limit = 10;
let pagination_items;

const getTeacherCard = ({
  avatar,
  firstName,
  lastName,
  phoneNumber,
  isMarried,
  email,
  groups,
  id,
}) => {
  return `<div class="card">
   <div class="teacher-avatar mt-3">
   <img src=${avatar} class="card-img-top" alt="avatar"/></div>
    <div class="card-body">
      <h5 class="card-title text-center">O'qituvchi ma'lumotlari:</h5>

      <div class="teacherName d-flex flex-wrap">
        <p class="card-text m-0 my-1">Ismi:</p>
        <p class="card-text m-0 my-1 name ms-1">${firstName}</p>
      </div>
      <div class="teacherLastname d-flex flex-wrap">
        <p class="card-text m-0 my-1">Familiyasi:</p>
        <p class="card-text m-0 my-1 lastName ms-1">${lastName}</p>
      </div>
      <div class="teacherPhoneNumber d-flex flex-wrap">
        <p class="card-text m-0 my-1">Telefon raqami:</p>
        <p class="card-text m-0 my-1 phoneNumber ms-1">${phoneNumber}</p>
      </div>

      <div class="teacherIsMarried d-flex flex-wrap">
        <p class="card-text m-0 my-1">Oilaviy holati:</p>
        <p class="card-text m-0 my-1 isMarried ms-1">${
          isMarried ? "Oilali" : "Turmush qurmagan"
        }</p>
      </div>
      <div class="teacherEmail d-flex flex-wrap">
        <p class="card-text m-0 my-1">Email:</p>
        <p class="card-text m-0 my-1 email ms-1">${email}</p>
      </div>
      <div class="teacherGroups d-flex flex-wrap">
        <p class="card-text m-0 my-1">Guruhlari:</p>
        <p class="card-text m-0 my-1 groups ms-1">${groups}</p>
      </div>
      <div class="btn-group d-flex justify-content-between my-2 align-items-center gap-2">
      <button class="btn btn-secondary" onclick="deleteTeacher(${id})" >O'chirish</button>
      <button class="btn btn-secondary" onclick="editTeacher(${id})" data-bs-toggle="modal" data-bs-target="#teacherModal" >Tahrirlash</button>

      </div>
      <a href="students.html" class="btn btn-secondary w-100" onclick="saveId(${id})">O'quvchilarni ko'rish</a>
    </div>
  </div>`;
};
async function getTeachers() {
  teachersRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `teacher?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  let teachers = await res.json();
  teachersRow.innerHTML = "";
  teachers.forEach((teacher) => {
    teachersRow.innerHTML += getTeacherCard(teacher);
  });
}

getTeachers();

let regexphoneNumber =
  /^\+998\((33|7(1|5|7|8)88|9[0-9])\)-(\d{3})-(\d{2})-(\d{2})$/;

let inputCorrectly = document.querySelector(".inputCorrectly");

function phoneCheck() {
  if (regexphoneNumber.test(phoneNumber.value)) {
    inputCorrectly.innerHTML = "To'g'ri kiritildi";
  } else {
    inputCorrectly.innerHTML = "Quyidagicha kiriting: +998(33)-123-45-67";
  }
}
teacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(teacherModal).hide();
    let data = {
      firstName: firstName.value,
      avatar: avatar.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      groups: groups.value,
    };
    if (selected) {
      fetch(ENDPOINT + `teacher/${selected}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Teacher is edited");
        getTeachers();
        emptyForm();
      });
    } else {
      fetch(ENDPOINT + "teacher", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Teacher is added");
        getTeachers();
        emptyForm();
      });
    }
  }
});

function editTeacher(id) {
  selected = id;
  teacherBtn.innerHTML = "Save teacher";
  fetch(ENDPOINT + `teacher/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      firstName.value = res.firstName;
      avatar.value = res.avatar;
      email.value = res.email;
      lastName.value = res.lastName;
      phoneNumber.value = res.phoneNumber;
      groups.value = res.groups;
      isMerried.checked = res.isMarried;
    });
}

function deleteTeacher(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${id}`, { method: "DELETE" }).then(() => {
      getTeachers();
    });
  }
}

function saveId(id) {
  localStorage.setItem("teacherId", id);
}

function emptyForm() {
  firstName.value = "";
  avatar.value = "";
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
});

async function getPagination() {
  let pagination_numbers = "";
  let res = await fetch(ENDPOINT + `teacher`);
  let teachers = await res.json();
  teacher_number = teachers.length;
  pagination_items = Math.ceil(teacher_number / limit);
  Array(pagination_items)
    .fill(1)
    .forEach((item, index) => {
      pagination_numbers += `<li class="page-item ${
        page == index + 1 ? "active" : ""
      }" onclick="getPage(${index + 1})">
        <span class="page-link">
          ${index + 1}
        </span>
      </li>`;
    });

  pagination.innerHTML = `
    <li onclick="getPage('-')" class="page-item ${
      page == 1 ? "disabled" : ""
    }"><button class="page-link" href="#">Previous</button></li>
    ${pagination_numbers}
    <li onclick="getPage('+')" class="page-item ${
      page == pagination_items ? "disabled" : ""
    }"><button class="page-link" href="#">Next</button></li>
  `;
}

getPagination();

function getPage(p) {
  if (p == "+") {
    page++;
  } else if (p == "-") {
    page--;
  } else {
    page = p;
  }
  if (page <= pagination_items) {
    getTeachers();
    getPagination();
  }
}
