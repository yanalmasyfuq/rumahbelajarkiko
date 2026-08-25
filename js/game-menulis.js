/* =========================================================
   GAME 3 — MENULIS HURUF
========================================================= */


/*
 * Untuk prototype pertama kita gunakan 5 huruf.
 *
 * Nanti bisa diganti menjadi A-Z.
 */

const WRITING_LETTERS = [

    "A", "B", "C", "D", "E",
    "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y",
    "Z"

];


const WritingGame = {


    currentIndex: 0,

    currentLetter: "A",

    drawing: false,

    completedPoints: new Set(),

    progress: 0,

    canvas: null,

    ctx: null,

    dpr: 1,

    points: [],

    elements: {},



    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.cacheElements();

        this.setupCanvas();

        this.bindEvents();

        this.renderStats();

        this.loadLetter();

    },



    /* =====================================================
       CACHE
    ===================================================== */

    cacheElements() {

        this.elements = {

            canvas:
                document.getElementById(
                    "writingCanvas"
                ),

            currentLetter:
                document.getElementById(
                    "currentLetter"
                ),

            letterNumber:
                document.getElementById(
                    "letterNumber"
                ),

            progressFill:
                document.getElementById(
                    "progressFill"
                ),

            traceFill:
                document.getElementById(
                    "traceFill"
                ),

            tracePercent:
                document.getElementById(
                    "tracePercent"
                ),

            canvasHint:
                document.getElementById(
                    "canvasHint"
                ),
            guideTitle:
            document.getElementById("guideTitle"),

                guideText:
            document.getElementById("guideText"),

            listenButton:
                document.getElementById(
                    "listenButton"
                ),

            resetButton:
                document.getElementById(
                    "resetButton"
                ),

            feedback:
                document.getElementById(
                    "writingFeedback"
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

            finalLetters:
                document.getElementById(
                    "finalLetters"
                )

        };


        this.canvas =
            this.elements.canvas;


        this.ctx =
            this.canvas.getContext(
                "2d"
            );

    },



    /* =====================================================
       CANVAS SETUP
    ===================================================== */

    setupCanvas() {

    const rect = this.canvas.getBoundingClientRect();

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);


    /* Canvas tersembunyi untuk validasi jejak huruf */

    if (!this.maskCanvas) {
        this.maskCanvas = document.createElement("canvas");
        this.maskCtx = this.maskCanvas.getContext("2d");
    }

    this.maskCanvas.width = this.canvas.width;
    this.maskCanvas.height = this.canvas.height;

    this.maskCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);


    window.addEventListener("resize", () => {
        this.setupCanvas();
        this.drawTemplate();
    });

},



    /* =====================================================
       EVENTS
    ===================================================== */

    bindEvents() {


        /*
         * Mouse
         */

        this.canvas.addEventListener(
            "mousedown",
            event => {

                this.startDrawing(
                    event
                );

            }
        );


        this.canvas.addEventListener(
            "mousemove",
            event => {

                this.moveDrawing(
                    event
                );

            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                this.stopDrawing();

            }
        );



        /*
         * Touch / mobile
         */

        this.canvas.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                this.startDrawing(
                    event.touches[0]
                );

            },
            {
                passive: false
            }
        );


        this.canvas.addEventListener(
            "touchmove",
            event => {

                event.preventDefault();

                this.moveDrawing(
                    event.touches[0]
                );

            },
            {
                passive: false
            }
        );


        this.canvas.addEventListener(
            "touchend",
            event => {

                event.preventDefault();

                this.stopDrawing();

            },
            {
                passive: false
            }
        );



        /*
         * Buttons
         */

        this.elements.resetButton
            .addEventListener(
                "click",
                () => {

                    this.resetTracing();

                }
            );


        this.elements.listenButton
            .addEventListener(
                "click",
                () => {

                    this.playLetterSound();

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
       LOAD LETTER
    ===================================================== */

    loadLetter() {

        this.currentLetter =
            WRITING_LETTERS[
                this.currentIndex
            ];


        this.elements.currentLetter
            .textContent =
            this.currentLetter;


        this.elements.letterNumber
            .textContent =
            this.currentIndex + 1;


        const percent =
            (
                (this.currentIndex + 1)
                /
                WRITING_LETTERS.length
            ) * 100;


        this.elements.progressFill
            .style.width =
            `${percent}%`;


        this.hideFeedback();


        this.resetTracing(
            false
        );


        /*
         * Suara otomatis tidak dipaksa.
         *
         * Anak bisa menekan
         * tombol Dengarkan.
         */

    },



    /* =====================================================
       DRAW TEMPLATE
    ===================================================== */

    drawTemplate() {

        const width =
            this.canvas.clientWidth;


        const height =
            this.canvas.clientHeight;
            
        // PENTING:

            // Buat mask huruf sebelum anak mulai menulis
            this.buildLetterMask(width, height);

        this.ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
         * Background
         */

        this.ctx.fillStyle =
            "#f8fdff";


        this.ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Grid lembut
         */

        this.ctx.strokeStyle =
            "#e7f3f9";


        this.ctx.lineWidth =
            1;


        for (
            let y = 40;
            y < height;
            y += 40
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                0,
                y
            );

            this.ctx.lineTo(
                width,
                y
            );

            this.ctx.stroke();

        }


        /*
         * Huruf
         */

        this.ctx.save();


        this.ctx.font =
            "bold 270px Arial";


        this.ctx.textAlign =
            "center";


        this.ctx.textBaseline =
            "middle";


        /*
         * Shadow putih
         */

        this.ctx.fillStyle =
            "#ffffff";


        this.ctx.fillText(
            this.currentLetter,
            width / 2,
            height / 2 - 8
        );


        /*
         * Garis putus-putus
         */

        this.ctx.strokeStyle =
            "#9ecde5";


        this.ctx.lineWidth =
            5;


        this.ctx.setLineDash([
            8,
            9
        ]);


        this.ctx.strokeText(
            this.currentLetter,
            width / 2,
            height / 2 - 8
        );


        this.ctx.restore();



        /*
         * Start point
         */

    


        

    },

    buildLetterMask(width, height) {

    this.maskCtx.clearRect(0, 0, width, height);

    this.maskCtx.save();

    this.maskCtx.font = "bold 270px Arial";
    this.maskCtx.textAlign = "center";
    this.maskCtx.textBaseline = "middle";

    this.maskCtx.strokeStyle = "#000000";
    this.maskCtx.lineWidth = 46; // lebar toleransi jalur
    this.maskCtx.lineCap = "round";
    this.maskCtx.lineJoin = "round";

    this.maskCtx.strokeText(
        this.currentLetter,
        width / 2,
        height / 2 - 8
    );

    this.maskCtx.restore();

    this.maskData = this.maskCtx.getImageData(
        0, 0,
        this.maskCanvas.width,
        this.maskCanvas.height
    );

    this.buildLetterGrid(width, height);

},


buildLetterGrid(width, height) {

    const cellSize = 26;

    this.cellSize = cellSize;
    this.gridCols = Math.ceil(width / cellSize);
    this.gridRows = Math.ceil(height / cellSize);

    this.letterCells = new Set();

    for (let row = 0; row < this.gridRows; row++) {
        for (let col = 0; col < this.gridCols; col++) {

            const cx = Math.min(width - 1, col * cellSize + cellSize / 2);
            const cy = Math.min(height - 1, row * cellSize + cellSize / 2);

            if (this.readMaskAlpha(cx, cy) > 10) {
                this.letterCells.add(`${col}-${row}`);
            }
        }
    }

},


readMaskAlpha(x, y) {

    const px = Math.floor(x * this.dpr);
    const py = Math.floor(y * this.dpr);

    if (
        px < 0 || py < 0 ||
        px >= this.maskCanvas.width ||
        py >= this.maskCanvas.height
    ) {
        return 0;
    }

    const index = (py * this.maskCanvas.width + px) * 4 + 3;

    return this.maskData.data[index];

},



   



    /* =====================================================
       START DRAWING
    ===================================================== */

    startDrawing(event) {

        const position =
            this.getPointerPosition(
                event
            );


        /*
         * Kita tetap mengizinkan
         * anak memulai dari area huruf.
         */

        if (
            !this.isInsideLetter(
                position.x,
                position.y
            )
        ) {

            return;

        }


        this.drawing = true;


        this.elements.canvasHint
            .classList.add(
                "hidden"
            );


        this.addDrawingPoint(
            position
        );

    },



    /* =====================================================
       MOVE
    ===================================================== */

    moveDrawing(event) {

        if (
            !this.drawing
        ) {

            return;

        }


        const position =
            this.getPointerPosition(
                event
            );


        if (
            !this.isInsideLetter(
                position.x,
                position.y
            )
        ) {

            return;

        }


        this.addDrawingPoint(
            position
        );


        this.updateProgress();

    },



    /* =====================================================
       STOP
    ===================================================== */

    stopDrawing() {

        if (
            !this.drawing
        ) {

            return;

        }


        this.drawing = false;


        /*
         * Kalau progress sudah
         * cukup tinggi,
         * huruf dianggap selesai.
         */

        if (
            this.progress >= 70
        ) {

            this.completeLetter();

        }

    },



    /* =====================================================
       ADD POINT
    ===================================================== */

    addDrawingPoint(position) {

    /*
     * =====================================================
     * CATAT CELL DI SEKITAR POSISI POINTER
     * =====================================================
     */

    const radius = 18;

    const minCol = Math.floor(
        (position.x - radius) / this.cellSize
    );

    const maxCol = Math.floor(
        (position.x + radius) / this.cellSize
    );

    const minRow = Math.floor(
        (position.y - radius) / this.cellSize
    );

    const maxRow = Math.floor(
        (position.y + radius) / this.cellSize
    );


    for (
        let row = minRow;
        row <= maxRow;
        row++
    ) {

        for (
            let col = minCol;
            col <= maxCol;
            col++
        ) {

            const cellKey = `${col}-${row}`;

            if (
                this.letterCells.has(cellKey)
            ) {

                this.visitedCells.add(
                    cellKey
                );

            }

        }

    }


    /*
     * =====================================================
     * SIMPAN TITIK
     * =====================================================
     */

    this.points.push(position);


    /*
     * Kalau ini adalah titik pertama,
     * belum ada garis yang bisa dihitung.
     */

    if (
        this.points.length === 1
    ) {

        return;

    }


    /*
     * =====================================================
     * TITIK SEBELUMNYA
     * =====================================================
     */

    const previous =
        this.points[
            this.points.length - 2
        ];


    /*
     * =====================================================
     * HITUNG JARAK
     * =====================================================
     */

    const dx =
        position.x -
        previous.x;

    const dy =
        position.y -
        previous.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    this.totalDistance =
        (this.totalDistance || 0) +
        distance;


    /*
     * =====================================================
     * TANDAI CELL DI SEPANJANG GARIS
     *
     * Ini penting.
     *
     * Sebelumnya hanya titik mouse yang dihitung.
     * Sekarang seluruh jalur antara titik sebelumnya
     * dan titik sekarang ikut diperiksa.
     * =====================================================
     */

    const steps =
        Math.max(
            1,
            Math.ceil(
                distance /
                (this.cellSize / 2)
            )
        );


    for (
        let i = 0;
        i <= steps;
        i++
    ) {

        const t =
            i / steps;


        const x =
            previous.x +
            (
                position.x -
                previous.x
            ) * t;


        const y =
            previous.y +
            (
                position.y -
                previous.y
            ) * t;


        const col =
            Math.floor(
                x / this.cellSize
            );

        const row =
            Math.floor(
                y / this.cellSize
            );


        /*
         * Tandai area sekitar garis
         * sesuai ketebalan goresan.
         */

        const brushRadius = 18;


        const minX =
            Math.floor(
                (x - brushRadius) /
                this.cellSize
            );

        const maxX =
            Math.floor(
                (x + brushRadius) /
                this.cellSize
            );

        const minY =
            Math.floor(
                (y - brushRadius) /
                this.cellSize
            );

        const maxY =
            Math.floor(
                (y + brushRadius) /
                this.cellSize
            );


        for (
            let gy = minY;
            gy <= maxY;
            gy++
        ) {

            for (
                let gx = minX;
                gx <= maxX;
                gx++
            ) {

                const key =
                    `${gx}-${gy}`;


                if (
                    this.letterCells.has(key)
                ) {

                    this.visitedCells.add(
                        key
                    );

                }

            }

        }

    }


    /*
     * =====================================================
     * GAMBAR GARIS
     * =====================================================
     */

    this.ctx.save();

    this.ctx.beginPath();

    this.ctx.moveTo(
        previous.x,
        previous.y
    );

    this.ctx.lineTo(
        position.x,
        position.y
    );

    this.ctx.strokeStyle =
        "#63c878";

    this.ctx.lineWidth =
        13;

    this.ctx.lineCap =
        "round";

    this.ctx.lineJoin =
        "round";

    this.ctx.stroke();

    this.ctx.restore();

},

    /* =====================================================
       POINTER POSITION
    ===================================================== */

    getPointerPosition(event) {

        const rect =
            this.canvas.getBoundingClientRect();


        return {

            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top

        };

    },



    /* =====================================================
       CHECK LETTER
    ===================================================== */

    isInsideLetter(x, y) {
    return this.readMaskAlpha(x, y) > 10;
},



    /* =====================================================
       UPDATE PROGRESS
    ===================================================== */

  updateProgress() {

    const total = this.letterCells.size || 1;

    this.progress = Math.min(
        100,
        Math.round((this.visitedCells.size / total) * 100)
    );

    this.elements.traceFill.style.width = `${this.progress}%`;
    this.elements.tracePercent.textContent = `${this.progress}%`;

    if (
        this.progress >= 30 &&
        this.progress < 70
    ) {
        this.elements.guideTitle.textContent = "Bagus! Teruskan! ✏️";
    }

},



    /* =====================================================
       COMPLETE LETTER
    ===================================================== */

    completeLetter() {

        this.drawing = false;


        this.progress = 100;


        this.elements.traceFill
            .style.width =
            "100%";


        this.elements.tracePercent
            .textContent =
            "100%";


        this.showFeedback();


        /*
         * Reward
         */

        ProgressEngine.addStar(
            1
        );


        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();


        AudioEngine.play(
            "correct"
        );


        /*
         * Tunggu sebentar
         * kemudian lanjut huruf berikutnya.
         */

        setTimeout(
            () => {

                this.nextLetter();

            },
            1400
        );

    },



    /* =====================================================
       NEXT LETTER
    ===================================================== */

    nextLetter() {

        this.currentIndex++;


        if (
            this.currentIndex >=
            WRITING_LETTERS.length
        ) {

            this.completeGame();

            return;

        }


        this.loadLetter();

    },



    /* =====================================================
       FEEDBACK
    ===================================================== */

    showFeedback() {

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
            `Kamu berhasil mengikuti huruf ${this.currentLetter}!`;

    },


    hideFeedback() {

        this.elements.feedback
            .classList.remove(
                "show"
            );

    },



    /* =====================================================
       RESET
    ===================================================== */

    resetTracing(
        redraw = true
    ) {

        this.drawing = false;


        this.points = [];

       this.visitedCells = new Set();   // <-- tambahkan ini
        this.progress = 0;


        this.elements.traceFill
            .style.width =
            "0%";


        this.elements.tracePercent
            .textContent =
            "0%";


        this.elements.canvasHint
            .classList.remove(
                "hidden"
            );


        this.hideFeedback();


        this.elements.guideTitle
            .textContent =
            "Ayo menulis! ✏️";


        this.elements.guideText
            .textContent =
            "Ikuti garis huruf dengan jari atau mouse.";


        if (
            redraw
        ) {

            this.drawTemplate();

        } else {

            requestAnimationFrame(
                () => {

                    this.drawTemplate();

                }
            );

        }

    },



    /* =====================================================
       PLAY LETTER
    ===================================================== */

    playLetterSound() {

        if (
            typeof AudioEngine !==
            "undefined"
        ) {

            AudioEngine.playLetter(
                this.currentLetter
            );

        }

    },



    /* =====================================================
       COMPLETE GAME
    ===================================================== */

    completeGame() {

        ProgressEngine.gameCompleted(
            "menulis"
        );


        /*
         * Bonus penyelesaian
         */

        const rewardKey =
            "petualanganHurufMenulisReward";


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


        this.elements.finalLetters
            .textContent =
            WRITING_LETTERS.length;


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


        this.currentIndex = 0;


        this.resetTracing();


        this.loadLetter();

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
       STATS
    ===================================================== */

    renderStats() {

        this.elements.starCount
            .textContent =
            ProgressEngine.getStars();

    }

};



/* =========================================================
   START GAME
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        WritingGame.init();

    }
);