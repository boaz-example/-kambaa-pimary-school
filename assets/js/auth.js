console.log("✅ AUTH.JS LOADED");
// ============================================================
// GLOBAL DATA
// ============================================================

let allStudents = [];
let allClasses = [];
let allSubjects = [];
let allExams = [];
let marksStudents = [];

// ============================================================
// TOAST
// ============================================================

function toast(message, type = "info") {
    const el = document.getElementById("toast");

    if (!el) {
        console.log(`[${type}] ${message}`);
        return;
    }

    el.textContent = message;
    el.className = "";
    el.classList.add("show", type);

    setTimeout(() => {
        el.classList.remove("show");
    }, 3500);
}
// ============================================================
// SUBMIT ADMISSION
// ============================================================

async function submitAdmission() {

    const firstName = $("adm-fname")?.value.trim();
    const lastName = $("adm-lname")?.value.trim();
    const dob = $("adm-dob")?.value || null;
    const gender = $("adm-gender")?.value || null;
    const classId = $("adm-class")?.value || null;
    const parentName = $("adm-pname")?.value.trim();
    const parentPhone = $("adm-pphone")?.value.trim();
    const parentEmail = $("adm-pemail")?.value.trim() || null;

    // Validate
    if (!firstName) {
        toast("Enter the child's first name.", "error");
        return;
    }

    if (!lastName) {
        toast("Enter the child's last name.", "error");
        return;
    }

    if (!parentName) {
        toast("Enter the parent/guardian name.", "error");
        return;
    }

    if (!parentPhone) {
        toast("Enter the parent/guardian phone.", "error");
        return;
    }

    const payload = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dob,
        gender: gender,
        class_id: classId ? Number(classId) : null,
        parent_name: parentName,
        parent_phone: parentPhone,
        parent_email: parentEmail
    };

    console.log("SUBMITTING ADMISSION:", payload);

    try {

        const response = await api(
            "POST",
            "/admissions",
            payload
        );

        console.log("ADMISSION RESPONSE:", response);

        toast(
            response.message || "Application submitted successfully!",
            "success"
        );

        // Clear form
        $("adm-fname").value = "";
        $("adm-lname").value = "";
        $("adm-dob").value = "";
        $("adm-gender").value = "";
        $("adm-class").value = "";
        $("adm-pname").value = "";
        $("adm-pphone").value = "";
        $("adm-pemail").value = "";

    } catch (error) {

        console.error("SUBMIT ADMISSION ERROR:", error);

        toast(
            error.message || "Failed to submit application.",
            "error"
        );
    }
}

function showPage(name) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(`page-${name}`);

    if (!page) {
        console.error("Page not found:", name);
        return;
    }

    page.classList.add("active");

    // Load page data
    try {

        if (name === "dashboard") {
            loadDashboard?.();
        }

        if (name === "students") {
            loadStudents?.();
        }

        if (name === "marks") {
            loadAllClasses?.();
            loadAllSubjects?.();
            loadAllExams?.();
        }

        if (name === "attendance") {
            loadAllClasses?.();
            setTodayDate?.();
        }

        if (name === "fees") {
            loadFeeTypesTab?.();
        }

        if (name === "announcements") {
            loadStaffAnnouncements?.();
        }

        if (name === "papers") {
            loadPapers?.();
        }

        if (name === "admissions") {
            loadAdmissions?.();
        }

    } catch (error) {
        console.error("SHOW PAGE ERROR:", error);
    }
}
// ============================================================
// HELPER
// ============================================================

function $(id) {
    return document.getElementById(id);
}

function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error("Modal not found:", id);
        return;
    }

    modal.classList.add("open");
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error("Modal not found:", id);
        return;
    }

    modal.classList.remove("open");
}


// ============================================================
// PAGE NAVIGATION
// ============================================================

