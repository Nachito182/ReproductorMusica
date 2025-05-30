const songs = [
    { title: "15 Step", duration: "3:57", file: "songs/01.mp3" },
    { title: "Bodysnatchers", duration: "4:02", file: "songs/02.mp3" },
    { title: "Nude", duration: "4:15", file: "songs/03.mp3" },
    { title: "Weird Fishes/Arpeggi", duration: "5:18", file: "songs/04.mp3" },
    { title: "All I Need", duration: "3:48", file: "songs/05.mp3" },
    { title: "Faust Arp", duration: "2:10", file: "songs/06.mp3" },
    { title: "Reckoner", duration: "4:50", file: "songs/07.mp3" },
    { title: "House of Cards", duration: "5:28", file: "songs/08.mp3" },
    { title: "Jigsaw Falling Into Place", duration: "4:09", file: "songs/09.mp3" },
    { title: "Videotape", duration: "4:42", file: "songs/10.mp3" },
];

let currentIndex = 0;
let isPlaying = false;
let isShuffled = false;

const audio = new Audio();
const songListContainer = document.getElementById("song-list");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");
const currentTitle = document.getElementById("current-title");


function loadSongs() {
    songs.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song");
        songDiv.innerHTML = `<span>${song.title}</span><span>${song.duration}</span>`;
        songDiv.onclick = () => {
            currentIndex = index;
            loadAndPlaySong();
        };
        songListContainer.appendChild(songDiv);
    });
}

function loadAndPlaySong() {
    audio.src = songs[currentIndex].file;
    audio.play();
    isPlaying = true;
    updateSongDisplay();
}

function getFileName(path) {
    return path.split("/").pop();
}

function playSong() {
    const currentFile = getFileName(songs[currentIndex].file);
    const audioFileName = getFileName(audio.src);
    
    if (!audio.src || audioFileName !== currentFile) {
        loadAndPlaySong();
    } else if (!isPlaying) {
        audio.play();
        isPlaying = true;
        updateSongDisplay();
    }
}

// Evento para pasar a la siguiente canción al terminar la actual
audio.onended = () => {
    nextSong();
};

function pauseSong() {
    audio.pause();
    isPlaying = false;
}

function updateSongDisplay() {
    const allSongs = document.querySelectorAll(".song");
    allSongs.forEach((el, i) => {
        el.classList.toggle("playing", i === currentIndex);
    });
    currentTitle.textContent = songs[currentIndex].title;
}

function nextSong() {
    if (isShuffled) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentIndex);
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    loadAndPlaySong();
}

function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadAndPlaySong();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    alert("Modo aleatorio: " + (isShuffled ? "activado" : "desactivado"));
}

// Actualiza barra de progreso
audio.ontimeupdate = () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progressPercent + "%";
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    durationSpan.textContent = formatTime(audio.duration);
};

function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

// Hacer clic en la barra para saltar a un tiempo
progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
});

document.getElementById("play").onclick = () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
};
document.getElementById("next").onclick = nextSong;
document.getElementById("prev").onclick = prevSong;
document.getElementById("shuffle").onclick = toggleShuffle;
document.getElementById("repeat").onclick = () => {
    audio.currentTime = 0;
    playSong();
};

loadSongs();

