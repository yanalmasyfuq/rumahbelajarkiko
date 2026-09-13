/* =========================================================
   GAME 2 — TEBAK HURUF
========================================================= */


const GUESS_LETTERS = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
];


const TOTAL_QUESTIONS = 10;


const TebakGame = {

    question: 0,

    currentAnswer: null,

    choices: [],

    correct: 0,

    answered: false,

    elements: {},


    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.cacheElements();

        this.bindEvents();

        this.renderStats();

        this.startGame();
         this.setupAudioExperience();

    },


    /* =====================================================
       ELEMENTS
    ===================================================== */

    cacheElements() {

        this.elements = {

            questionNumber:
                document.getElementById(
                    "questionNumber"
                ),

            progressFill:
                document.getElementById(
                    "progressFill"
                ),

            answerGrid:
                document.getElementById(
                    "answerGrid"
                ),

            listenButton:
                document.getElementById(
                    "listenButton"
                ),

            soundWave:
                document.getElementById(
                    "soundWave"
                ),

            feedback:
                document.getElementById(
                    "answerFeedback"
                ),

            feedbackIcon:
                document.getElementById(
                    "feedbackIcon"
                ),

            feedbackTitle:
                document.getElementById(
                    "feedbackTitle"
                ),

            feedbackText:
                document.getElementById(
                    "feedbackText"
                ),

            guideTitle:
                document.getElementById(
                    "guideTitle"
                ),

            guideText:
                document.getElementById(
                    "guideText"
                ),

            starCount:
                document.getElementById(
                    "starCount"
                ),

            backButton:
                document.getElementById(
                    "backButton"
                ),

            completionModal:
                document.getElementById(
                    "completionModal"
                ),

            finalCorrect:
                document.getElementById(
                    "finalCorrect"
                ),

            repeatGameButton:
                document.getElementById(
                    "repeatGameButton"
                ),

            homeButton:
                document.getElementById(
                    "homeButton"
                )

        };

    },


    /* =====================================================
       EVENTS
    ===================================================== */

    bindEvents() {

        this.elements.listenButton
            .addEventListener(
                "click",
                () => {

                    this.playQuestionSound();

                }
            );


        this.elements.backButton
            .addEventListener(
                "click",
                () => {

                    this.goHome();

                }
            );


        this.elements.repeatGameButton
            .addEventListener(
                "click",
                () => {

                    this.restart();

                }
            );


        this.elements.homeButton
            .addEventListener(
                "click",
                () => {

                    this.goHome();

                }
            );

    },
/* =====================================================
   AUDIO EXPERIENCE
   BGM + intro + instruksi khusus Game 2 (Tebak Huruf)
===================================================== */