function showPage(name) {

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const page = $('page-' + name);

    if (page) {
        page.classList.add('active');
    }

    // Load page data
    if (name === 'parent-dashboard') {
        if (typeof loadMyChildren === 'function') {
            loadMyChildren();
        }
    }

    if (name === 'announcements-pub') {
        if (typeof loadPubAnnouncements === 'function') {
            loadPubAnnouncements();
        }
    }

    if (name === 'papers-pub') {
        if (typeof loadPubPapers === 'function') {
            loadPubPapers();
        }
    }

    if (name === 'dashboard') {
        if (typeof loadDashboard === 'function') {
            loadDashboard();
        }
    }

    if (name === 'students') {
        if (typeof loadStudents === 'function') {
            loadStudents();
        }
    }

    if (name === 'marks') {

        loadAllClasses();
        loadAllSubjects();
        loadAllExams();

    }

    if (name === 'attendance') {

        loadAllClasses();

        if (typeof setTodayDate === 'function') {
            setTodayDate();
        }

    }

    if (name === 'fees') {

        if (typeof loadFeeTypesTab === 'function') {
            loadFeeTypesTab();
        }

    }

    if (name === 'announcements') {

        if (typeof loadStaffAnnouncements === 'function') {
            loadStaffAnnouncements();
        }

    }

    if (name === 'papers') {

        if (typeof loadPapers === 'function') {
            loadPapers();
        }

    }

    if (name === 'admissions') {

        if (typeof loadAdmissions === 'function') {
            loadAdmissions();
        }

    }
}
async function submitAdmission() {
    const fname = document.getElementById("adm-fname")?.value.trim();
    const lname = document.getElementById("adm-lname")?.value.trim();
    const dob = document.getElementById("adm-dob")?.value;
    const gender = document.getElementById("adm-gender")?.value;
    const classValue = document.getElementById("adm-class")?.value;
    const parentName = document.getElementById("adm-pname")?.value.trim();
    const parentPhone = document.getElementById("adm-pphone")?.value.trim();
    const parentEmail = document.getElementById("adm-pemail")?.value.trim();

    // Required fields
    if (!fname || !lname) {
        toast("Please enter the child's first and last name.", "error");
        return;
    }

    if (!parentName || !parentPhone) {
        toast("Please enter the parent/guardian name and phone.", "error");
        return;
    }

    try {
        const data = {
            first_name: fname,
            last_name: lname,
            date_of_birth: dob || null,
            gender: gender || null,
            class_id: classValue || null,
            parent_name: parentName,
            parent_phone: parentPhone,
            parent_email: parentEmail || null
        };

        console.log("SUBMITTING ADMISSION:", data);

        const response = await api(
            "POST",
            "/admissions",
            data
        );

        console.log("ADMISSION RESPONSE:", response);

        toast(
            response.message || "Application submitted successfully!",
            "success"
        );

        // Clear form
        document.getElementById("adm-fname").value = "";
        document.getElementById("adm-lname").value = "";
        document.getElementById("adm-dob").value = "";
        document.getElementById("adm-gender").value = "";
        document.getElementById("adm-class").value = "";
        document.getElementById("adm-pname").value = "";
        document.getElementById("adm-pphone").value = "";
        document.getElementById("adm-pemail").value = "";

    } catch (error) {
        console.error("SUBMIT ADMISSION ERROR:", error);

        toast(
            error.message || "Failed to submit application.",
            "error"
        );
    }
}
// ============================================================
// LOGIN
// ============================================================

async function doLogin() {

    const email = $("login-email")?.value.trim();
    const password = $("login-password")?.value;

    if (!email) {
        toast("Please enter your email.", "error");
        return;
    }

    if (!password) {
        toast("Please enter your password.", "error");
        return;
    }

    try {

        console.log("LOGIN ATTEMPT:", email);

        const response = await api(
            "POST",
            "/auth/login",
            {
                email: email,
                password: password
            }
        );

        console.log("LOGIN RESPONSE:", response);

        if (!response || response.success === false) {
            throw new Error(
                response?.message || "Login failed."
            );
        }

        // Save authentication information
        if (response.token) {
            localStorage.setItem("token", response.token);
        }

        if (response.user) {
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );
        }

        closeModal("modal-login");

        toast(
            response.message || "Login successful!",
            "success"
        );

        // Update navigation
        const user = response.user;

        if (user) {

            const nameElement = $("nav-user-name");

            if (nameElement) {
                nameElement.textContent =
                    user.name ||
                    user.full_name ||
                    user.email ||
                    "";
                nameElement.style.display = "inline";
            }

        }

        // Show appropriate dashboard
        if (
            user?.role === "parent"
        ) {
            showPage("parent-dashboard");

        } else {
            showPage("dashboard");
        }

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        toast(
            error.message || "Login failed.",
            "error"
        );
    }
}
// ============================================================
// LOAD ALL CLASSES
// ============================================================

