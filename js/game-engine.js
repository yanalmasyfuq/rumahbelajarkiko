/* =========================================================
   PETUALANGAN HURUF
   GAME ENGINE
   AUDIO INTEGRATED VERSION
========================================================= */

class GameEngine {

    constructor(options = {}) {

        this.gameName =
            options.gameName || "game";

        this.totalQuestions =
            options.totalQuestions || 5;

        this.currentQuestion = 0;

        this.score = 0;

        this.correctAnswers = 0;

        this.wrongAnswers = 0;

        this.starsEarned = 0;

        this.started = false;

        this.finished = false;

        this.answers = [];


        /* =================================================
           CALLBACKS
        ================================================= */

        this.onStart =
            options.onStart || null;

        this.onQuestion =
            options.onQuestion || null;

        this.onCorrect =
            options.onCorrect || null;

        this.onWrong =
            options.onWrong || null;

        this.onFinish =
            options.onFinish || null;


        /* =================================================
           AUDIO SETTINGS
        ================================================= */

        this.playStartSound =
            options.playStartSound !== false;

        this.playCorrectSound =
            options.playCorrectSound !== false;

        this.playWrongSound =
            options.playWrongSound !== false;

        this.playStarSound =
            options.playStarSound !== false;

        this.playCompleteSound =
            options.playCompleteSound !== false;

    }


    /* =====================================================
       START
    ===================================================== */

    start() {

        this.currentQuestion = 0;

        this.score = 0;

        this.correctAnswers = 0;

        this.wrongAnswers = 0;

        this.starsEarned = 0;

        this.started = true;

        this.finished = false;

        this.answers = [];


        /* ---------------------------------------------
           START PROGRESS
        --------------------------------------------- */

        if (
            typeof ProgressEngine !== "undefined"
        ) {

            ProgressEngine.gameStarted();

        }


        /* ---------------------------------------------
           START BACKGROUND MUSIC
        --------------------------------------------- */

        if (
            typeof AudioEngine !== "undefined"
        ) {

            AudioEngine.startMusic();

        }


        /* ---------------------------------------------
           CLICK SOUND
        --------------------------------------------- */

        if (
            this.playStartSound &&
            typeof AudioEngine !== "undefined"
        ) {

            AudioEngine.play("click");

        }


        /* ---------------------------------------------
           CALLBACK
        --------------------------------------------- */

        if (this.onStart) {

            this.onStart(this);

        }


        /* ---------------------------------------------
           FIRST QUESTION
        --------------------------------------------- */

        this.nextQuestion();

    }


    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    nextQuestion() {

        if (!this.started) {
            return;
        }


        /* ---------------------------------------------
           CHECK FINISH
        --------------------------------------------- */

        if (
            this.currentQuestion >=
            this.totalQuestions
        ) {

            this.finish();

            return;

        }


        /* ---------------------------------------------
           INCREMENT QUESTION
        --------------------------------------------- */

        this.currentQuestion++;


        /* ---------------------------------------------
           CALLBACK
        --------------------------------------------- */

        if (this.onQuestion) {

            this.onQuestion(
                this.currentQuestion,
                this.totalQuestions,
                this
            );

        }

    }


    /* =====================================================
       ANSWER
    ===================================================== */

    answer(isCorrect, answerData = null) {

        if (
            !this.started ||
            this.finished
        ) {

            return;

        }


        /* ---------------------------------------------
           SAVE ANSWER
        --------------------------------------------- */

        this.answers.push({

            question:
                this.currentQuestion,

            correct:
                isCorrect,

            data:
                answerData

        });


        /* ---------------------------------------------
           HANDLE RESULT
        --------------------------------------------- */

        if (isCorrect) {

            this.handleCorrect();

        } else {

            this.handleWrong();

        }

    }


    /* =====================================================
       CORRECT ANSWER
    ===================================================== */

