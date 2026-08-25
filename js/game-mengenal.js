/* =========================================================
   GAME 1 — MENGENAL HURUF A-Z
========================================================= */


const LETTERS = [

    {
        letter: "A",
        object: "Apel",
        emoji: "🍎",
        sentence: "A untuk Apel"
    },

    {
        letter: "B",
        object: "Bola",
        emoji: "⚽",
        sentence: "B untuk Bola"
    },

    {
        letter: "C",
        object: "Ceri",
        emoji: "🍒",
        sentence: "C untuk Ceri"
    },

    {
        letter: "D",
        object: "Domba",
        emoji: "🐑",
        sentence: "D untuk Domba"
    },

    {
        letter: "E",
        object: "Elang",
        emoji: "🦅",
        sentence: "E untuk Elang"
    },

    {
        letter: "F",
        object: "Foto",
        emoji: "📷",
        sentence: "F untuk Foto"
    },

    {
        letter: "G",
        object: "Gajah",
        emoji: "🐘",
        sentence: "G untuk Gajah"
    },

    {
        letter: "H",
        object: "Harimau",
        emoji: "🐯",
        sentence: "H untuk Harimau"
    },

    {
        letter: "I",
        object: "Ikan",
        emoji: "🐟",
        sentence: "I untuk Ikan"
    },

    {
        letter: "J",
        object: "Jeruk",
        emoji: "🍊",
        sentence: "J untuk Jeruk"
    },

    {
        letter: "K",
        object: "Kucing",
        emoji: "🐱",
        sentence: "K untuk Kucing"
    },

    {
        letter: "L",
        object: "Lemon",
        emoji: "🍋",
        sentence: "L untuk Lemon"
    },

    {
        letter: "M",
        object: "Mangga",
        emoji: "🥭",
        sentence: "M untuk Mangga"
    },

    {
        letter: "N",
        object: "Nanas",
        emoji: "🍍",
        sentence: "N untuk Nanas"
    },

    {
        letter: "O",
        object: "Obor",
        emoji: "🔦",
        sentence: "O untuk Obor"
    },

    {
        letter: "P",
        object: "Pensil",
        emoji: "✏️",
        sentence: "P untuk Pensil"
    },

    {
        letter: "Q",
        object: "Queen",
        emoji: "👑",
        sentence: "Q untuk Queen"
    },

    {
        letter: "R",
        object: "Rusa",
        emoji: "🦌",
        sentence: "R untuk Rusa"
    },

    {
        letter: "S",
        object: "Sapi",
        emoji: "🐄",
        sentence: "S untuk Sapi"
    },

    {
        letter: "T",
        object: "Topi",
        emoji: "🧢",
        sentence: "T untuk Topi"
    },

    {
        letter: "U",
        object: "Ular",
        emoji: "🐍",
        sentence: "U untuk Ular"
    },

    {
        letter: "V",
        object: "Vas",
        emoji: "🏺",
        sentence: "V untuk Vas"
    },

    {
        letter: "W",
        object: "Wortel",
        emoji: "🥕",
        sentence: "W untuk Wortel"
    },

    {
        letter: "X",
        object: "Xilofon",
        emoji: "🎵",
        sentence: "X untuk Xilofon"
    },

    {
        letter: "Y",
        object: "Yo-yo",
        emoji: "🪀",
        sentence: "Y untuk Yo-yo"
    },

    {
        letter: "Z",
        object: "Zebra",
        emoji: "🦓",
        sentence: "Z untuk Zebra"
    }

];