async function loadAllClasses() {

    try {

        const response = await api("GET", "/classes");

        console.log("CLASSES RESPONSE:", response);

        allClasses = response.classes || [];

        const selects = [
            "marks-class",
            "att-class",
            "student-class-filter",
            "ns-class",
            "paper-class",
            "ft-class"
        ];

        selects.forEach(id => {

            const el = document.getElementById(id);

            if (!el) {
                return;
            }

            const firstOption = el.options[0];

            el.innerHTML = "";

            if (firstOption) {
                el.appendChild(firstOption);
            }

            allClasses.forEach(c => {

                const option = document.createElement("option");

                option.value = c.id;

                option.textContent =
                    c.class_name +
                    (c.stream ? " " + c.stream : "");

                el.appendChild(option);

            });

        });

    } catch (error) {

        console.error("LOAD CLASSES ERROR:", error);

        toast(
            error.message || "Failed to load classes",
            "error"
        );

    }
}

// ============================================================
// LOAD ALL SUBJECTS
// ============================================================

async function loadAllSubjects() {

    try {

        const response = await api(
            'GET',
            '/classes/subjects'
        );

        console.log('SUBJECTS RESPONSE:', response);

        /*
         * Depending on your backend, response may be:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * OR
         *
         * {
         *   success: true,
         *   subjects: [...]
         * }
         */

        if (Array.isArray(response)) {

            allSubjects = response;

        } else {

            allSubjects = response.subjects || [];

        }

        console.log('ALL SUBJECTS:', allSubjects);

        const selects = [
            'marks-subject',
            'paper-subject'
        ];

        selects.forEach(id => {

            const el = $(id);

            if (!el) {
                return;
            }

            const firstOption = el.options[0];

            el.innerHTML = '';

            if (firstOption) {
                el.appendChild(firstOption);
            }

            allSubjects.forEach(subject => {

                const option =
                    document.createElement('option');

                option.value = subject.id;

                option.textContent =
                    subject.subject_name ||
                    subject.name ||
                    subject.title ||
                    'Subject ' + subject.id;

                el.appendChild(option);

            });

        });

    } catch (error) {

        console.error('LOAD SUBJECTS ERROR:', error);

        toast(
            error.message || 'Failed to load subjects',
            'error'
        );

    }
}


// ============================================================
// LOAD ALL EXAMS
// ============================================================
async function loadAllExams() {

    try {

        const response = await api("GET", "/exams");

        console.log("EXAMS RESPONSE:", response);

        allExams = response.exams || [];

        const selects = [
            "marks-exam",
            "rc-exam"
        ];

        selects.forEach(id => {

            const select = document.getElementById(id);

            if (!select) {
                return;
            }

            select.innerHTML =
                '<option value="">Select exam</option>';

            allExams.forEach(exam => {

                const option = document.createElement("option");

                option.value = exam.id;

                option.textContent =
                    `${exam.exam_name} - ${exam.term} ${exam.academic_year}`;

                select.appendChild(option);

            });

        });

    } catch (error) {

        console.error("LOAD EXAMS ERROR:", error);

        toast(
            error.message || "Failed to load exams",
            "error"
        );

    }
}

// ============================================================
// POPULATE EXAM SELECT
// ============================================================

function populateExamSelect(id) {

    const el = $(id);

    if (!el) {
        return;
    }

    const firstOption = el.options[0];

    el.innerHTML = '';

    if (firstOption) {
        el.appendChild(firstOption);
    }

    allExams.forEach(exam => {

        const option =
            document.createElement('option');

        option.value = exam.id;

        option.textContent =
            exam.exam_name +
            ' — ' +
            exam.term +
            ' — ' +
            exam.academic_year;

        el.appendChild(option);

    });

}


// ============================================================
// LOAD EXAMS WHEN CLASS CHANGES
// ============================================================

