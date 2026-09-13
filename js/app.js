document.addEventListener("DOMContentLoaded", () => {

    const savedTheme =
        localStorage.getItem("resumeTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    const themeToggle =
        document.getElementById("themeToggle");


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const dark =
                    document.body.classList.toggle("dark");


                localStorage.setItem(
                    "resumeTheme",
                    dark ? "dark" : "light"
                );

            }
        );

    }


    document.querySelectorAll(
        ".feature-card, .recommendation-card"
    ).forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "translateY(-5px)";

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "translateY(0)";

            }
        );

    });

});
