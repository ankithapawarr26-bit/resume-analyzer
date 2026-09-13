document.addEventListener("DOMContentLoaded", () => {

    const resumeText =
        document.getElementById("resumeText");

    const jobDescription =
        document.getElementById("jobDescription");

    const jobTitle =
        document.getElementById("jobTitle");

    const resumeFile =
        document.getElementById("resumeFile");

    const dropZone =
        document.getElementById("dropZone");

    const analyzeBtn =
        document.getElementById("analyzeBtn");

    const resumeCount =
        document.getElementById("resumeCount");

    const jobCount =
        document.getElementById("jobCount");

    const message =
        document.getElementById("analyzeMessage");


    if (!resumeText || !analyzeBtn) {
        return;
    }


    /* ==============================
       CHARACTER COUNTERS
    ============================== */

    resumeText.addEventListener(
        "input",
        () => {

            resumeCount.textContent =
                resumeText.value.length;

        }
    );


    jobDescription.addEventListener(
        "input",
        () => {

            jobCount.textContent =
                jobDescription.value.length;

        }
    );


    /* ==============================
       FILE UPLOAD
    ============================== */

    resumeFile.addEventListener(
        "change",
        handleFile
    );


    function handleFile(event) {

        const file =
            event.target.files[0];

        if (!file) return;


        if (
            !file.name
                .toLowerCase()
                .endsWith(".txt")
        ) {

            alert(
                "For this demo, please upload a .txt file."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                resumeText.value =
                    event.target.result;

                resumeCount.textContent =
                    resumeText.value.length;

                dropZone.classList.add(
                    "uploaded"
                );

            };


        reader.readAsText(file);

    }


    /* ==============================
       DRAG AND DROP
    ============================== */

    [
        "dragenter",
        "dragover"
    ].forEach(eventName => {

        dropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropZone.classList.add(
                    "dragging"
                );

            }
        );

    });


    [
        "dragleave",
        "drop"
    ].forEach(eventName => {

        dropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropZone.classList.remove(
                    "dragging"
                );

            }
        );

    });


    dropZone.addEventListener(
        "drop",
        event => {

            const file =
                event.dataTransfer.files[0];

            if (!file) return;


            if (
                !file.name
                    .toLowerCase()
                    .endsWith(".txt")
            ) {

                alert(
                    "Please use a .txt file for this demo."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    resumeText.value =
                        event.target.result;

                    resumeCount.textContent =
                        resumeText.value.length;

                    dropZone.classList.add(
                        "uploaded"
                    );

                };


            reader.readAsText(file);

        }
    );


    /* ==============================
       ANALYZE BUTTON
    ============================== */

    analyzeBtn.addEventListener(
        "click",
        analyzeResume
    );


    function analyzeResume() {

        const resume =
            resumeText.value.trim();

        const job =
            jobDescription.value.trim();


        if (resume.length < 50) {

            message.textContent =
                "Please enter more resume content before analyzing.";

            message.className =
                "error-message";

            return;

        }


        message.textContent =
            "Analyzing your resume...";

        message.className =
            "loading-message";


        analyzeBtn.disabled = true;


        setTimeout(() => {

            const result =
                performAnalysis(
                    resume,
                    job
                );


            localStorage.setItem(
                "resumeAnalysis",
                JSON.stringify(result)
            );


            message.textContent =
                "Analysis complete! Redirecting...";


            setTimeout(() => {

                window.location.href =
                    "results.html";

            }, 500);


        }, 700);

    }


    /* ==============================
       MAIN ANALYSIS
    ============================== */

    function performAnalysis(
        resume,
        job
    ) {

        const normalizedResume =
            resume.toLowerCase();


        const normalizedJob =
            job.toLowerCase();


        /* ---------- SKILLS ---------- */

        const detectedSkills =
            RESUME_SKILLS.filter(skill => {

                return normalizedResume.includes(
                    skill.toLowerCase()
                );

            });


        let skillsScore =
            Math.min(
                100,
                detectedSkills.length * 10
            );


        if (detectedSkills.length >= 8) {
            skillsScore = 100;
        }


        /* ---------- SECTIONS ---------- */

        const sections = {};


        Object.entries(
            RESUME_SECTIONS
        ).forEach(
            ([section, keywords]) => {

                sections[section] =
                    keywords.some(
                        keyword =>
                            normalizedResume.includes(
                                keyword
                            )
                    );

            }
        );


        const sectionValues =
            Object.values(sections);


        const sectionPercentage =
            (
                sectionValues.filter(Boolean).length /
                sectionValues.length
            ) * 100;


        /* ---------- CONTACT ---------- */

        const hasEmail =
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
                .test(resume);


        const hasPhone =
            /(\+91[\s-]?)?[6-9]\d{9}/
                .test(resume);


        /* ---------- ACTION VERBS ---------- */

        const actionVerbCount =
            ACTION_VERBS.filter(
                verb =>
                    normalizedResume.includes(
                        verb
                    )
            ).length;


        /* ---------- LENGTH ---------- */

        const words =
            resume
                .split(/\s+/)
                .filter(Boolean);


        const wordCount =
            words.length;


        let contentScore = 50;


        if (wordCount >= 150)
            contentScore += 15;

        if (wordCount >= 300)
            contentScore += 10;

        if (wordCount >= 500)
            contentScore += 5;

        if (actionVerbCount >= 3)
            contentScore += 10;

        if (hasEmail)
            contentScore += 5;

        if (hasPhone)
            contentScore += 5;


        contentScore =
            Math.min(
                100,
                contentScore
            );


        /* ---------- JOB KEYWORDS ---------- */

        const jobWords =
            extractImportantWords(
                normalizedJob
            );


        const resumeWords =
            new Set(
                normalizedResume
                    .replace(
                        /[^a-z0-9+#.]/g,
                        " "
                    )
                    .split(/\s+/)
                    .filter(Boolean)
            );


        const matchedKeywords =
            jobWords.filter(
                word =>
                    resumeWords.has(word)
            );


        const missingKeywords =
            jobWords.filter(
                word =>
                    !resumeWords.has(word)
            );


        let keywordScore = 70;


        if (jobWords.length > 0) {

            keywordScore =
                Math.round(
                    (
                        matchedKeywords.length /
                        jobWords.length
                    ) * 100
                );

        }


        /* ---------- ATS SCORE ---------- */

        let atsScore =
            Math.round(
                (
                    sectionPercentage * 0.45
                ) +
                (
                    contentScore * 0.25
                ) +
                (
                    skillsScore * 0.20
                ) +
                (
                    (hasEmail && hasPhone
                        ? 100
                        : 50) * 0.10
                )
            );


        atsScore =
            Math.min(
                100,
                Math.max(
                    0,
                    atsScore
                )
            );


        /* ---------- OVERALL SCORE ---------- */

        let overallScore;


        if (jobWords.length > 0) {

            overallScore =
                Math.round(
                    (
                        atsScore * 0.40
                    ) +
                    (
                        skillsScore * 0.20
                    ) +
                    (
                        keywordScore * 0.25
                    ) +
                    (
                        contentScore * 0.15
                    )
                );

        } else {

            overallScore =
                Math.round(
                    (
                        atsScore * 0.45
                    ) +
                    (
                        skillsScore * 0.25
                    ) +
                    (
                        contentScore * 0.30
                    )
                );

        }


        /* ---------- STRENGTHS ---------- */

        const strengths = [];


        if (detectedSkills.length >= 5) {

            strengths.push(
                "Your resume contains a good range of recognizable skills."
            );

        }


        if (sectionPercentage >= 70) {

            strengths.push(
                "Your resume contains most of the important sections."
            );

        }


        if (actionVerbCount >= 3) {

            strengths.push(
                "You use action-oriented language in your resume."
            );

        }


        if (hasEmail && hasPhone) {

            strengths.push(
                "Your contact information appears to be present."
            );

        }


        if (wordCount >= 250) {

            strengths.push(
                "Your resume contains enough content for meaningful analysis."
            );

        }


        if (!strengths.length) {

            strengths.push(
                "Your resume provides a starting point that can be improved."
            );

        }


        /* ---------- WEAKNESSES ---------- */

        const weaknesses = [];


        if (detectedSkills.length < 4) {

            weaknesses.push(
                "Add more relevant technical or professional skills."
            );

        }


        if (sectionPercentage < 70) {

            weaknesses.push(
                "Some standard resume sections are missing."
            );

        }


        if (!hasEmail) {

            weaknesses.push(
                "Add a professional email address."
            );

        }


        if (!hasPhone) {

            weaknesses.push(
                "Consider adding a professional contact number."
            );

        }


        if (actionVerbCount < 3) {

            weaknesses.push(
                "Use stronger action verbs when describing your work and projects."
            );

        }


        if (wordCount < 150) {

            weaknesses.push(
                "Your resume content appears quite short."
            );

        }


        if (
            jobWords.length &&
            missingKeywords.length > 0
        ) {

            weaknesses.push(
                "Some keywords from the target job description are missing."
            );

        }


        if (!weaknesses.length) {

            weaknesses.push(
                "Continue tailoring your resume for each target position."
            );

        }


        return {

            overallScore,

            atsScore,

            skillsScore,

            keywordScore,

            contentScore,

            skills:
                detectedSkills,

            sections,

            strengths,

            weaknesses,

            matchedKeywords,

            missingKeywords,

            wordCount,

            actionVerbCount,

            jobTitle:
                jobTitle.value.trim(),

            analyzedAt:
                new Date().toISOString()

        };

    }


    /* ==============================
       IMPORTANT WORD EXTRACTION
    ============================== */

    function extractImportantWords(
        text
    ) {

        if (!text) return [];


        const words =
            text
                .replace(
                    /[^a-z0-9+#.]/g,
                    " "
                )
                .split(/\s+/)
                .filter(
                    word =>
                        word.length >= 3 &&
                        !STOP_WORDS.includes(word)
                );


        const frequency = {};


        words.forEach(word => {

            frequency[word] =
                (frequency[word] || 0) + 1;

        });


        return Object.entries(frequency)

            .sort(
                (a, b) =>
                    b[1] - a[1]
            )

            .slice(0, 15)

            .map(
                ([word]) => word
            );

    }

});
