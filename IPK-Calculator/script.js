const semesterContainer = document.getElementById("semesterContainer");
const addSemesterBtn = document.getElementById("addSemesterBtn");
const semesterTemplate = document.getElementById("semesterTemplate");
const courseTemplate = document.getElementById("courseTemplate");

const semesterSummary = document.getElementById("semesterSummary");
const ipkResult = document.getElementById("ipkResult");

let semesterCount = 0;

window.onload = () => {

    const saved = localStorage.getItem("ipkData");

    if(saved){

        const data = JSON.parse(saved);

        data.forEach(semester=>{

            createSemester(semester);

        });

    }else{

        createSemester();

    }

}

addSemesterBtn.addEventListener("click",()=>{

    createSemester();

});


function createSemester(data=null){

    semesterCount++;

    const clone = semesterTemplate.content.cloneNode(true);

    const card = clone.querySelector(".semester-card");

    const title = clone.querySelector(".semester-title");

    const tbody = clone.querySelector(".course-list");

    const addCourseBtn = clone.querySelector(".add-course");

    const deleteSemesterBtn = clone.querySelector(".delete-semester");

    title.innerText = "Semester " + semesterCount;

    addCourseBtn.addEventListener("click",()=>{

        addCourse(tbody);

    });

    deleteSemesterBtn.addEventListener("click",()=>{

        card.remove();

        refreshSemesterTitle();

        calculateAll();

    });


    if(data){

        data.courses.forEach(course=>{

            addCourse(tbody,course);

        });

    }else{

        addCourse(tbody);

    }

    semesterContainer.appendChild(clone);

    calculateAll();

}

function addCourse(tbody,data=null){

    const clone = courseTemplate.content.cloneNode(true);

    const row = clone.querySelector("tr");

    const name = clone.querySelector(".course-name");
    const grade = clone.querySelector(".course-grade");
    const sks = clone.querySelector(".course-sks");
    const deleteBtn = clone.querySelector(".delete-course");


    if(data){

        name.value = data.name;
        grade.value = data.grade;
        sks.value = data.sks;

    }

    name.addEventListener("input",calculateAll);
    grade.addEventListener("change",calculateAll);
    sks.addEventListener("change",calculateAll);

    deleteBtn.addEventListener("click",()=>{

        row.remove();

        calculateAll();

    });

    tbody.appendChild(clone);

}

function calculateAll() {

    let totalPoint = 0;
    let totalSKS = 0;

    semesterSummary.innerHTML = "";

    const semesters = document.querySelectorAll(".semester-card");

    semesters.forEach((semester, index) => {

        const rows = semester.querySelectorAll("tbody tr");

        let semesterPoint = 0;
        let semesterSKS = 0;

        rows.forEach(row => {

            const grade = parseFloat(row.querySelector(".course-grade").value);
            const sks = parseFloat(row.querySelector(".course-sks").value);

            semesterPoint += grade * sks;
            semesterSKS += sks;

        });

        const ips = semesterSKS > 0 ? semesterPoint / semesterSKS : 0;

        semester.querySelector(".semester-gpa").textContent = ips.toFixed(2);
        semester.querySelector(".semester-sks").textContent = semesterSKS;

        totalPoint += semesterPoint;
        totalSKS += semesterSKS;

        const card = document.createElement("div");
        card.className = "summary-item";

        card.innerHTML = `
            <div class="summary-title">
                IP Semester ${index + 1}
            </div>

            <div class="summary-ip">
                ${ips.toFixed(2)}
            </div>

            <div class="summary-sks">
                ${semesterSKS} SKS
            </div>
        `;

        semesterSummary.appendChild(card);

    });

    const ipk = totalSKS > 0 ? totalPoint / totalSKS : 0;

    ipkResult.innerHTML = `
        <div class="summary-title">
            IPK Keseluruhan
        </div>

        <div class="summary-ip">
            ${ipk.toFixed(2)}
        </div>

        <div class="summary-sks">
            ${totalSKS} SKS
        </div>
    `;

    saveData();

}

function refreshSemesterTitle(){

    semesterCount=0;

    document.querySelectorAll(".semester-card").forEach(card=>{

        semesterCount++;

        card.querySelector(".semester-title").innerText="Semester "+semesterCount;

    });

}

function saveData(){

    const semesters=[];

    document.querySelectorAll(".semester-card").forEach(semester=>{

        const courses=[];

        semester.querySelectorAll("tbody tr").forEach(row=>{

            courses.push({

                name:row.querySelector(".course-name").value,

                grade:row.querySelector(".course-grade").value,

                sks:row.querySelector(".course-sks").value

            });

        });

        semesters.push({

            courses:courses

        });

    });

    localStorage.setItem("ipkData",JSON.stringify(semesters));

}