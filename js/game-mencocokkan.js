/* =========================================================
   GAME — MENCOCOKKAN HURUF (Tarik Garis)
========================================================= */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LETTERS_PER_LEVEL = 3;
const TOTAL_LEVELS = 15;


function buildMatchLevels() {

    /*
     * Acak urutan alfabet sekali di awal,
     * lalu ulangi (looping) sampai cukup
     * untuk mengisi 15 level x 3 huruf.
     */

    const shuffledAlphabet = [...ALPHABET];

    for (let i = shuffledAlphabet.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAlphabet[i], shuffledAlphabet[j]] =
            [shuffledAlphabet[j], shuffledAlphabet[i]];
    }

    const totalSlotsNeeded = TOTAL_LEVELS * LETTERS_PER_LEVEL;
    const pool = [];

    while (pool.length < totalSlotsNeeded) {
        pool.push(...shuffledAlphabet);
    }

    const levels = [];

    for (let i = 0; i < totalSlotsNeeded; i += LETTERS_PER_LEVEL) {
        levels.push(pool.slice(i, i + LETTERS_PER_LEVEL));
    }

    return levels;

}


const MATCH_LEVELS = buildMatchLevels();

const LineMatchGame = {

    currentIndex: 0,
    leftLetters: [],
    rightLetters: [],
    connections: {},
    lineElements: {},
    eraseMode: false,
    dragging: null,
    elements: {},


    init() {
        this.cacheElements();
        this.bindEvents();
        this.renderStats();
        this.loadLevel();
        this.setupAudioExperience();
    },


    cacheElements() {
        this.elements = {
            wrapper: document.getElementById("matchWrapper"),
            svg: document.getElementById("matchSvg"),
            leftColumn: document.getElementById("leftColumn"),
            rightColumn: document.getElementById("rightColumn"),
            levelNumber: document.getElementById("levelNumber"),
            progressFill: document.getElementById("progressFill"),
            guideTitle: document.getElementById("guideTitle"),
            guideText: document.getElementById("guideText"),
            feedback: document.getElementById("matchFeedback"),
            feedbackIcon: document.getElementById("feedbackIcon"),
            feedbackTitle: document.getElementById("feedbackTitle"),
            feedbackText: document.getElementById("feedbackText"),
            starCount: document.getElementById("starCount"),
            backButton: document.getElementById("backButton"),
            eraseButton: document.getElementById("eraseButton"),
            retryButton: document.getElementById("retryButton"),
            completionModal: document.getElementById("completionModal"),
            repeatGameButton: document.getElementById("repeatGameButton"),
            homeButton: document.getElementById("homeButton"),
            finalLevels: document.getElementById("finalLevels")
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
                "petualanganHurufIntroPlayed_mencocokkan"
            ) === "true";

        if (introAlreadyPlayed) {

            sessionStorage.removeItem(
                "petualanganHurufIntroPlayed_mencocokkan"
            );

            setTimeout(() => {

                AudioEngine.playGameVoice(
                    "game3_instruction"
                );

            }, 300);

        } else {

            setTimeout(() => {

                AudioEngine.playGameVoice(
                    "game3_intro",
                    () => {

                        AudioEngine.playGameVoice(
                            "game3_instruction"
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

/* ===================================================== */


    bindEvents() {

        this.elements.backButton.addEventListener("click", () => this.goHome());
        this.elements.repeatGameButton.addEventListener("click", () => this.restart());
        this.elements.homeButton.addEventListener("click", () => this.goHome());

        this.elements.eraseButton.addEventListener("click", () => {
            this.eraseMode = !this.eraseMode;
            this.elements.eraseButton.classList.toggle("active", this.eraseMode);
        });

        this.elements.retryButton.addEventListener("click", () => {
            this.resetConnections();
            this.shuffleRightColumn();
        });

        window.addEventListener("pointermove", event => this.handlePointerMove(event));
        window.addEventListener("pointerup", () => this.handlePointerUp());
        window.addEventListener("resize", () => this.redrawAllLines());

    },


    /* ================================================
       LOAD LEVEL
    ================================================= */
    loadLevel() {

        this.leftLetters = MATCH_LEVELS[this.currentIndex];
        this.rightLetters = this.shuffle(this.leftLetters);

        this.resetConnections();

        this.elements.levelNumber.textContent = this.currentIndex + 1;

        const percent = ((this.currentIndex + 1) / MATCH_LEVELS.length) * 100;
        this.elements.progressFill.style.width = `${percent}%`;

        this.renderColumns();
        this.hideFeedback();

        this.elements.guideTitle.textContent = "Ayo cocokkan! 🔤";
        this.elements.guideText.textContent = "Tarik garis dari huruf besar ke huruf kecil pasangannya.";

    },


    shuffleRightColumn() {
        this.rightLetters = this.shuffle(this.leftLetters);
        this.renderColumns();
    },


    /* ================================================
       RENDER COLUMNS
    ================================================= */
    renderColumns() {

    this.elements.leftColumn.querySelectorAll(".match-item").forEach(el => el.remove());
    this.elements.rightColumn.querySelectorAll(".match-item").forEach(el => el.remove());

    this.leftLetters.forEach(letter => {
        this.elements.leftColumn.appendChild(
            this.createItem(letter, "left")
        );
    });

    this.rightLetters.forEach(letter => {
        this.elements.rightColumn.appendChild(
            this.createItem(letter, "right")
        );
    });

    requestAnimationFrame(() => this.redrawAllLines());

},


    createItem(letterKey, side) {

    const item = document.createElement("div");
    item.className = "match-item";
    item.dataset.letter = letterKey;
    item.dataset.side = side;

    const img = document.createElement("img");
    img.className = "match-letter-img";

    img.src = side === "left"
        ? `../assets/huruf/cute_huruf_besar/${letterKey}.webp`
        : `../assets/huruf/cute_huruf_kecil/${letterKey.toLowerCase()}.webp`;

    img.alt = side === "left" ? letterKey : letterKey.toLowerCase();

    const dot = document.createElement("span");
    dot.className = "match-dot";

    item.appendChild(img);
    item.appendChild(dot);

    dot.addEventListener("pointerdown", event => {
        event.preventDefault();
        this.handleDotDown(letterKey, side, item);
    });

    item.addEventListener("click", () => {
        if (this.eraseMode) {
            this.removeConnectionFor(letterKey, side);
        }
    });

    return item;

},


    /* ================================================
       DRAG HANDLING
    ================================================= */
    handleDotDown(letter, side, itemEl) {

         /*
     * Hentikan dulu suara narasi/instruksi
     * yang masih berjalan, supaya tidak tabrakan
     * dengan efek suara interaksi.
     */

    AudioEngine.stopVoice();

        if (this.eraseMode) {
            this.removeConnectionFor(letter, side);
            return;
        }

         AudioEngine.play("click");   // ← baris baru

        this.removeConnectionFor(letter, side);

        const dot = itemEl.querySelector(".match-dot");
        const point = this.getDotPosition(dot);

        const tempLine = this.createSvgLine(point, point, "temp-line");
        this.elements.svg.appendChild(tempLine);

        this.dragging = { fromSide: side, letter, tempLine, startPoint: point };

    },


    handlePointerMove(event) {

        if (!this.dragging) {
            return;
        }

        const wrapperRect = this.elements.wrapper.getBoundingClientRect();

        const point = {
            x: event.clientX - wrapperRect.left,
            y: event.clientY - wrapperRect.top
        };

        this.updateSvgLine(this.dragging.tempLine, this.dragging.startPoint, point);

    },


    handlePointerUp() {

        if (!this.dragging) {
            return;
        }

        const { fromSide, letter, tempLine } = this.dragging;

        const targetSide = fromSide === "left" ? "right" : "left";
        const targetLetter = this.findNearestItem(targetSide, tempLine);

        tempLine.remove();
        this.dragging = null;

        if (!targetLetter) {
            return;
        }

        const leftLetter = fromSide === "left" ? letter : targetLetter;
        const rightLetter = fromSide === "left" ? targetLetter : letter;

        this.removeConnectionFor(leftLetter, "left");
        this.removeConnectionFor(rightLetter, "right");

        this.connections[leftLetter] = rightLetter;
        this.drawConnection(leftLetter, rightLetter);

         AudioEngine.play("star");   // ← baris baru: suara saat garis berhasil nyambung

        /*
        * Kalau semua slot sudah tersambung (walau ada yang salah),
        * otomatis cek jawaban tanpa perlu tombol Selesai.
        */

        if (Object.keys(this.connections).length === this.leftLetters.length) {

            setTimeout(() => {
                this.checkAnswers();
            }, 400);

        }

},


    findNearestItem(side, tempLine) {

        const endX = parseFloat(tempLine.getAttribute("x2"));
        const endY = parseFloat(tempLine.getAttribute("y2"));

        const column = side === "left" ? this.elements.leftColumn : this.elements.rightColumn;
        const items = column.querySelectorAll(".match-item");

        let closest = null;
        let closestDistance = 60;

        items.forEach(item => {
            const dot = item.querySelector(".match-dot");
            const point = this.getDotPosition(dot);
            const distance = Math.hypot(point.x - endX, point.y - endY);

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = item.dataset.letter;
            }
        });

        return closest;

    },


    /* ================================================
       CONNECTIONS
    ================================================= */
    removeConnectionFor(letter, side) {

        if (side === "left" && this.connections[letter]) {
            this.removeLine(letter);
            delete this.connections[letter];
            return;
        }

        if (side === "right") {
            const leftMatch = Object.keys(this.connections)
                .find(left => this.connections[left] === letter);

            if (leftMatch) {
                this.removeLine(leftMatch);
                delete this.connections[leftMatch];
            }
        }

    },

    removeLine(leftLetter) {
        const line = this.lineElements[leftLetter];
        if (line) {
            line.remove();
            delete this.lineElements[leftLetter];
        }
    },

    resetConnections() {
        Object.keys(this.lineElements).forEach(key => this.lineElements[key].remove());
        this.connections = {};
        this.lineElements = {};
    },

    drawConnection(leftLetter, rightLetter) {

        const leftDot = this.elements.leftColumn
            .querySelector(`.match-item[data-letter="${leftLetter}"] .match-dot`);

        const rightDot = this.elements.rightColumn
            .querySelector(`.match-item[data-letter="${rightLetter}"] .match-dot`);

        if (!leftDot || !rightDot) {
            return;
        }

        const p1 = this.getDotPosition(leftDot);
        const p2 = this.getDotPosition(rightDot);

        const line = this.createSvgLine(p1, p2, "match-line");
        this.elements.svg.appendChild(line);

        this.lineElements[leftLetter] = line;

    },

    redrawAllLines() {
        this.resizeSvg();
        Object.keys(this.connections).forEach(leftLetter => {
            this.removeLine(leftLetter);
            this.drawConnection(leftLetter, this.connections[leftLetter]);
        });
    },

    resizeSvg() {
        const rect = this.elements.wrapper.getBoundingClientRect();
        this.elements.svg.setAttribute("width", rect.width);
        this.elements.svg.setAttribute("height", rect.height);
    },

    getDotPosition(dotEl) {
        const wrapperRect = this.elements.wrapper.getBoundingClientRect();
        const dotRect = dotEl.getBoundingClientRect();

        return {
            x: dotRect.left + dotRect.width / 2 - wrapperRect.left,
            y: dotRect.top + dotRect.height / 2 - wrapperRect.top
        };
    },

    createSvgLine(p1, p2, className) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x);
        line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x);
        line.setAttribute("y2", p2.y);
        line.setAttribute("class", className);
        return line;
    },

    updateSvgLine(line, p1, p2) {
        line.setAttribute("x1", p1.x);
        line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x);
        line.setAttribute("y2", p2.y);
    },


    /* ================================================
       CHECK ANSWERS
    ================================================= */
    checkAnswers() {

        let correctCount = 0;

        this.leftLetters.forEach(letter => {

            const line = this.lineElements[letter];
            const isCorrect = this.connections[letter] === letter;

            if (line) {
                line.classList.remove("correct", "incorrect");
                line.classList.add(isCorrect ? "correct" : "incorrect");
            }

            if (isCorrect) {
                correctCount++;
            }

        });

        const total = this.leftLetters.length;

        if (correctCount === total) {

            AudioEngine.play("correct");

            ProgressEngine.addStar(total);
            this.elements.starCount.textContent = ProgressEngine.getStars();

            this.showFeedback(true);

            setTimeout(() => this.nextLevel(), 1400);

        } else {

            AudioEngine.play("wrong");

            this.elements.guideTitle.textContent = "Ada yang belum pas 😊";
            this.elements.guideText.textContent =
                `${correctCount} dari ${total} sudah benar. Perbaiki garis merah lalu tekan Selesai lagi.`;

        }

    },

    showFeedback(success) {
        this.elements.feedback.classList.add("show");
        this.elements.feedbackIcon.textContent = success ? "🎉" : "😊";
        this.elements.feedbackTitle.textContent = success ? "Hebat sekali!" : "Coba lagi!";
        this.elements.feedbackText.textContent = success
            ? "Semua huruf berhasil dicocokkan!"
            : "Masih ada pasangan yang belum tepat.";
    },

    hideFeedback() {
        this.elements.feedback.classList.remove("show");
    },


    /* ================================================
       NEXT LEVEL / COMPLETE
    ================================================= */
    nextLevel() {
        this.currentIndex++;

        if (this.currentIndex >= MATCH_LEVELS.length) {
            this.completeGame();
            return;
        }

        this.loadLevel();
    },

    completeGame() {

        ProgressEngine.gameCompleted("mencocokkan");

        const rewardKey = "petualanganHurufMencocokkanReward";

        if (localStorage.getItem(rewardKey) !== "true") {
            ProgressEngine.addStar(5);
            localStorage.setItem(rewardKey, "true");
        }

        this.elements.finalLevels.textContent = MATCH_LEVELS.length;
        this.elements.starCount.textContent = ProgressEngine.getStars();

        AudioEngine.play("reward");

        this.elements.completionModal.classList.add("show");

    },

    restart() {
        this.elements.completionModal.classList.remove("show");
        this.currentIndex = 0;
        this.loadLevel();
    },

    goHome() {
        AudioEngine.play("click");
        window.location.href = "../index.html";
    },

    renderStats() {
        this.elements.starCount.textContent = ProgressEngine.getStars();
    },

    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

};


document.addEventListener("DOMContentLoaded", () => {
    LineMatchGame.init();
});