const MengenalGame = {

    currentIndex: 0,

    elements: {},


    /* =====================================================
       INIT
    ===================================================== */

    init() {

    this.cacheElements();

    this.buildAlphabetDots();

    this.loadProgressState();

    this.render();

    this.bindEvents();

    this.setupAudioExperience();

},


    /* =====================================================
       ELEMENTS
    ===================================================== */

    cacheElements() {

        this.elements = {

            letterNumber:
                document.getElementById(
                    "letterNumber"
                ),

            progressFill:
                document.getElementById(
                    "progressFill"
                ),

            alphabetDots:
                document.getElementById(
                    "alphabetDots"
                ),

            capitalLetter:
                document.getElementById(
                    "capitalLetter"
                ),

            lowerLetter:
                document.getElementById(
                    "lowerLetter"
                ),

            letterWord:
                document.getElementById(
                    "letterWord"
                ),

            objectVisual:
                document.getElementById(
                    "objectVisual"
                ),

            objectName:
                document.getElementById(
                    "objectName"
                ),

            objectSentence:
                document.getElementById(
                    "objectSentence"
                ),

            soundButton:
                document.getElementById(
                    "soundButton"
                ),

            repeatButton:
                document.getElementById(
                    "repeatButton"
                ),

            prevButton:
                document.getElementById(
                    "prevButton"
                ),

            nextButton:
                document.getElementById(
                    "nextButton"
                ),

            nextLabel:
                document.getElementById(
                    "nextLabel"
                ),

            guideTitle:
                document.getElementById(
                    "guideTitle"
                ),

            guideText:
                document.getElementById(
                    "guideText"
                ),

            letterCard:
                document.getElementById(
                    "letterCard"
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
                )

        };

    },


    /* =====================================================
       EVENTS
    ===================================================== */

    bindEvents() {


        this.elements.soundButton
            .addEventListener(
                "click",
                () => {

                    this.speakCurrentLetter();

                }
            );


        this.elements.repeatButton
            .addEventListener(
                "click",
                () => {

                    this.speakCurrentLetter();

                }
            );


        this.elements.prevButton
            .addEventListener(
                "click",
                () => {

                    this.previous();

                }
            );


        this.elements.nextButton
            .addEventListener(
                "click",
                () => {

                    this.next();

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

            this.elements.objectVisual
            .addEventListener(
        "click",
        () => {

            AudioEngine.play("click");

            AudioEngine.playLetter(
                LETTERS[
                    this.currentIndex
                ].letter
            );

        }
    );

    },


    /* =====================================================
       DOTS
    ===================================================== */

    buildAlphabetDots() {

        const container =
            this.elements.alphabetDots;

        container.innerHTML = "";


        LETTERS.forEach(
            (item,index) => {

                const dot =
                    document.createElement(
                        "div"
                    );

                dot.className =
                    "alphabet-dot";

                dot.dataset.index =
                    index;

                container.appendChild(
                    dot
                );

            }
        );

    },


    /* =====================================================
       LOAD
    ===================================================== */

    loadProgressState() {

        const saved =
            localStorage.getItem(
                "petualanganHurufMengenalIndex"
            );


        if (saved !== null) {

            const parsed =
                Number.parseInt(
                    saved,
                    10
                );


            if (
                Number.isInteger(parsed) &&
                parsed >= 0 &&
                parsed < LETTERS.length
            ) {

                this.currentIndex =
                    parsed;

            }

        }

    },


    /* =====================================================
       SAVE
    ===================================================== */

    saveCurrentIndex() {

        localStorage.setItem(
            "petualanganHurufMengenalIndex",
            String(this.currentIndex)
        );

    },


    /* =====================================================
       RENDER
    ===================================================== */

    render() {

        const item =
            LETTERS[this.currentIndex];


        const number =
            this.currentIndex + 1;


        const percent =
            (
                number /
                LETTERS.length
            ) * 100;


        this.elements.letterNumber
            .textContent =
            number;


        this.elements.progressFill
            .style.width =
            `${percent}%`;


        this.elements.capitalLetter
            .textContent =
            item.letter;


        this.elements.lowerLetter
            .textContent =
            item.letter.toLowerCase();


        this.elements.letterWord
            .textContent =
            `${item.letter} — ${item.letter.toLowerCase()}`;


        this.elements.objectVisual
            .textContent =
            item.emoji;


        this.elements.objectName
            .textContent =
            item.object;


        this.elements.objectSentence
            .textContent =
            item.sentence;


        this.elements.guideTitle
            .textContent =
            `Ini huruf ${item.letter}!`;


        this.elements.guideText
            .textContent =
            `Ayo lihat huruf besar dan huruf kecilnya.`;


        this.elements.prevButton.disabled =
            this.currentIndex === 0;


        const isLast =
            this.currentIndex ===
            LETTERS.length - 1;


        this.elements.nextLabel
            .textContent =
            isLast
                ? "Selesai"
                : "Berikutnya";


        this.updateDots();


        this.animateCard();


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();

    },


    /* =====================================================
       DOT STATUS
    ===================================================== */

    updateDots() {

        const dots =
            this.elements.alphabetDots
                .querySelectorAll(
                    ".alphabet-dot"
                );


        dots.forEach(
            (dot,index) => {

                dot.classList.toggle(
                    "active",
                    index ===
                    this.currentIndex
                );


                dot.classList.toggle(
                    "done",
                    index <
                    this.currentIndex
                );

            }
        );

    },


    /* =====================================================
       CARD ANIMATION
    ===================================================== */

    animateCard() {

        const card =
            this.elements.letterCard;


        card.style.animation =
            "none";


        void card.offsetWidth;


        card.style.animation =
            "cardIn .45s ease both";

    },

    /* =====================================================
   AUDIO EXPERIENCE
===================================================== */

setupAudioExperience() {

    let audioStarted = false;

    const startExperience = () => {

        if (audioStarted) {
            return;
        }

        audioStarted = true;

        /*
         * Mulai BGM
         */

        AudioEngine.startMusic();


        /*
         * Putar intro Game 1
         */

        // setTimeout(() => {

        //     AudioEngine.playGameVoice(
        //         "game1_intro"
        //     );

        // }, 300);


        /*
         * Hapus listener setelah
         * audio berhasil dicoba
         */

        document.removeEventListener(
            "pointerdown",
            startExperience
        );

    };


    /*
     * Browser biasanya mengizinkan audio
     * setelah user melakukan interaksi.
     */

    document.addEventListener(
        "pointerdown",
        startExperience
    );

},


    /* =====================================================
       SOUND
    ===================================================== */

    speakCurrentLetter() {

    const item =
        LETTERS[this.currentIndex];


    /*
     * Efek klik
     */

    AudioEngine.play("click");


    /*
     * Suara huruf
     */

    AudioEngine.playLetter(
        item.letter
    );


    /*
     * Animasi tombol speaker
     */

    this.elements.soundButton
        .classList.add("playing");


    setTimeout(() => {

        this.elements.soundButton
            .classList.remove("playing");

    }, 1000);

},


    /* =====================================================
       PREVIOUS
    ===================================================== */

    previous() {

        if (
            this.currentIndex <= 0
        ) {

            return;

        }


        AudioEngine.play(
            "click"
        );


        this.currentIndex--;


        this.saveCurrentIndex();


        this.render();

    },


    /* =====================================================
       NEXT
    ===================================================== */

    next() {

        AudioEngine.play(
            "click"
        );


        if (
            this.currentIndex <
            LETTERS.length - 1
        ) {

            this.currentIndex++;


            this.saveCurrentIndex();


            this.render();


            return;

        }


        this.complete();

    },


    /* =====================================================
       COMPLETE
    ===================================================== */

   complete() {

    const alreadyCompleted =
        localStorage.getItem(
            "petualanganHurufMengenalCompleted"
        ) === "true";


    /*
     * Reward hanya diberikan sekali
     */

    if (!alreadyCompleted) {

        ProgressEngine.addStar(3);


        localStorage.setItem(
            "petualanganHurufMengenalCompleted",
            "true"
        );


        /*
         * Efek reward
         */

        AudioEngine.play("reward");


        /*
         * Efek bintang
         */

        setTimeout(() => {

            AudioEngine.play("star");

        }, 250);

    }


    /*
     * Tandai game selesai
     */

    ProgressEngine.gameCompleted(
        "mengenal"
    );


    /*
     * Complete sound
     */

    setTimeout(() => {

        AudioEngine.play("complete");

    }, 500);


    /*
     * Update jumlah bintang
     */

    this.elements.starCount
        .textContent =
        ProgressEngine.getStars();


    /*
     * Tampilkan hasil
     */

    this.showCompletion();


    /*
     * Suara Kiko
     */

    setTimeout(() => {

        AudioEngine.playKiko(
            "amazing"
        );

    }, 800);

},


    /* =====================================================
       COMPLETION MODAL
    ===================================================== */

    showCompletion() {

        this.elements.completionModal
            .classList.add(
                "show"
            );


        this.elements.completionModal
            .setAttribute(
                "aria-hidden",
                "false"
            );

    },


    hideCompletion() {

        this.elements.completionModal
            .classList.remove(
                "show"
            );


        this.elements.completionModal
            .setAttribute(
                "aria-hidden",
                "true"
            );

    },


    /* =====================================================
       RESTART
    ===================================================== */

    restart() {

        AudioEngine.play(
            "click"
        );


        this.hideCompletion();


        this.currentIndex = 0;


        this.saveCurrentIndex();


        this.render();

    },


    /* =====================================================
       HOME
    ===================================================== */

       goHome() {

        AudioEngine.play(
            "click"
        );


        /*
         * Tandai splash sudah pernah
         * dilihat, supaya index.html
         * tidak menampilkannya lagi.
         */

        sessionStorage.setItem(
            "petualanganHurufSplashSeen",
            "true"
        );


        window.location.href =
            "../index.html";

    }

};



/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        MengenalGame.init();

    }
);