    handleCorrect() {

        this.correctAnswers++;

        this.score += 10;

        this.starsEarned++;


        /* ---------------------------------------------
           PROGRESS
        --------------------------------------------- */

        if (
            typeof ProgressEngine !== "undefined"
        ) {

            ProgressEngine.correct();

        }


        /* ---------------------------------------------
           CORRECT SOUND
        --------------------------------------------- */

        if (
            this.playCorrectSound &&
            typeof AudioEngine !== "undefined"
        ) {

            AudioEngine.play("correct");

        }


        /* ---------------------------------------------
           STAR SOUND
        --------------------------------------------- */

        if (
            this.playStarSound &&
            typeof AudioEngine !== "undefined"
        ) {

            /*
             * Beri sedikit jeda supaya correct.mp3
             * tidak bertabrakan dengan star.mp3.
             */

            setTimeout(() => {

                AudioEngine.play("star");

            }, 120);

        }


        /* ---------------------------------------------
           CALLBACK
        --------------------------------------------- */

        if (this.onCorrect) {

            this.onCorrect(
                this.currentQuestion,
                this
            );

        }

    }


    /* =====================================================
       WRONG ANSWER
    ===================================================== */

    handleWrong() {

        this.wrongAnswers++;


        /* ---------------------------------------------
           PROGRESS
        --------------------------------------------- */

        if (
            typeof ProgressEngine !== "undefined"
        ) {

            ProgressEngine.wrong();

        }


        /* ---------------------------------------------
           WRONG SOUND
        --------------------------------------------- */

        if (
            this.playWrongSound &&
            typeof AudioEngine !== "undefined"
        ) {

            AudioEngine.play("wrong");

        }


        /* ---------------------------------------------
           CALLBACK
        --------------------------------------------- */

        if (this.onWrong) {

            this.onWrong(
                this.currentQuestion,
                this
            );

        }

    }


    /* =====================================================
       FINISH
    ===================================================== */

    finish() {

        if (this.finished) {
            return;
        }


        this.finished = true;

        this.started = false;


        /* ---------------------------------------------
           COMPLETE PROGRESS
        --------------------------------------------- */

        if (
            typeof ProgressEngine !== "undefined"
        ) {

            ProgressEngine.gameCompleted(
                this.gameName
            );

        }


        /* ---------------------------------------------
           COMPLETE SOUND
        --------------------------------------------- */

        if (
            this.playCompleteSound &&
            typeof AudioEngine !== "undefined"
        ) {

            AudioEngine.play("complete");

        }


        /* ---------------------------------------------
           RESULT
        --------------------------------------------- */

        const result =
            this.getResult();


        /* ---------------------------------------------
           CALLBACK
        --------------------------------------------- */

        if (this.onFinish) {

            this.onFinish(
                result,
                this
            );

        }

    }


    /* =====================================================
       RESULT
    ===================================================== */

    getResult() {

        const percentage =
            this.totalQuestions > 0

                ? Math.round(
                    (
                        this.correctAnswers /
                        this.totalQuestions
                    ) * 100
                )

                : 0;


        return {

            game:
                this.gameName,

            score:
                this.score,

            total:
                this.totalQuestions,

            correct:
                this.correctAnswers,

            wrong:
                this.wrongAnswers,

            percentage:
                percentage,

            stars:
                this.starsEarned

        };

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    getProgress() {

        return {

            current:
                this.currentQuestion,

            total:
                this.totalQuestions,

            percentage:
                this.totalQuestions > 0

                    ? Math.round(

                        (
                            this.currentQuestion /
                            this.totalQuestions
                        ) * 100

                    )

                    : 0

        };

    }


    /* =====================================================
       IS LAST QUESTION
    ===================================================== */

    isLastQuestion() {

        return (
            this.currentQuestion >=
            this.totalQuestions
        );

    }


    /* =====================================================
       RESTART
    ===================================================== */

    restart() {

        this.start();

    }


    /* =====================================================
       RESET
    ===================================================== */

    reset() {

        this.currentQuestion = 0;

        this.score = 0;

        this.correctAnswers = 0;

        this.wrongAnswers = 0;

        this.starsEarned = 0;

        this.started = false;

        this.finished = false;

        this.answers = [];

    }

}