async function loadExamsByClass() {

    const classId =
        $('marks-class')?.value;

    const examSelect =
        $('marks-exam');

    if (!examSelect) {
        return;
    }

    // Reset exam list
    const firstOption =
        examSelect.options[0];

    examSelect.innerHTML = '';

    if (firstOption) {
        examSelect.appendChild(firstOption);
    }

    if (!classId) {
        return;
    }

    /*
     * Exams are currently not linked to classes
     * in your database.
     *
     * Therefore all available exams are displayed.
     */

    allExams.forEach(exam => {

        const option =
            document.createElement('option');

        option.value = exam.id;

        option.textContent =
            exam.exam_name +
            ' — ' +
            exam.term +
            ' — ' +
            exam.academic_year;

        examSelect.appendChild(option);

    });

}


// ============================================================
// LOAD SUBJECTS WHEN CLASS CHANGES
// ============================================================

async function loadSubjectsByClass() {

    const classId =
        $('marks-class')?.value;

    const subjectSelect =
        $('marks-subject');

    if (!subjectSelect) {
        return;
    }

    const firstOption =
        subjectSelect.options[0];

    subjectSelect.innerHTML = '';

    if (firstOption) {
        subjectSelect.appendChild(firstOption);
    }

    let subjects = allSubjects;

    /*
     * If subjects have class_id, filter them.
     *
     * If class_id is NULL, treat them as available
     * to all classes.
     */

    if (classId) {

        subjects = allSubjects.filter(subject => {

            return (
                subject.class_id == classId ||
                subject.class_id == null
            );

        });

    }

    subjects.forEach(subject => {

        const option =
            document.createElement('option');

        option.value = subject.id;

        option.textContent =
            subject.subject_name ||
            subject.name ||
            subject.title ||
            'Subject ' + subject.id;

        subjectSelect.appendChild(option);

    });

}


// ============================================================
// LOAD STUDENTS FOR MARKS
// ============================================================

async function loadStudentsForMarks() {

    const classId =
        $('marks-class')?.value;

    const examId =
        $('marks-exam')?.value;

    const subjectId =
        $('marks-subject')?.value;


    if (!classId) {

        toast(
            'Please select a class.',
            'error'
        );

        return;
    }


    if (!examId) {

        toast(
            'Please select an exam.',
            'error'
        );

        return;
    }


    if (!subjectId) {

        toast(
            'Please select a subject.',
            'error'
        );

        return;
    }


    try {

        console.log(
            'Loading students:',
            {
                classId,
                examId,
                subjectId
            }
        );


        // Get students in selected class

        const students =
            await api(
                'GET',
                `/students?class_id=${classId}&status=active`
            );


        console.log(
            'STUDENTS FOR MARKS:',
            students
        );


        // Get existing marks

        const existingMarks =
            await api(
                'GET',
                `/marks?exam_id=${examId}&class_id=${classId}`
            ).catch(() => []);


        console.log(
            'EXISTING MARKS:',
            existingMarks
        );


        marksStudents = students;


        // Map existing marks by student

        const markMap = {};


        existingMarks.forEach(mark => {

            if (
                mark.subject_id == subjectId
            ) {

                markMap[mark.student_id] =
                    mark;

            }

        });


        const container =
            $('marks-entry-table');


        if (!container) {

            console.error(
                'marks-entry-table not found'
            );

            return;

        }


        // No students

        if (!students.length) {

            container.innerHTML = `
                <div class="card">
                    <p>
                        No active students found
                        in the selected class.
                    </p>
                </div>
            `;

            if ($('marks-save-row')) {

                $('marks-save-row')
                    .style.display = 'none';

            }

            return;

        }


        // Create table

        container.innerHTML = `

            <div class="table-wrap">

                <table>

                    <thead>

                        <tr>

                            <th>Adm. No</th>

                            <th>Student Name</th>

                            <th>Score (0–100)</th>

                            <th>Grade</th>

                            <th>Remarks</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${students.map(student => {

                            const existing =
                                markMap[student.id];

                            return `

                                <tr>

                                    <td>
                                        ${
                                            student.admission_number ||
                                            student.admission_no ||
                                            '—'
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.first_name
                                        }
                                        ${
                                            student.last_name
                                        }
                                    </td>

                                    <td>

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"

                                            value="${
                                                existing?.score ??
                                                ''
                                            }"

                                            id="score-${student.id}"

                                            style="
                                                width:80px;
                                                border:1.5px solid var(--border);
                                                border-radius:6px;
                                                padding:.35rem .5rem;
                                            "

                                            oninput="
                                                updateGradeCell(
                                                    ${student.id},
                                                    this.value
                                                )
                                            "
                                        >

                                    </td>

                                    <td
                                        id="grade-${student.id}"
                                    >
                                        ${
                                            existing?.grade ||
                                            '—'
                                        }
                                    </td>

                                    <td>

                                        <input
                                            type="text"

                                            value="${
                                                existing?.remarks ||
                                                ''
                                            }"

                                            id="rem-${student.id}"

                                            placeholder="Optional"

                                            style="
                                                width:120px;
                                                border:1.5px solid var(--border);
                                                border-radius:6px;
                                                padding:.35rem .5rem;
                                            "
                                        >

                                    </td>

                                </tr>

                            `;

                        }).join('')}

                    </tbody>

                </table>

            </div>

        `;


        if ($('marks-save-row')) {

            $('marks-save-row')
                .style.display = 'block';

        }

    } catch (error) {

        console.error(
            'LOAD MARKS STUDENTS ERROR:',
            error
        );

        toast(
            error.message ||
            'Failed to load students',
            'error'
        );

    }

}


