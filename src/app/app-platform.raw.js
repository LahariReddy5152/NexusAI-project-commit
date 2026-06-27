function updateProgress(){

    const checks =
    document.querySelectorAll(
        ".steps input"
    );

    let completed = 0;

    checks.forEach(check=>{

        if(check.checked){

            completed++;

        }

    });

    const percent =
    Math.round(
        (completed/checks.length)
        *100
    );

    const fill =
    document.getElementById(
        "progressFill"
    );

    const text =
    document.getElementById(
        "progressText"
    );

    const score =
    document.getElementById(
        "projectScore"
    );

    if(fill){

        fill.style.width =
        percent + "%";

    }

    if(text){

        text.innerText =
        percent + "%";

    }

    if(score){

        score.innerText =
        percent;

    }

    localStorage.setItem(
        "projectProgress",
        percent
    );

}function submitProject(){

    const github=document.getElementById("githubLink").value;

    localStorage.setItem("githubSubmission",github);

alert(
"Project Submitted Successfully"
);

const review =
`
AI Review

Strengths:
✔ Project completed

Suggestions:
✔ Improve documentation
✔ Add screenshots
✔ Add deployment link

Common Mistake:
✔ Missing README
`;

alert(review);}

window.onload=function(){

    const saved=localStorage.getItem("projectProgress");

    if(saved !== null){

        document.getElementById("progressFill").style.width=`${saved}%`;

        document.getElementById("progressText").innerText=`${saved}%`;
    }

    const chatInput=document.getElementById("chatInput");
    if(chatInput){
        chatInput.addEventListener("keypress",function(event){
            if(event.key==="Enter"){
                event.preventDefault();
                sendMessage();
            }
        });
    }
}

window.showSection=showSection;
window.toggleSidebar=toggleSidebar;
window.toggleChatbot=toggleChatbot;
window.sendMessage=sendMessage;
window.updateProgress=updateProgress;
window.submitProject=submitProject;
window.switchTab=switchTab;
window.runCode=runCode;
window.openInterviewPrepCard=openInterviewPrepCard;
window.showPracticeProblem=showPracticeProblem;
window.closeChatbot=closeChatbot;
window.minimizeChatbot=minimizeChatbot;

function analyzeResume() {

    const ats =
        Math.floor(Math.random() * 15) + 85;

    document.getElementById("atsScore")
        .innerText = ats + "%";

    document.getElementById("skillsList")
        .innerHTML = `
            <li>Java</li>
            <li>Spring Boot</li>
            <li>React</li>
            <li>SQL</li>
            <li>REST APIs</li>
        `;

    document.getElementById(
        "resumeSuggestions"
    ).innerText =
        "Add AI projects, cloud skills, and measurable achievements.";
}

window.analyzeResume = analyzeResume;

function generateRoadmap() {
    const roadmap = [
        "Python Fundamentals",
        "Spring Boot",
        "REST APIs",
        "React",
        "SQL",
        "AWS",
        "OpenAI APIs",
        "RAG Systems"
    ];
    document.getElementById("roadmapOutput")
        .innerHTML =
        roadmap.map(step =>
        `<li>${step}</li>`).join("");
}

window.generateRoadmap = generateRoadmap;

function toggleDarkMode() {
    document.body.classList.toggle("light-mode");
}

window.toggleDarkMode = toggleDarkMode;
let timer;
let minutes =
Number(
localStorage.getItem(
"projectMinutes"
)
) || 0;

function startTimer(){

    if(timer) return;

    timer = setInterval(()=>{

        minutes++;

        localStorage.setItem(
            "projectMinutes",
            minutes
        );

        updateTime();

    },60000);

}

function stopTimer(){

    clearInterval(timer);

    timer = null;

}

function updateTime(){

    const element =
    document.getElementById(
        "timeSpent"
    );

    if(element){

        element.innerText =
        minutes;

    }

}

updateTime();
function saveJobApplication(){

    const company =
    document.getElementById(
        "companyName"
    ).value;

    const status =
    document.getElementById(
        "jobStatus"
    ).value;

    if(!company) return;

    let jobs =
    JSON.parse(
        localStorage.getItem(
            "jobApplications"
        )
    ) || [];

    jobs.push({
        company,
        status
    });

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(jobs)
    );

    renderJobs();

}

function renderJobs(){

    const list =
    document.getElementById(
        "jobApplications"
    );

    if(!list) return;

    let jobs =
    JSON.parse(
        localStorage.getItem(
            "jobApplications"
        )
    ) || [];

    list.innerHTML = "";

    jobs.forEach(job=>{

        list.innerHTML += `
        <li>
        ${job.company}
        -
        ${job.status}
        </li>
        `;

    });

}

renderJobs();

window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.saveJobApplication = saveJobApplication;


function startProject(projectName){

    document.getElementById(
        "projectTitle"
    ).innerText = projectName;

    document.getElementById(
        "projectDescription"
    ).innerText =
    "Build and complete the " +
    projectName +
    " project using the guided workflow.";

    showSection(
        "projectDetailSection"
    );

}

window.startProject =
startProject;

function unlockCertificates(){

    const progress =
    Number(
        localStorage.getItem(
            "projectProgress"
        )
    ) || 0;

    if(progress >= 80){

        document.querySelectorAll(
            ".cert-status"
        ).forEach(cert=>{

            cert.innerText =
            "✅ Unlocked";

        });

    }

}

unlockCertificates();
function saveProfile(){

    const name =
    document.getElementById(
        "editProfileName"
    ).value;
    const email =
    document.getElementById(
        "editProfileEmail"
    ).value;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if(trimmedName){
        localStorage.setItem(
            "profileName",
            trimmedName
        );

        document.getElementById(
            "profileName"
        ).innerText =
        trimmedName;
    }

    if(trimmedEmail){
        localStorage.setItem(
            "profileEmail",
            trimmedEmail
        );

        document.getElementById(
            "profileEmail"
        ).innerText =
        trimmedEmail;
    }

}

const savedName =
localStorage.getItem(
    "profileName"
);

if(savedName){

    const profile =
    document.getElementById(
        "profileName"
    );

    if(profile){

        profile.innerText =
        savedName;

    }

}

const savedEmail =
localStorage.getItem(
    "profileEmail"
);

if(savedEmail){

    const profileEmail =
    document.getElementById(
        "profileEmail"
    );

    if(profileEmail){

        profileEmail.innerText =
        savedEmail;

    }

}
function updateAnalytics(){

    const progress =
    Number(
        localStorage.getItem(
            "projectProgress"
        )
    ) || 0;

    const daily =
    document.getElementById(
        "dailyProgress"
    );

    const weekly =
    document.getElementById(
        "weeklyProgress"
    );

    const monthly =
    document.getElementById(
        "monthlyProgress"
    );

    if(daily){

        daily.innerText =
        progress + "%";

    }

    if(weekly){

        weekly.innerText =
        Math.min(
            progress + 15,
            100
        ) + "%";

    }

    if(monthly){

        monthly.innerText =
        Math.min(
            progress + 25,
            100
        ) + "%";

    }

}
