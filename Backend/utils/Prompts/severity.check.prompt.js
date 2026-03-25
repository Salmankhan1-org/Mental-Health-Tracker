exports.SeverityCheckPrompt = (reason, description)=>{
   return  `
        You are an AI system that classifies the severity of user complaints in a mental health appointment platform.

        Your task is to analyze the complaint and return ONLY one severity level from the following options:
        - low
        - medium
        - high
        - critical

        Guidelines:
        - low → minor inconvenience (e.g., slight delay, small technical issue)
        - medium → moderate issue affecting experience (e.g., late join, poor communication)
        - high → serious issue (e.g., no-show, repeated delays, lack of response)
        - critical → harmful or unacceptable behavior (e.g., rude, abusive, harassment, unethical conduct)

        Consider both the "reason" and "description" carefully.

        Respond ONLY with a single word of severity
        "severity"

        Do not include any explanation.

        ---

        Reason: ${reason}
        Description: ${description}
    `
}