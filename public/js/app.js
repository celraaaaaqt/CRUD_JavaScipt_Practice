const form = document.getElementById("studentForm");
const studentsContainer = document.getElementById("students");


// ====================
// READ
// ====================

async function getStudents() {

    const response = await fetch("/api/students");

    const students = await response.json();

    studentsContainer.innerHTML = "";

    students.forEach(student => {

        const studentElement = document.createElement("div");

        studentElement.className =
            "bg-white p-5 rounded-lg shadow flex justify-between items-center";

        studentElement.innerHTML = `
            <div>
                <h3 class="text-xl font-bold">
                    ${student.name}
                </h3>

                <p>
                    Age: ${student.age}
                </p>

                <p>
                    Course: ${student.course}
                </p>
            </div>

            <div class="flex gap-2">

                <button
                    onclick="editStudent(
                        ${student.id},
                        '${student.name}',
                        ${student.age},
                        '${student.course}'
                    )"
                    class="bg-yellow-500 text-white px-3 py-2 rounded"
                >
                    Edit
                </button>

                <button
                    onclick="deleteStudent(${student.id})"
                    class="bg-red-500 text-white px-3 py-2 rounded"
                >
                    Delete
                </button>

            </div>
        `;

        studentsContainer.appendChild(studentElement);
    });
}


// ====================
// CREATE
// ====================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const course = document.getElementById("course").value;

    await fetch("/api/students", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            age,
            course
        })

    });

    form.reset();

    getStudents();
});


// ====================
// UPDATE
// ====================

async function editStudent(id, name, age, course) {

    const newName = prompt("Enter new name:", name);
    const newAge = prompt("Enter new age:", age);
    const newCourse = prompt("Enter new course:", course);

    if (!newName || !newAge || !newCourse) {
        return;
    }

    await fetch(`/api/students/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: newName,
            age: newAge,
            course: newCourse
        })

    });

    getStudents();
}


// ====================
// DELETE
// ====================

async function deleteStudent(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
        return;
    }

    await fetch(`/api/students/${id}`, {
        method: "DELETE"
    });

    getStudents();
}


// Load students
getStudents();