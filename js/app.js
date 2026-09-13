/* =========================================================
   PETUALANGAN HURUF
   HOME APP
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const settingsButton =
    document.getElementById("settingsButton");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettings =
    document.getElementById("closeSettings");

const musicToggle =
    document.getElementById("musicToggle");

const effectToggle =
    document.getElementById("effectToggle");

const gameModal =
    document.getElementById("gameModal");

const closeGameModal =
    document.getElementById("closeGameModal");

const startGameButton =
    document.getElementById("startGameButton");

const gameModalTitle =
    document.getElementById("gameModalTitle");

const gameModalText =
    document.getElementById("gameModalText");

const kiko =
    document.getElementById("kiko");

const gameCards =
    document.querySelectorAll(".game-card");

/* =========================================================
   SPLASH SCREEN
========================================================= */

/* =========================================================
   SPLASH SCREEN
========================================================= */

const splashOverlay =
    document.getElementById("splashOverlay");

const splashImage =
    document.getElementById("splashImage");


/*
 * Cek apakah splash sudah pernah dilihat
 * dalam sesi permainan ini.
 */

const splashSeen =
    sessionStorage.getItem(
        "petualanganHurufSplashSeen"
    );


/*
 * Jika splash sudah pernah dilihat,
 * langsung sembunyikan splash.
 */

if (splashSeen === "true") {

    splashOverlay.classList.add(
        "hide"
    );

}


/* =========================================================
   GAME DATA
========================================================= */

const gameData = {

    mengenal: {

        title:
            "Mengenal Huruf",

        description:
            "Yuk kenalan dengan huruf A sampai Z bersama Kiko!"

    },


    tebak: {

        title:
            "Tebak Huruf",

        description:
            "Dengarkan suara Kiko dan pilih huruf yang benar!"

    },


    mencocokkan: {

        title:
            "Mencocokkan Huruf",

        description:
            "Yuk pasangkan huruf besar dengan huruf kecil!"

    },


    pasang: {

        title:
            "Pasang Huruf",

        description:
            "Ayo pasangkan huruf dengan kata yang tepat!"

    }

};

/* =========================================================
   SPLASH SCREEN
========================================================= */

splashImage.addEventListener(
    "click",
    () => {

        AudioEngine.play("click");


        /*
         * Tandai bahwa splash sudah dilihat.
         */

        sessionStorage.setItem(
            "petualanganHurufSplashSeen",
            "true"
        );


        /*
         * Sembunyikan splash.
         */

        splashOverlay.classList.add(
            "hide"
        );


        /*
         * Suara sambutan Kiko.
         */

        setTimeout(
            () => {

                AudioEngine.playKiko(
                    "welcome"
                );

            },
            600
        );

    }
);

/* =========================================================
   SETTINGS UI
========================================================= */

function updateSettingsUI() {

    AudioEngine.updateUI();

}


/* =========================================================
   SETTINGS
========================================================= */

settingsButton.addEventListener(
    "click",
    () => {

        AudioEngine.play("click");

        settingsModal.classList.add(
            "show"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        AudioEngine.play("click");

        settingsModal.classList.remove(
            "show"
        );

    }
);


musicToggle.addEventListener(
    "click",
    () => {

        AudioEngine.toggleMusic();

    }
);


effectToggle.addEventListener(
    "click",
    () => {

        AudioEngine.toggleEffects();

    }
);


/* =========================================================
   GAME CARD
========================================================= */

gameCards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                AudioEngine.play("click");

                const game =
                    card.dataset.game;

                openGame(game);

            }
        );

    }
);


/* =========================================================
   OPEN GAME
========================================================= */

function openGame(game) {

    const data =
        gameData[game];


    if (!data) {
        return;
    }


    window.currentGame =
        game;


    gameModalTitle.textContent =
        data.title;


    gameModalText.textContent =
        data.description;


    gameModal.classList.add(
        "show"
    );


    /*
     * Audio intro otomatis
     * sesuai game yang dibuka.
     *
     * Contoh: mengenal -> game1_intro
     */

    const introMap = {

        mengenal: "game1_intro",

        tebak: "game2_intro",

        mencocokkan: "game3_intro",

        pasang: "game4_intro"

    };


    const introName =
        introMap[game];


  if (introName) {

    AudioEngine.playGameVoice(
        introName
    );

    sessionStorage.setItem(
        "petualanganHurufIntroPlayed_" + game,
        "true"
    );

}


    kiko.animate(

        [

            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.12)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],

        {

            duration: 400,

            easing: "ease-out"

        }

    );

}


/* =========================================================
   CLOSE GAME
========================================================= */

closeGameModal.addEventListener(
    "click",
    () => {

        AudioEngine.stopGameVoice();

        AudioEngine.play("click");

        gameModal.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   START GAME
========================================================= */

startGameButton.addEventListener(
    "click",
    () => {

        AudioEngine.stopGameVoice();

        AudioEngine.play("click");


        const routes = {

            mengenal:
                "games/mengenal.html",

            tebak:
                "games/tebak.html",

            mencocokkan:
                "games/mencocokkan.html",

            pasang:
                "games/pasang.html"

        };


        const game =
            window.currentGame;


        if (!game) {
            return;
        }


        /*
         * Untuk sementara aktifkan
         * jika file game sudah dibuat.
         */

        window.location.href =
            routes[game];

    }
);


/* =========================================================
   MODAL OUTSIDE CLICK
========================================================= */

settingsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            settingsModal
        ) {

            settingsModal.classList.remove(
                "show"
            );

        }

    }
);


gameModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            gameModal
        ) {

            AudioEngine.stopGameVoice();

            gameModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   FIRST USER INTERACTION
========================================================= */

document.addEventListener(
    "click",
    () => {

        AudioEngine.startMusic();

    },
    {
        once: true
    }
);


/* =========================================================
   KIKO
========================================================= */

kiko.addEventListener(
    "click",
    () => {

        AudioEngine.play("click");


        kiko.animate(

            [

                {
                    transform:
                        "scale(1)"
                },

                {
                    transform:
                        "scale(1.12)"
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

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

updateSettingsUI();
ProgressEngine.updateUI();