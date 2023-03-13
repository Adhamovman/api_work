const teachersRow = document.querySelector(".teachersRow");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phoneNumber = document.getElementById("phoneNumber");
const email = document.getElementById("email");
const groups = document.getElementById("groups");
const isMerried = document.getElementById("isMerried");

const teacherForm = document.getElementById("teacherForm");

const getTeachersCard = ({
  avatar,
  firstName,
  lastName,
  phoneNumber,
  isMarried,
  email,
  groups,
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
      <button class="btn btn-secondary">O'chirish</button>
      <button class="btn btn-secondary">Tahrirlash</button>

      </div>
      <a href="#" class="btn btn-secondary w-100">O'quvchilarni ko'rish</a>
    </div>
  </div>`;
};

async function getTeachers() {
  let res = await fetch(ENDPOINT + "teacher", { method: "GET" });
  let teachers = await res.json();
  teachers.forEach((teacher) => {
    teachersRow.innerHTML += getTeachersCard(teacher);
  });
}
getTeachers();

teacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    console.log("hi");
    bootstrap.Modal.getInstance(teacherForm).hide();

  }
});