// ============================================================
// GRADE CALCULATION
// ============================================================

function gradeFromScore(score) {

    score =
        parseFloat(score);


    if (isNaN(score)) {
        return '—';
    }


    if (score >= 80) {
        return 'A';
    }

    if (score >= 70) {
        return 'B';
    }

    if (score >= 60) {
        return 'C';
    }

    if (score >= 50) {
        return 'D';
    }

    return 'E';

}
function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error("Modal not found:", id);
        return;
    }

    modal.classList.add("open");
}


function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
        console.error("Modal not found:", id);
        return;
    }

    modal.classList.remove("open");
}


// ============================================================
// UPDATE GRADE
// ============================================================

function updateGradeCell(
    studentId,
    value
) {

    const cell =
        $('grade-' + studentId);

    if (!cell) {
        return;
    }

    cell.textContent =
        value
            ? gradeFromScore(value)
            : '—';

}


// ============================================================
// SAVE MARKS
// ============================================================

async function saveMarks() {

    const examId =
        $('marks-exam')?.value;

    const subjectId =
        $('marks-subject')?.value;


    if (!examId || !subjectId) {

        toast(
            'Select exam and subject.',
            'error'
        );

        return;

    }


    const marks =
        marksStudents
            .map(student => {

                const scoreInput =
                    $('score-' + student.id);

                const remarksInput =
                    $('rem-' + student.id);


                return {

                    student_id:
                        student.id,

                    subject_id:
                        parseInt(subjectId),

                    exam_id:
                        parseInt(examId),

                    score:
                        parseFloat(
                            scoreInput?.value || 0
                        ),

                    remarks:
                        remarksInput?.value || ''

                };

            })
            .filter(mark =>
                !isNaN(mark.score) &&
                mark.score >= 0
            );


    if (!marks.length) {

        toast(
            'No scores entered.',
            'error'
        );

        return;

    }


    try {

        console.log(
            'SAVING MARKS:',
            marks
        );


        const response =
            await api(
                'POST',
                '/marks/bulk',
                { marks }
            );


        console.log(
            'SAVE MARKS RESPONSE:',
            response
        );


        toast(
            response.message ||
            'Marks saved successfully.',
            'success'
        );


        // Reload the table

        await loadStudentsForMarks();


    } catch (error) {

        console.error(
            'SAVE MARKS ERROR:',
            error
        );

        toast(
            error.message ||
            'Failed to save marks.',
            'error'
        );

    }

}


// ============================================================
// SEARCH STUDENT FOR REPORT CARD
// ============================================================

