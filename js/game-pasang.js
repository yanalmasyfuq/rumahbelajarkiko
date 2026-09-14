/* =========================================================
   GAME 4 — PASANG HURUF
========================================================= */


/*
 * ================================================
 * DATA GAME
 * ================================================
 */

const MATCHING_LEVELS = [

    { word: "APEL", emoji: "🍎" },
    { word: "BOLA", emoji: "⚽" },
    { word: "BUKU", emoji: "📚" },
    { word: "BEBEK", emoji: "🦆" },
    { word: "TOPI", emoji: "🧢" },
    { word: "KUCING", emoji: "🐱" },
    { word: "MOBIL", emoji: "🚗" },
    { word: "IKAN", emoji: "🐟" },
    { word: "NANAS", emoji: "🍍" },
    { word: "GAJAH", emoji: "🐘" },
    { word: "AYAM", emoji: "🐔" },
    { word: "SAPI", emoji: "🐄" },
    { word: "KUDA", emoji: "🐴" },
    { word: "PISANG", emoji: "🍌" },
    { word: "JAGUNG", emoji: "🌽" },
    { word: "LEBAH", emoji: "🐝" },
    { word: "ULAR", emoji: "🐍" },
    { word: "RUMAH", emoji: "🏠" },
    { word: "BINTANG", emoji: "⭐" },
    { word: "BUNGA", emoji: "🌸" },
    { word: "DAUN", emoji: "🍃" },
    { word: "AWAN", emoji: "☁️" },
    { word: "PAYUNG", emoji: "☂️" },
    { word: "SEPATU", emoji: "👟" },
    { word: "MATAHARI", emoji: "☀️" }

];



/*
 * ================================================
 * GAME OBJECT
 * ================================================
 */

