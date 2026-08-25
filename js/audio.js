/* =========================================================
   PETUALANGAN HURUF
   AUDIO ENGINE
========================================================= */

const AudioEngine = {

    /* =====================================================
       SETTINGS
    ===================================================== */

    musicEnabled: true,
    effectsEnabled: true,

    musicVolume: 0.25,
    effectsVolume: 0.7,

    backgroundMusic: null,

    sounds: {},

    currentVoice: null,

    initialized: false,

    audioBase: null,


    /* =====================================================
       GET AUDIO BASE PATH
    ===================================================== */

    getAudioBase() {

        /*
         * audio.js berada di:
         *
         * /js/audio.js
         *
         * Sedangkan audio berada di:
         *
         * /assets/audio/
         *
         * Jadi kita mengambil lokasi audio.js
         * kemudian naik satu folder.
         */

        const script =
            document.querySelector(
                'script[src$="audio.js"]'
            );


        if (script) {

            return new URL(
                "../assets/audio/",
                script.src
            ).href;

        }


        /*
         * Fallback
         */

        return new URL(
            "assets/audio/",
            document.baseURI
        ).href;

    },


    /* =====================================================
       INITIALIZE
    ===================================================== */

    init() {

        this.loadSettings();


        this.audioBase =
            this.getAudioBase();


        console.log(
            "🎵 Audio Base:",
            this.audioBase
        );


        /* =================================================
           BACKGROUND MUSIC
        ================================================= */

        this.backgroundMusic =
            new Audio(
                this.audioBase +
                "game/bgm.mp3"
            );


        this.backgroundMusic.loop =
            true;


        this.backgroundMusic.volume =
            this.musicVolume;


        this.backgroundMusic.preload =
            "auto";


        /* =================================================
           SYSTEM SOUNDS
        ================================================= */

        this.sounds.click =
            new Audio(
                this.audioBase +
                "system/click.mp3"
            );


        this.sounds.correct =
            new Audio(
                this.audioBase +
                "system/correct.mp3"
            );


        this.sounds.wrong =
            new Audio(
                this.audioBase +
                "system/wrong.mp3"
            );


        this.sounds.reward =
            new Audio(
                this.audioBase +
                "system/reward.mp3"
            );


        this.sounds.complete =
            new Audio(
                this.audioBase +
                "system/complete.mp3"
            );


        this.sounds.star =
            new Audio(
                this.audioBase +
                "system/star.mp3"
            );


        /* =================================================
           PRELOAD SYSTEM SOUNDS
        ================================================= */

        Object.values(
            this.sounds
        ).forEach(sound => {

            sound.volume =
                this.effectsVolume;

            sound.preload =
                "auto";

        });


        this.initialized =
            true;


        console.log(
            "🔊 Audio Engine Ready"
        );

    },


    /* =====================================================
       ENSURE INITIALIZED
    ===================================================== */

    ensureInitialized() {

        if (!this.initialized) {

            this.init();

        }

    },


    /* =====================================================
       START MUSIC
    ===================================================== */

    startMusic() {

        this.ensureInitialized();


        if (!this.musicEnabled) {

            return;

        }


        this.backgroundMusic.volume =
            this.musicVolume;


        this.backgroundMusic
            .play()
            .then(() => {

                console.log(
                    "🎵 BGM started"
                );

            })
            .catch(error => {

                console.warn(
                    "BGM menunggu interaksi pengguna:",
                    error
                );

            });

    },


    /* =====================================================
       STOP MUSIC
    ===================================================== */

    stopMusic() {

        this.ensureInitialized();


        if (
            !this.backgroundMusic
        ) {

            return;

        }


        this.backgroundMusic.pause();

        this.backgroundMusic.currentTime =
            0;

    },


    /* =====================================================
       TOGGLE MUSIC
    ===================================================== */

    toggleMusic() {

        this.musicEnabled =
            !this.musicEnabled;


        if (this.musicEnabled) {

            this.startMusic();

        } else {

            this.stopMusic();

        }


        this.saveSettings();

        this.updateUI();

    },


    /* =====================================================
       TOGGLE EFFECT
    ===================================================== */

    toggleEffects() {

        this.effectsEnabled =
            !this.effectsEnabled;


        this.saveSettings();

        this.updateUI();

    },


    /* =====================================================
       PLAY SYSTEM SOUND
    ===================================================== */

    play(name) {

        this.ensureInitialized();


        if (!this.effectsEnabled) {

            return;

        }


        const sound =
            this.sounds[name];


        if (!sound) {

            console.warn(
                "Sound tidak ditemukan:",
                name
            );

            return;

        }


        sound.currentTime =
            0;


        sound.volume =
            this.effectsVolume;


        sound.play()
            .catch(error => {

                console.warn(
                    `Gagal memainkan ${name}:`,
                    error
                );

            });

    },


    /* =====================================================
       PLAY LETTER SOUND
    ===================================================== */

    playLetter(letter) {

        this.ensureInitialized();


        if (!this.effectsEnabled) {

            return;

        }


        const cleanLetter =
            String(letter)
                .trim()
                .toLowerCase();


        const path =
            this.audioBase +
            `letters/${cleanLetter}.mp3`;


        console.log(
            "🔤 Play Letter:",
            path
        );


        const audio =
            new Audio(path);


        audio.volume =
            this.effectsVolume;


        audio.preload =
            "auto";


        audio.play()
            .then(() => {

                console.log(
                    `🔊 Huruf ${cleanLetter}`
                );

            })
            .catch(error => {

                console.error(
                    `Gagal memainkan huruf ${cleanLetter}:`,
                    error
                );

            });

    },


    /* =====================================================
       PLAY GAME VOICE
    ===================================================== */

           playGameVoice(name) {

        this.ensureInitialized();


        /*
         * Hentikan dulu suara narasi
         * apapun yang sedang berjalan
         * (Kiko atau game voice lain),
         * supaya tidak tabrakan.
         */

        this.stopVoice();


        if (!this.effectsEnabled) {

            return;

        }


        const path =
            this.audioBase +
            `game/${name}.mp3`;


        console.log(
            "🎙️ Game Voice:",
            path
        );


        const audio =
            new Audio(path);


        audio.volume =
            this.effectsVolume;


        this.currentVoice =
            audio;


        audio.play()
            .catch(error => {

                console.error(
                    `Gagal memainkan ${name}:`,
                    error
                );

            });

    },


    /* =====================================================
       STOP VOICE (KIKO / GAME)
    ===================================================== */

    stopVoice() {

        if (this.currentVoice) {

            this.currentVoice.pause();

            this.currentVoice.currentTime =
                0;

            this.currentVoice =
                null;

        }

    },


    /* =====================================================
       STOP GAME VOICE (ALIAS, KOMPATIBILITAS)
    ===================================================== */

    stopGameVoice() {

        this.stopVoice();

    },


    /* =====================================================
       PLAY KIKO VOICE
    ===================================================== */

       playKiko(name) {

        this.ensureInitialized();


        /*
         * Hentikan dulu suara narasi
         * apapun yang sedang berjalan,
         * supaya tidak tabrakan.
         */

        this.stopVoice();


        if (!this.effectsEnabled) {

            return;

        }


        const path =
            this.audioBase +
            `kiko/${name}.mp3`;


        console.log(
            "🐰 Kiko:",
            path
        );


        const audio =
            new Audio(path);


        audio.volume =
            this.effectsVolume;


        this.currentVoice =
            audio;


        audio.play()
            .catch(error => {

                console.error(
                    `Gagal memainkan Kiko ${name}:`,
                    error
                );

            });

    },


    /* =====================================================
       MUSIC VOLUME
    ===================================================== */

    setMusicVolume(volume) {

        this.musicVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    volume
                )
            );


        if (
            this.backgroundMusic
        ) {

            this.backgroundMusic.volume =
                this.musicVolume;

        }


        this.saveSettings();

    },


    /* =====================================================
       EFFECT VOLUME
    ===================================================== */

    setEffectsVolume(volume) {

        this.effectsVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    volume
                )
            );


        Object.values(
            this.sounds
        ).forEach(sound => {

            sound.volume =
                this.effectsVolume;

        });


        this.saveSettings();

    },


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    saveSettings() {

        localStorage.setItem(
            "petualanganHurufMusic",
            String(
                this.musicEnabled
            )
        );


        localStorage.setItem(
            "petualanganHurufEffects",
            String(
                this.effectsEnabled
            )
        );

    },


    /* =====================================================
       LOAD SETTINGS
    ===================================================== */

    loadSettings() {

        const music =
            localStorage.getItem(
                "petualanganHurufMusic"
            );


        const effects =
            localStorage.getItem(
                "petualanganHurufEffects"
            );


        if (
            music !== null
        ) {

            this.musicEnabled =
                music === "true";

        }


        if (
            effects !== null
        ) {

            this.effectsEnabled =
                effects === "true";

        }

    },


    /* =====================================================
       UPDATE UI
    ===================================================== */

    updateUI() {

        const musicIcon =
            document.getElementById(
                "soundIcon"
            );


        const musicStatus =
            document.getElementById(
                "musicStatus"
            );


        const effectStatus =
            document.getElementById(
                "effectStatus"
            );


        if (musicIcon) {

            musicIcon.textContent =
                this.musicEnabled
                    ? "🔊"
                    : "🔇";

        }


        if (musicStatus) {

            musicStatus.textContent =
                this.musicEnabled
                    ? "ON"
                    : "OFF";

        }


        if (effectStatus) {

            effectStatus.textContent =
                this.effectsEnabled
                    ? "ON"
                    : "OFF";

        }

    }

};


/* =========================================================
   INITIALIZE
========================================================= */

AudioEngine.init();