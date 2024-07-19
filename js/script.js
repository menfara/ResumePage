class Resume {
    constructor(id, name, age, email, phone, isTechOrdaGraduate, education, englishLevel, techOrdaDirection, employmentStatus, hasInternationalExperience, internationalCompanies, portfolioLink) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.phone = phone;
        this.isTechOrdaGraduate = isTechOrdaGraduate;
        this.education = education;
        this.englishLevel = englishLevel;
        this.techOrdaDirection = techOrdaDirection;
        this.employmentStatus = employmentStatus;
        this.hasInternationalExperience = hasInternationalExperience;
        this.internationalCompanies = internationalCompanies;
        this.portfolioLink = portfolioLink;
    }
}


// Моковые данные резюме
const mockResumes = [
    new Resume(0, "John Doe", 25, "john.doe@example.com", "+1234567890", true, "Computer Science, University of Example, 2020", "Advanced", "Data Science", "Employed", true, "Example Inc.", "https://github.com/johndoe"),
    new Resume(1, "Jane Smith", 28, "jane.smith@example.com", "+1987654321", false, "Information Technology, Example University, 2018", "Intermediate", "Frontend Development", "Freelancer", false, "", ""),
    new Resume(2, "Alice Johnson", 30, "alice.johnson@example.com", "+1478523690", true, "Software Engineering, Tech University, 2015", "Advanced", "Backend Development", "Employed", true, "Tech Solutions", "https://linkedin.com/in/alicejohnson"),
    new Resume(3, "Bob Brown", 22, "bob.brown@example.com", "+9638527410", false, "Cybersecurity, National Institute, 2022", "Beginner", "Cybersecurity", "Intern", false, "", ""),
    new Resume(4, "Charlie Davis", 27, "charlie.davis@example.com", "+1597534862", true, "Data Science, Data University, 2019", "Advanced", "Data Science", "Employed", true, "DataCorp", "https://github.com/charliedavis"),
    new Resume(5, "Diana Evans", 29, "diana.evans@example.com", "+2589631470", false, "UI/UX Design, Design School, 2016", "Advanced", "UI/UX Design", "Freelancer", false, "", ""),
    new Resume(6, "Diana Evans", 29, "diana.evans@example.com", "+2589631470", false, "UI/UX Design, Design School, 2016", "Advanced", "UI/UX Design", "Freelancer", false, "", ""),
    new Resume(7, "Evan Foster", 26, "evan.foster@example.com", "+7412589630", true, "Computer Engineering, Tech Institute, 2018", "Intermediate", "Full Stack Development", "Employed", true, "WebWorks", "https://github.com/evanfoster"),
    new Resume(8, "Fiona Green", 24, "fiona.green@example.com", "+3216549870", false, "Business Analysis, Business School, 2020", "Intermediate", "Business Analysis", "Freelancer", false, "", ""),
    new Resume(9, "Fiona Green", 24, "fiona.green@example.com", "+3216549870", true, "Business Analysis, Business School, 2020", "Intermediate", "Business Analysis", "Freelancer", false, "", ""),
    new Resume(10, "George Harris", 31, "george.harris@example.com", "+9517534862", true, "Artificial Intelligence, AI Academy, 2017", "Advanced", "Artificial Intelligence", "Employed", true, "AICorp", "https://linkedin.com/in/georgeharris"),
    new Resume(11, "Hannah Jackson", 23, "hannah.jackson@example.com", "+1594872630", false, "Web Development, Web Institute, 2021", "Intermediate", "Web Development", "Intern", false, "", "")
];



async function fetchAndProcessFile() {
    try {
        const response = await fetch('http://localhost:63342/ResumePage/base.xlsx');
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert Excel sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Parse JSON data to create Resume instances, filtering out empty rows
        const resumes = jsonData.slice(1).reduce((acc, row, index) => {
            if (row.every(cell => cell === undefined || cell === null || cell === '')) {
                return acc;
            }
            acc.push(new Resume(
                index,
                row[1],  // 'Ваше полное ФИО'
                row[2],  // 'Возраст'
                row[12],  // 'Возраст'
                row[4],  // 'Номер телефона'
                true,  // 'Вы студент или выпускник Программы Tech Orda?'
                row[6],  // 'Какое у вас образование? (укажите учебное заведение, специальность и год окончания)'
                row[7],  // 'Какой у вас уровень владения английским языком?'
                row[8],  // 'По какому направлению обучаетесь/обучились в рамках Программы Tech Orda? (Например: программирование, кибербезопасность, разработка веб-сайтов, искусственный интеллект и т.д.)'
                row[9],  // 'Каков ваш текущий статус занятости?'
                row[10] === 'Да',  // 'Есть ли у вас опыт стажировки/трудоустройства в международных компаниях?'
                row[11], // 'Если у вас был опыт стажировки/трудоустройства в международных компаниях, то укажите названия международных компаний'
                row[13]  // 'Направьте ссылку на ваше портфолио (GitHub, LinkedIn)'
            ));
            return acc;
        }, []);
        console.log(resumes);
        return resumes;
    } catch (error) {
        console.error('Error fetching or processing the file:', error);
        return [];
    }
}


function getUniqueTechOrdaDirections(resumes) {
    let uniqueDirections = [];
    let seen = {}; // Для отслеживания уже добавленных направлений

    resumes.forEach(function(resume) {
        let direction = resume.techOrdaDirection;
        if (!seen[direction]) {
            seen[direction] = true;
            uniqueDirections.push(direction);
        }
    });

    return uniqueDirections;
}

// Функция для отображения резюме на странице
function displayResumes(resumes) {
    let templateSource = document.getElementById("resume-template").innerHTML;
    let template = Handlebars.compile(templateSource);
    let list = $('#resumes-list');
    list.empty();

    resumes.forEach(function(resume) {
        let html = template(resume);
        list.append(html);
    });
}

function populateDirectionFilter(uniqueDirections) {
    let select = $('#direction-filter'); // Находим элемент <select> по его ID

    // Очищаем текущие <option> элементы
    select.empty();

    // Добавляем первый <option> "All Directions"
    select.append('<option value="">All Directions</option>');

    // Добавляем каждое направление как новый <option>
    uniqueDirections.forEach(function(direction) {
        select.append(`<option value="${direction}">${direction}</option>`);
    });
}

// Функция фильтрации резюме
function filterResumes(resumes) {
    let selectedDirection = $("#direction-filter").val();
    let showTechOrdaGraduates = $("#tech-orda-graduates-filter").is(":checked");
    let filteredResumes = resumes.filter(resume => {
        return (!(showTechOrdaGraduates && !resume.isTechOrdaGraduate) &&
                (selectedDirection === "" || resume.techOrdaDirection === selectedDirection));
    });

    displayResumes(filteredResumes);
}

// Инициализация отображения всех резюме при загрузке страницы
 $(document).ready(function() {
    fetchAndProcessFile().then(resumes => {
        displayResumes(resumes);
        let uniqueDirections = getUniqueTechOrdaDirections(resumes); // Получаем уникальные направления
        populateDirectionFilter(uniqueDirections); // Заполняем <select> с направлениями

        $("#tech-orda-graduates-filter").click(function() {
            filterResumes(resumes);
        });

        $("#direction-filter").change(function() {
            filterResumes(resumes);
        });
    });
});