setupAudioExperience() {

    let audioStarted = false;

    const startExperience = () => {

        if (audioStarted) {
            return;
        }

        audioStarted = true;

        AudioEngine.startMusic();

        const introAlreadyPlayed =
            sessionStorage.getItem(
                "petualanganHurufIntroPlayed_tebak"
            ) === "true";

        if (introAlreadyPlayed) {

            sessionStorage.removeItem(
                "petualanganHurufIntroPlayed_tebak"
            );

            setTimeout(() => {

                AudioEngine.playGameVoice(
                    "game2_instruction"
                );

            }, 300);

        } else {

            setTimeout(() => {

                AudioEngine.playGameVoice(
                    "game2_intro",
                    () => {

                        AudioEngine.playGameVoice(
                            "game2_instruction"
                        );

                    }
                );

            }, 300);

        }

        document.removeEventListener(
            "pointerdown",
            startExperience
        );

    };

    document.addEventListener(
        "pointerdown",
        startExperience
    );

},

    /* =====================================================
       START
    ===================================================== */

    startGame() {

        this.question = 0;

        this.correct = 0;

        this.nextQuestion();

    },


    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    nextQuestion() {

        this.answered = false;

        this.hideFeedback();

        this.generateQuestion();

        this.renderQuestion();

    },


    /* =====================================================
       GENERATE
    ===================================================== */

    generateQuestion() {

        /*
         * Pilih huruf secara random
         */

        const randomIndex =
            Math.floor(
                Math.random() *
                GUESS_LETTERS.length
            );


        this.currentAnswer =
            GUESS_LETTERS[randomIndex];


        /*
         * Buat 2 jawaban salah
         */

        const wrongChoices =
            GUESS_LETTERS
                .filter(
                    letter =>
                        letter !==
                        this.currentAnswer
                );


        this.shuffle(
            wrongChoices
        );


        this.choices = [

            this.currentAnswer,

            wrongChoices[0],

            wrongChoices[1]

        ];


        this.shuffle(
            this.choices
        );

    },


    /* =====================================================
       RENDER QUESTION
    ===================================================== */

    renderQuestion() {

        const questionNumber =
            this.question + 1;


        this.elements.questionNumber
            .textContent =
            questionNumber;


        const percent =
            (
                questionNumber /
                TOTAL_QUESTIONS
            ) * 100;


        this.elements.progressFill
            .style.width =
            `${percent}%`;


        this.renderChoices();


        this.elements.guideTitle
            .textContent =
            "Ayo dengarkan! 👂";


        this.elements.guideText
            .textContent =
            "Kiko akan menyebutkan sebuah huruf.";


        this.playQuestionSound(
            true
        );

    },


    /* =====================================================
       RENDER CHOICES
    ===================================================== */

    renderChoices() {

    const container = this.elements.answerGrid;

    container.innerHTML = "";

    this.choices.forEach(
        letter => {

            const button = document.createElement("button");
            button.className = "answer-button";
            button.dataset.letter = letter;

            const balloon = document.createElement("img");
            balloon.src = `../assets/huruf/balon_huruf/${letter.toLowerCase()}.webp`;
            balloon.alt = letter;
            balloon.className = "answer-balloon";

            button.appendChild(balloon);

            button.addEventListener("click", () => {
                this.checkAnswer(letter, button);
            });

            container.appendChild(button);

        }
    );

},


    /* =====================================================
       PLAY QUESTION SOUND
    ===================================================== */

    playQuestionSound(
        automatic = false
    ) {

        /*
         * Jangan autoplay jika browser
         * menolak audio.
         */

        const letter =
            this.currentAnswer;


        this.elements.listenButton
            .classList.add(
                "playing"
            );


        this.elements.soundWave
            .classList.add(
                "active"
            );


        /*
         * AudioEngine mencoba
         * file MP3 terlebih dahulu.
         *
         * Jika belum tersedia,
         * fallback ke browser speech.
         */

        if (
            typeof AudioEngine !==
            "undefined"
        ) {

            AudioEngine.playLetter(
                letter
            );

        } else {

            this.browserSpeak(
                letter
            );

        }


        setTimeout(
            () => {

                this.elements.listenButton
                    .classList.remove(
                        "playing"
                    );

                this.elements.soundWave
                    .classList.remove(
                        "active"
                    );

            },
            900
        );

    },


    /* =====================================================
       FALLBACK SPEECH
    ===================================================== */

    browserSpeak(letter) {

        if (
            !("speechSynthesis" in window)
        ) {

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                letter
            );


        speech.lang =
            "id-ID";


        speech.rate =
            0.65;


        speech.pitch =
            1.15;


        window.speechSynthesis.speak(
            speech
        );

    },


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    checkAnswer(
        selectedLetter,
        selectedButton
    ) {

        if (
            this.answered
        ) {

            return;

        }


        if (
            selectedLetter ===
            this.currentAnswer
        ) {

            this.correctAnswer(
                selectedButton
            );

        } else {

            this.wrongAnswer(
                selectedButton
            );

        }

    },


    /* =====================================================
       CORRECT
    ===================================================== */

    correctAnswer(
        selectedButton
    ) {

        this.answered = true;

        this.correct++;


        selectedButton.classList.add(
            "correct"
        );


        this.disableAnswers();


        /*
         * +1 star
         */

        ProgressEngine.addStar(
            1
        );


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();


        this.showFeedback(
            true
        );


        AudioEngine.play(
            "correct"
        );


        setTimeout(
            () => {

                this.nextStep();

            },
            1200
        );

    },


    /* =====================================================
       WRONG
    ===================================================== */

    wrongAnswer(
        selectedButton
    ) {

        selectedButton.classList.add(
            "wrong"
        );


        AudioEngine.play(
            "wrong"
        );


        this.showFeedback(
            false
        );


        /*
         * Hapus animasi setelah selesai
         */

        setTimeout(
            () => {

                selectedButton.classList.remove(
                    "wrong"
                );

            },
            450
        );

    },


    /* =====================================================
       DISABLE
    ===================================================== */

    disableAnswers() {

        const buttons =
            this.elements.answerGrid
                .querySelectorAll(
                    ".answer-button"
                );


        buttons.forEach(
            button => {

                button.classList.add(
                    "disabled"
                );

            }
        );

    },


    /* =====================================================
       FEEDBACK
    ===================================================== */

    showFeedback(
        correct
    ) {

        this.elements.feedback
            .classList.add(
                "show"
            );


        if (correct) {

            this.elements.feedbackIcon
                .textContent =
                "🎉";


            this.elements.feedbackTitle
                .textContent =
                "Hebat sekali!";


            this.elements.feedbackText
                .textContent =
                `Benar! Itu adalah huruf ${this.currentAnswer}.`;


        } else {

            this.elements.feedbackIcon
                .textContent =
                "💡";


            this.elements.feedbackTitle
                .textContent =
                "Coba lagi!";


            this.elements.feedbackText
                .textContent =
                "Dengarkan sekali lagi dan pilih jawabanmu.";

        }

    },


    hideFeedback() {

        this.elements.feedback
            .classList.remove(
                "show"
            );

    },


    /* =====================================================
       NEXT STEP
    ===================================================== */

    nextStep() {

        this.question++;


        if (
            this.question >=
            TOTAL_QUESTIONS
        ) {

            this.complete();

            return;

        }


        this.nextQuestion();

    },


    /* =====================================================
       COMPLETE
    ===================================================== */

    complete() {

        ProgressEngine.gameCompleted(
            "tebak"
        );


        /*
         * Bonus selesai
         */

        const alreadyRewarded =
            localStorage.getItem(
                "petualanganHurufTebakReward"
            ) === "true";


        if (
            !alreadyRewarded
        ) {

            ProgressEngine.addStar(
                5
            );


            localStorage.setItem(
                "petualanganHurufTebakReward",
                "true"
            );

        }


        this.elements.finalCorrect
            .textContent =
            `${this.correct} / ${TOTAL_QUESTIONS}`;


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();


        AudioEngine.play(
            "reward"
        );


        this.elements.completionModal
            .classList.add(
                "show"
            );

    },


    /* =====================================================
       RESTART
    ===================================================== */

    restart() {

        this.elements.completionModal
            .classList.remove(
                "show"
            );


        AudioEngine.play(
            "click"
        );


        this.startGame();

    },


    /* =====================================================
       HOME
    ===================================================== */

    goHome() {

        AudioEngine.play(
            "click"
        );


        window.location.href =
            "../index.html";

    },


    /* =====================================================
       SHUFFLE
    ===================================================== */

    shuffle(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                array[i],
                array[j]
            ] = [

                array[j],
                array[i]

            ];

        }


        return array;

    },


    /* =====================================================
       STATS
    ===================================================== */

    renderStats() {

        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();

    }

};



/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        TebakGame.init();

    }
);