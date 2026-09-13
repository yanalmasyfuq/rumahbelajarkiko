/* =========================================================
   PETUALANGAN HURUF
   PROGRESS ENGINE
========================================================= */

const ProgressEngine = {

    data: {

        stars: 0,

        totalCorrect: 0,

        totalWrong: 0,

        gamesPlayed: 0,

        completedGames: {

            mengenal: 0,
            tebak: 0,
            menulis: 0,
            pasang: 0

        }

    },


    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.load();

        this.updateUI();

    },


    /* =====================================================
       ADD STAR
    ===================================================== */

    addStar(amount = 1) {

        this.data.stars += amount;

        this.save();

        this.updateUI();

        this.animateStars();

    },


    /* =====================================================
       REMOVE STAR
    ===================================================== */

    removeStar(amount = 1) {

        this.data.stars =
            Math.max(
                0,
                this.data.stars - amount
            );


        this.save();

        this.updateUI();

    },


    /* =====================================================
       CORRECT ANSWER
    ===================================================== */

    correct() {

        this.data.totalCorrect++;

        this.addStar(1);

        this.save();

    },


    /* =====================================================
       WRONG ANSWER
    ===================================================== */

    wrong() {

        this.data.totalWrong++;

        this.save();

    },


    /* =====================================================
       GAME STARTED
    ===================================================== */

    gameStarted() {

        this.data.gamesPlayed++;

        this.save();

    },


    /* =====================================================
       GAME COMPLETED
    ===================================================== */

    gameCompleted(gameName) {

        if (
            this.data.completedGames[
                gameName
            ] !== undefined
        ) {

            this.data.completedGames[
                gameName
            ]++;

        }


        this.save();

    },


    /* =====================================================
       GET STARS
    ===================================================== */

    getStars() {

        return this.data.stars;

    },


    /* =====================================================
       GET CORRECT
    ===================================================== */

    getCorrect() {

        return this.data.totalCorrect;

    },


    /* =====================================================
       GET WRONG
    ===================================================== */

    getWrong() {

        return this.data.totalWrong;

    },


    /* =====================================================
       GET GAME COMPLETION
    ===================================================== */

    getGameCompletion(gameName) {

        return (
            this.data.completedGames[
                gameName
            ] || 0
        );

    },


    /* =====================================================
       UPDATE UI
    ===================================================== */

    updateUI() {

        const starCount =
            document.getElementById(
                "starCount"
            );


        if (starCount) {

            starCount.textContent =
                this.data.stars;

        }


        const stars =
            document.querySelectorAll(
                "[data-player-stars]"
            );


        stars.forEach(element => {

            element.textContent =
                this.data.stars;

        });

    },


    /* =====================================================
       STAR ANIMATION
    ===================================================== */

    animateStars() {

        const starBadge =
            document.querySelector(
                ".game-badge"
            );


        if (!starBadge) {
            return;
        }


        starBadge.animate(

            [

                {
                    transform:
                        "scale(1)"
                },

                {
                    transform:
                        "scale(1.18)"
                },

                {
                    transform:
                        "scale(1)"
                }

            ],

            {

                duration: 400,

                easing:
                    "ease-out"

            }

        );

    },


    /* =====================================================
       RESET
    ===================================================== */

    reset() {

        this.data = {

            stars: 0,

            totalCorrect: 0,

            totalWrong: 0,

            gamesPlayed: 0,

            completedGames: {

                mengenal: 0,
                tebak: 0,
                menulis: 0,
                pasang: 0

            }

        };


        this.save();

        this.updateUI();

    },


    /* =====================================================
       SAVE
    ===================================================== */

    save() {

        localStorage.setItem(

            "petualanganHurufProgress",

            JSON.stringify(
                this.data
            )

        );

    },


    /* =====================================================
       LOAD
    ===================================================== */

    load() {

        const saved =
            localStorage.getItem(
                "petualanganHurufProgress"
            );


        if (!saved) {
            return;
        }


        try {

            this.data =
                JSON.parse(saved);

        } catch (error) {

            console.warn(
                "Progress tidak dapat dibaca."
            );

        }

    }

};


/* =========================================================
   INITIALIZE
========================================================= */

ProgressEngine.init();