const MatchingGame = {


    currentIndex: 0,

    currentLevel: null,

    selectedLetter: null,

    selectedCard: null,

    placedLetters: [],

    completedWords: 0,



    elements: {},



    /* ================================================
       INIT
    ================================================= */

    init() {

        this.cacheElements();

        this.bindEvents();

        this.renderStats();

        this.loadLevel();
        this.setupAudioExperience();   // ← ganti dari setupAudioUnlock()

    },



    /* ================================================
       CACHE ELEMENTS
    ================================================= */

    cacheElements() {

        this.elements = {

            levelNumber:
                document.getElementById(
                    "levelNumber"
                ),

            progressFill:
                document.getElementById(
                    "progressFill"
                ),

            objectEmoji:
                document.getElementById(
                    "objectEmoji"
                ),

            answerSlots:
                document.getElementById(
                    "answerSlots"
                ),

            letterBank:
                document.getElementById(
                    "letterBank"
                ),

            listenWordButton:
                document.getElementById(
                    "listenWordButton"
                ),

            feedback:
                document.getElementById(
                    "matchingFeedback"
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

            repeatGameButton:
                document.getElementById(
                    "repeatGameButton"
                ),

            homeButton:
                document.getElementById(
                    "homeButton"
                ),

            finalWords:
                document.getElementById(
                    "finalWords"
                )

        };

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
                "petualanganHurufIntroPlayed_pasang"
            ) === "true";

        if (introAlreadyPlayed) {

            sessionStorage.removeItem(
                "petualanganHurufIntroPlayed_pasang"
            );

            setTimeout(() => {

                AudioEngine.playGameVoice(
                    "game4_instruction"
                );

            }, 300);

        } else {

            setTimeout(() => {

                AudioEngine.playGameVoice(
                    "game4_intro",
                    () => {

                        AudioEngine.playGameVoice(
                            "game4_instruction"
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

    /* ================================================
       EVENTS
    ================================================= */

    bindEvents() {


        this.elements.listenWordButton
            .addEventListener(
                "click",
                () => {

                    this.playWord();

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



    /* ================================================
       LOAD LEVEL
    ================================================= */

    loadLevel() {

        this.currentLevel =
            MATCHING_LEVELS[
                this.currentIndex
            ];


        this.placedLetters = [];


        this.selectedLetter = null;


        this.selectedCard = null;



        /*
         * Progress utama
         */

        this.elements.levelNumber
            .textContent =
            this.currentIndex + 1;


        const progress =
            (
                (this.currentIndex + 1)
                /
                MATCHING_LEVELS.length
            ) * 100;


        this.elements.progressFill
            .style.width =
            `${progress}%`;



        /*
         * Objek
         */

        this.elements.objectEmoji
            .textContent =
            this.currentLevel.emoji;



        /*
         * Render slot
         */

        this.renderAnswerSlots();



        /*
         * Render huruf
         */

        this.renderLetterBank();



        /*
         * Feedback
         */

        this.hideFeedback();



        this.elements.guideTitle
            .textContent =
            "Ayo pasang huruf! 🧩";


        this.elements.guideText
            .textContent =
            "Susun huruf menjadi nama benda.";

    },



    /* ================================================
       ANSWER SLOTS
    ================================================= */

    renderAnswerSlots() {

        const container =
            this.elements.answerSlots;


        container.innerHTML = "";



        for (
            let i = 0;
            i < this.currentLevel.word.length;
            i++
        ) {

            const slot =
                document.createElement(
                    "div"
                );


            slot.className =
                "answer-slot";


            slot.dataset.index =
                i;


            slot.textContent =
                "?";



            /*
             * Drag over
             */

            slot.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();


                    if (
                        !this.placedLetters[i]
                    ) {

                        slot.classList.add(
                            "drag-over"
                        );

                    }

                }
            );



            slot.addEventListener(
                "dragleave",
                () => {

                    slot.classList.remove(
                        "drag-over"
                    );

                }
            );



            /*
             * Drop
             */

            slot.addEventListener(
                "drop",
                event => {

                    event.preventDefault();


                    slot.classList.remove(
                        "drag-over"
                    );


                    const letter =
                        event.dataTransfer
                            .getData(
                                "text/plain"
                            );


                    const cardId =
                        event.dataTransfer
                            .getData(
                                "card-id"
                            );


                    this.placeLetter(
                        letter,
                        i,
                        cardId
                    );

                }
            );



            /*
             * Tap target
             */

            slot.addEventListener(
                "click",
                () => {

                    if (
                        this.selectedLetter
                    ) {

                        this.placeLetter(
                            this.selectedLetter,
                            i,
                            this.selectedCard
                        );

                    }

                }
            );


            container.appendChild(
                slot
            );

        }

    },



    /* ================================================
       LETTER BANK
    ================================================= */

    renderLetterBank() {

        const container =
            this.elements.letterBank;


        container.innerHTML = "";



        /*
         * Huruf yang benar
         */

        const correctLetters =
            this.currentLevel.word
                .split("");



        /*
         * Tambahkan huruf
         * pengganggu.
         */

        const extraLetters = [

            "A",
            "B",
            "C",
            "D",
            "E",
            "I",
            "O",
            "U",
            "M",
            "N"

        ];



        let letters = [
            ...correctLetters
        ];



        /*
         * Tambahkan maksimal
         * dua huruf pengganggu.
         */

        for (
            const extra of extraLetters
        ) {

            if (
                letters.length >=
                correctLetters.length + 2
            ) {

                break;

            }


            if (
                !letters.includes(extra)
            ) {

                letters.push(extra);

            }

        }



        /*
         * Acak
         */

        letters =
            this.shuffle(
                letters
            );



        letters.forEach(
    (letter, index) => {

        const card = document.createElement("button");

        card.type = "button";
        card.className = "letter-card";
        card.draggable = true;

        const img = document.createElement("img");
        img.src = `../assets/huruf/huruf_kotak/${letter}.webp`;
        img.alt = letter;
        img.className = "letter-card-img";

        card.appendChild(img);

        const cardId = `letter-${index}`;
        card.dataset.cardId = cardId;



                /*
                 * DRAG
                 */

                card.addEventListener(
                    "dragstart",
                    event => {

                        event.dataTransfer
                            .setData(
                                "text/plain",
                                letter
                            );


                        event.dataTransfer
                            .setData(
                                "card-id",
                                cardId
                            );

                    }
                );



                /*
                 * TOUCH / TAP
                 */

                card.addEventListener(
                    "click",
                    () => {

                        this.selectLetter(
                            letter,
                            card
                        );

                    }
                );



                container.appendChild(
                    card
                );

            }
        );

    },



    /* ================================================
       SELECT LETTER
    ================================================= */

   selectLetter(letter, card) {

    /*
     * Hentikan dulu suara narasi/instruksi
     * yang masih berjalan, supaya tidak tabrakan
     * dengan efek suara benar/salah.
     */

    AudioEngine.stopVoice();

    if (card.classList.contains("used")) {
        return;
    }

    /*
     * Cari slot kosong pertama,
     * lalu langsung taruh hurufnya di sana
     * (otomatis "naik", tanpa drag atau klik kolom).
     */

    const wordLength = this.currentLevel.word.length;
    let targetIndex = -1;

    for (let i = 0; i < wordLength; i++) {
        if (!this.placedLetters[i]) {
            targetIndex = i;
            break;
        }
    }

    if (targetIndex === -1) {
        return;
    }

    this.placeLetter(letter, targetIndex, card);

},



    /* ================================================
       PLACE LETTER
    ================================================= */

    placeLetter(
        letter,
        slotIndex,
        cardReference
    ) {

        /*
         * Slot sudah terisi?
         */

        if (
            this.placedLetters[
                slotIndex
            ]
        ) {

            return;

        }



        const expectedLetter =
            this.currentLevel.word[
                slotIndex
            ];



        /*
         * BENAR
         */

        if (
            letter ===
            expectedLetter
        ) {

            this.placedLetters[
                slotIndex
            ] =
            letter;



            this.fillSlot(
                slotIndex,
                letter
            );


            this.markCardUsed(
                cardReference
            );



            /*
             * Clear selection
             */

            this.clearSelection();



            /*
             * Audio
             */

            AudioEngine.play(
                "correct"
            );



            /*
             * Progress reward kecil
             */

            this.elements.guideTitle
                .textContent =
                "Benar! 🌟";


            this.elements.guideText
                .textContent =
                "Hebat! Cari huruf berikutnya.";



            /*
             * Cek selesai
             */

            this.checkWordComplete();

        }

        /*
         * SALAH
         */

        else {

            this.showWrongFeedback();

            AudioEngine.play(
                "wrong"
            );

        }

    },



    /* ================================================
       FILL SLOT
    ================================================= */

    fillSlot(index, letter) {

    const slot = this.elements.answerSlots.children[index];

    if (!slot) {
        return;
    }

    slot.innerHTML = "";

    const img = document.createElement("img");
    img.src = `../assets/huruf/huruf_kotak/${letter}.webp`;
    img.alt = letter;
    img.className = "slot-letter-img";

    slot.appendChild(img);

    slot.classList.add("filled");

    setTimeout(() => {
        slot.classList.remove("filled");
    }, 300);

},



    /* ================================================
       MARK CARD USED
    ================================================= */

    markCardUsed(
        cardReference
    ) {

        /*
         * Jika card reference
         * adalah DOM element
         */

        if (
            cardReference &&
            typeof cardReference ===
            "object"
        ) {

            cardReference
                .classList
                .add(
                    "used"
                );

            return;

        }



        /*
         * Jika dari drag,
         * cari berdasarkan ID.
         */

        if (
            typeof cardReference ===
            "string"
        ) {

            const card =
                document.querySelector(
                    `[data-card-id="${cardReference}"]`
                );


            if (
                card
            ) {

                card.classList.add(
                    "used"
                );

            }

        }

    },



    /* ================================================
       CLEAR SELECTION
    ================================================= */

    clearSelection() {

        document
            .querySelectorAll(
                ".letter-card.selected"
            )
            .forEach(
                card => {

                    card.classList.remove(
                        "selected"
                    );

                }
            );


        this.selectedLetter =
            null;


        this.selectedCard =
            null;

    },



    /* ================================================
       CHECK WORD
    ================================================= */

    checkWordComplete() {

        const complete =
            this.placedLetters.length ===
            this.currentLevel.word.length
            &&
            this.placedLetters.every(
                (
                    letter,
                    index
                ) => {

                    return (
                        letter ===
                        this.currentLevel.word[
                            index
                        ]
                    );

                }
            );


        if (
            !complete
        ) {

            return;

        }



        /*
         * Kata selesai
         */

        this.completedWords++;



        this.showCorrectFeedback();



        /*
         * Reward 1 bintang
         */

        ProgressEngine.addStar(
            1
        );


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();



        /*
         * Baca kata
         */

        setTimeout(
            () => {

                this.playWord();

            },
            350
        );



        /*
         * Lanjut level
         */

        setTimeout(
            () => {

                this.nextLevel();

            },
            1600
        );

    },



    /* ================================================
       NEXT LEVEL
    ================================================= */

    nextLevel() {

        this.currentIndex++;


        if (
            this.currentIndex >=
            MATCHING_LEVELS.length
        ) {

            this.completeGame();

            return;

        }


        this.loadLevel();

    },



    /* ================================================
       CORRECT FEEDBACK
    ================================================= */

    showCorrectFeedback() {

        this.elements.feedback
            .classList.add(
                "show"
            );


        this.elements.feedbackIcon
            .textContent =
            "🎉";


        this.elements.feedbackTitle
            .textContent =
            "Hebat sekali!";


        this.elements.feedbackText
            .textContent =
            `Kamu berhasil menyusun ${this.currentLevel.word}!`;

    },



    /* ================================================
       WRONG FEEDBACK
    ================================================= */

    showWrongFeedback() {

        this.elements.feedback
            .classList.add(
                "show"
            );


        this.elements.feedbackIcon
            .textContent =
            "😊";


        this.elements.feedbackTitle
            .textContent =
            "Coba lagi!";


        this.elements.feedbackText
            .textContent =
            "Cari huruf yang sesuai dengan kotaknya.";



        setTimeout(
            () => {

                this.hideFeedback();

            },
            1200
        );

    },



    /* ================================================
       HIDE FEEDBACK
    ================================================= */

    hideFeedback() {

        this.elements.feedback
            .classList.remove(
                "show"
            );

    },



    /* ================================================
   PLAY WORD
================================================= */

playWord() {

     /*
     * Hentikan dulu suara narasi/instruksi
     * yang masih berjalan, supaya tidak tabrakan.
     */

    AudioEngine.stopVoice();

    const fileName =
        this.currentLevel.word.toLowerCase() + ".mp3";

    const audio =
        new Audio(`../assets/audio/word/${fileName}`);

    audio.play().catch(() => {

        /*
         * Fallback kalau file gagal dimuat/diputar
         * (misal nama file tidak cocok atau browser
         * memblokir autoplay).
         */

        if ("speechSynthesis" in window) {

            const utterance =
                new SpeechSynthesisUtterance(
                    this.currentLevel.word
                );

            utterance.lang = "id-ID";
            utterance.rate = 0.75;
            utterance.pitch = 1.2;

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);

        }

    });

},


    /* ================================================
       COMPLETE GAME
    ================================================= */

    completeGame() {

        ProgressEngine.gameCompleted(
            "pasang"
        );



        /*
         * Bonus hanya satu kali
         */

        const rewardKey =
            "petualanganHurufPasangReward";


        if (
            localStorage.getItem(
                rewardKey
            ) !== "true"
        ) {

            ProgressEngine.addStar(
                5
            );


            localStorage.setItem(
                rewardKey,
                "true"
            );

        }



        this.elements.finalWords
            .textContent =
            MATCHING_LEVELS.length;


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



    /* ================================================
       RESTART
    ================================================= */

    restart() {

        this.elements.completionModal
            .classList.remove(
                "show"
            );


        this.currentIndex =
            0;


        this.completedWords =
            0;


        this.loadLevel();

    },



    /* ================================================
       HOME
    ================================================= */

    goHome() {

        AudioEngine.play(
            "click"
        );


        window.location.href =
            "../index.html";

    },



    /* ================================================
       STATS
    ================================================= */

    renderStats() {

        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();

    },



    /* ================================================
       SHUFFLE
    ================================================= */

    shuffle(array) {

        const result =
            [...array];


        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random()
                    *
                    (i + 1)
                );


            [
                result[i],
                result[j]
            ] =
            [
                result[j],
                result[i]
            ];

        }


        return result;

    }

};



/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        MatchingGame.init();

    }
);