async function searchStudentsRC() {

    const search =
        $('rc-student-search')?.value.trim();


    if (!search || search.length < 2) {
        return;
    }


    try {

        const data =
            await api(
                'GET',
                `/students?search=${encodeURIComponent(search)}`
            );


        const select =
            $('rc-student');


        if (!select) {
            return;
        }


        const firstOption =
            select.options[0];


        select.innerHTML = '';


        if (firstOption) {
            select.appendChild(firstOption);
        }


        data.forEach(student => {

            const option =
                document.createElement('option');


            option.value =
                student.id;


            option.textContent =
                `${
                    student.first_name
                } ${
                    student.last_name
                } (${
                    student.admission_number ||
                    student.admission_no ||
                    ''
                })`;


            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            'SEARCH STUDENTS ERROR:',
            error
        );

    }

}


// ============================================================
// LOAD REPORT CARD
// ============================================================

async function loadReportCard() {

    const studentId =
        $('rc-student')?.value;

    const examId =
        $('rc-exam')?.value;


    if (!studentId || !examId) {

        toast(
            'Select student and exam.',
            'error'
        );

        return;

    }


    try {

        const data =
            await api(
                'GET',
                `/marks/report-card/${studentId}/${examId}`
            );


        console.log(
            'REPORT CARD:',
            data
        );


        const container =
            $('report-card-container');


        if (!container) {
            return;
        }


        container.innerHTML = `

            <div class="report-card">

                <div class="rc-header">

                    <h2>
                        ACK Kambaa Primary School
                    </h2>

                    <p>
                        Student Report Card —
                        ${
                            data.exam?.exam_name ||
                            data.exam?.name ||
                            ''
                        }
                    </p>

                </div>


                <div class="rc-body">

                    <div class="rc-info">

                        <span>
                            Student Name
                        </span>

                        <strong>
                            ${
                                data.student.first_name
                            }
                            ${
                                data.student.last_name
                            }
                        </strong>


                        <span>
                            Admission No
                        </span>

                        <strong>
                            ${
                                data.student.admission_number ||
                                data.student.admission_no ||
                                '—'
                            }
                        </strong>


                        <span>
                            Class
                        </span>

                        <strong>
                            ${
                                data.student.class_name ||
                                '—'
                            }
                            ${
                                data.student.stream ||
                                ''
                            }
                        </strong>


                        <span>
                            Term / Year
                        </span>

                        <strong>
                            ${
                                data.exam?.term ||
                                '—'
                            }
                            /
                            ${
                                data.exam?.academic_year ||
                                '—'
                            }
                        </strong>

                    </div>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(
            'REPORT CARD ERROR:',
            error
        );

        toast(
            error.message ||
            'Failed to load report card.',
            'error'
        );

    }

}
// ============================================================
// MAKE FUNCTIONS AVAILABLE TO HTML onclick="..." EVENTS
// ============================================================
window.TEST_AUTH = "AUTH JS IS RUNNING";

console.log("🔥 AUTH.JS STARTED");
window.$ = $;

window.toast = toast;

window.showPage = showPage;

window.openModal = openModal;
window.closeModal = closeModal;

window.submitAdmission = submitAdmission;

window.doLogin = doLogin;

window.loadAllClasses = loadAllClasses;
window.loadAllSubjects = loadAllSubjects;
window.loadAllExams = loadAllExams;

window.populateExamSelect = populateExamSelect;

window.loadExamsByClass = loadExamsByClass;
window.loadSubjectsByClass = loadSubjectsByClass;

window.loadStudentsForMarks = loadStudentsForMarks;

window.gradeFromScore = gradeFromScore;
window.updateGradeCell = updateGradeCell;

window.saveMarks = saveMarks;

window.searchStudentsRC = searchStudentsRC;
window.loadReportCard = loadReportCard;

console.log("✅ AUTH.JS FUNCTIONS EXPORTED");
console.log("doLogin:", typeof window.doLogin);
console.log("submitAdmission:", typeof window.submitAdmission);
console.log("openModal:", typeof window.openModal);
console.log("toast:", typeof window.toast);
console.log("🔥 REACHED END OF AUTH.JS");

window.doLogin = doLogin;
window.submitAdmission = submitAdmission;
window.openModal = openModal;
window.closeModal = closeModal;
window.toast = toast;

console.log("🔥 FUNCTIONS EXPORTED");
console.log("doLogin:", typeof window.doLogin);
console.log("submitAdmission:", typeof window.submitAdmission);
console.log("openModal:", typeof window.openModal);