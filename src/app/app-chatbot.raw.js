    const userMessageNode = document.createElement("p");
    userMessageNode.textContent = `You: ${userText}`;
    messages.appendChild(userMessageNode);

    const currentMode = modeSelect?.value || "learning";
    const aiResponse = getAIMentorResponse(userText, currentMode);
    const aiMessageNode = document.createElement("p");
    aiMessageNode.textContent = `Virtual Recruiter: ${aiResponse}`;
    messages.appendChild(aiMessageNode);

    input.value="";

    messages.scrollTop=messages.scrollHeight;
}

function updateProgress(){

    const checks =
    document.querySelectorAll(
        ".steps input"
    );

    let completed = 0;

