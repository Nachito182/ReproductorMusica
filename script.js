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
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");

function loadSongs() {
    songs.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("song");
        songDiv.innerHTML = `<span>${song.title}</span><span>${song.duration}</span>`;
        songDiv.onclick = () => {
            currentIndex = index;
            playSong();
        };
        songListContainer.appendChild(songDiv);
    });
}

function playSong() {
    audio.src = songs[currentIndex].file;
    audio.play();
    isPlaying = true;
    updatePlayingState();
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayingState();
}

function updatePlayingState() {
    const allSongs = document.querySelectorAll(".song");
    allSongs.forEach((el, i) => {
        el.classList.toggle("playing", i === currentIndex);
    });
}

function nextSong() {
    if (isShuffled) {
        currentIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    playSong();
}

function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong();
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    alert("Modo aleatorio: " + (isShuffled ? "activado" : "desactivado"));
}

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

document.getElementById("play").onclick = () => isPlaying ? pauseSong() : playSong();
document.getElementById("next").onclick = nextSong;
document.getElementById("prev").onclick = prevSong;
document.getElementById("shuffle").onclick = toggleShuffle;
document.getElementById("repeat").onclick = () => playSong();

loadSongs();
