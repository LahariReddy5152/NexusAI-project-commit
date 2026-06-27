    );

    if(!code){

        output.innerText =
        "Please enter code.";

        return;

    }

    if(
        code.includes("print")
    ){

        output.innerText =
        "Python execution simulated successfully.";

    }
    else if(
        code.includes(
            "console.log"
        )
    ){

        output.innerText =
        "JavaScript execution simulated successfully.";

    }
    else{

        output.innerText =
        "Code validated successfully.";

    }

}
function openInterviewPrepCard(type) {
    const titleEl = document.getElementById("interviewPrepTitle");
    const contentEl = document.getElementById("interviewPrepContent");
    if (!titleEl || !contentEl) {
        return;
    }

    const cardContent = {
        hr: {
            title: "HR Interview",
