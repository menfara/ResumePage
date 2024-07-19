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

        return resumes;
    } catch (error) {
        console.error('Error fetching or processing the file:', error);
        return [];
    }
}

function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setResumeDetails(resume) {
    document.querySelector("#talent-link").href = resume.portfolioLink;
    document.querySelector("#talent-name").innerHTML = resume.name;
    document.querySelector("#talent-edu").innerHTML = resume.education;
    document.querySelector("#talent-resume-title").innerHTML = resume.techOrdaDirection;

    if (resume.isTechOrdaGraduate) {
        document.querySelector(".course-avatar-block-top").style.display = 'initial';
    }
}

async function fetchResume(id) {
    const resumes = await fetchAndProcessFile();
    const resume = resumes.find(r => r.id == id);
    if (resume) {
        return resume;
    } else {
        throw new Error('Resume not found');
    }
}

$(document).ready(async function() {
    var id = getQueryParam('id');

    try {
        const data = await fetchResume(id);
        console.log(data);
        setResumeDetails(data);
    } catch (error) {
        console.log(error);
    }
});
