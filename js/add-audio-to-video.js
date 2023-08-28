// Select elements here
const getScript = document.currentScript;
const pageTool = getScript.dataset.tool;
const fileName = getScript.dataset.filename;
const folderName = getScript.dataset.foldername;
const lang = getScript.dataset.lang;
const video = document.getElementById("video");
const videoControls = document.getElementById("video-controls");
const playButton = document.getElementById("play");
const playbackIcons = document.querySelectorAll(".playback-icons use");
const timeElapsed = document.getElementById("time-elapsed");
const duration = document.getElementById("duration");
const progressBar = document.getElementById("progress-bar");
const seek = document.getElementById("seek");
const seekTooltip = document.getElementById("seek-tooltip");
const volumeButton = document.getElementById("volume-button");
const volumeIcons = document.querySelectorAll(".volume-button use");
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById("volume");
const playbackAnimation = document.getElementById("playback-animation");
const fullscreenButton = document.getElementById("fullscreen-button");
const videoContainer = document.getElementById("video-container");
const fullscreenIcons = fullscreenButton.querySelectorAll("use");
const pipButton = document.getElementById("pip-button");
let FramesLayer = document.querySelector(".frames");
const videoWorks = !!document.createElement("video").canPlayType;
const timeMarker = document.querySelector(".time-marker");
const timeTick = document.querySelector("time-marker-tick");
const audioPlayer = document.getElementById("audioPlayer");
const videoSrc = document.getElementById("videoSrc");
let videoFilesContainer = document.querySelector(".video-files-container");
let audioFilesContainer = document.querySelector(".audio-files-container");
let timeLineDuration = 0;
let openModalBtn = document.querySelector(".add-file-btn");
let uploadBtn = document.querySelector(".upload-btn");
let type = null;
let trimBtn = document.getElementById("Trim");
const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
const modal = document.getElementById("customModal");
const closeModalBtn = document.getElementById("closeModalBtn");
let downloadBtn = document.querySelector(".downloadBtn");
let mainContainer = document.querySelector(".containerMan");
const chooseFile = document.querySelector(".Button");

const gdrive = document.querySelector("#filepicker");
const fileDropBox = document.querySelector(".custom-box");
const mimeTypes = "video/mp4,video/mov,video/ogg,video/webm";
const filemimes = [".mp4", ".mov", ".ogg", ".webm"];
const showDropDown = document.querySelector(".file-pick-dropdown");
const icon = document.querySelector(".arrow-sign");
const dropDown = document.querySelector(".file-picker-dropdown");
const inputBox = document.getElementById("inputbox");
gdrive.addEventListener(
  "click",
  (getFile, mimeTypes, showLoader, closeLoader) => {
    const data = loadPicker();
  }
);

const showLoading = () => {
  document.querySelector("#file-loader").style.display = "flex";
  document.querySelector(".file-input").style.display = "none";
};
const stopLoading = () => {
  fileDropBox.style.display = "none";
};
inputBox.onclick = function () {
  document.querySelector("#files").click();
};

const getDropBoxFile = (file) => {
  handleFileChange(file);
};

ffmpeg.load();
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
if (videoWorks) {
  video.controls = false;
  videoControls.classList.remove("hidden");
}

gdrive.addEventListener(
  "click",
  (getFile, mimeTypes, showLoader, closeLoader) => {
    const data = loadPicker();
  }
);
// Add functions here
// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
let isPlaying = false;
async function togglePlay() {
  if (isPlaying) {
    video.pause();
    audioPlayer.pause();
    isPlaying = false;
  } else {
    video.play();
    audioPlayer.play();
    isPlaying = true;
  }
}

// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
function updatePlayButton() {
  playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));

  if (video.paused) {
    playButton.setAttribute("data-title", "Play (k)");
  } else {
    playButton.setAttribute("data-title", "Pause (k)");
  }
}
// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

// initializeVideo sets the video duration, and maximum value of the
// progressBar
async function initializeTimeLine() {
  let audioDuration = audioPlayer.duration;
  if (isNaN(audioDuration)) audioDuration = 0;

  let videoDuration = video.duration;
  if (isNaN(videoDuration)) videoDuration = 0;

  // in seconds
  let defaultMaxTime = 90;
  timeLineDuration =
    audioDuration > videoDuration ? audioDuration : videoDuration;

  const time = formatTime(timeLineDuration);

  if (timeLineDuration <= 10) {
    seek.setAttribute("max", timeLineDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
    let intervals = Math.round(timeLineDuration);
    let timePoints = generateTimePoints(time.seconds, intervals);
    updateTimeline(timePoints);
  } else {
    seek.setAttribute("max", timeLineDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
    let intervals = timeLineDuration / 2;
    if (intervals > 50) {
      intervals = intervals / 2;
    }

    let interval1 = Math.round(intervals / 10) * 10;
    let interval2 = Math.round(intervals / 5) * 5;
    intervals = interval1 > interval2 ? interval2 : interval1;
    let timePoints = generateTimePoints(time.seconds, intervals);
    updateTimeline(timePoints);
    if (video.duration > 0) {
      document.querySelector(".videoFiles").style.width = video.duration + "%";
    }
    if (audioPlayer.duration > 0) {
      document.querySelector(".audioFiles").style.width =
        audioPlayer.duration + "%";
    }
  }
}

// updateTimeElapsed indicates how far through the video
// the current playback is by updating the timeElapsed element
function updateTimeElapsed() {
  let audioDuration = audioPlayer.duration;
  if (isNaN(audioDuration)) {
    audioDuration = 0;
  }
  let videoDuration = video.duration;
  if (isNaN(videoDuration)) {
    videoDuration = 0;
  }

  if (videoDuration > audioDuration) {
    const time = formatTime(video.currentTime);
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
  } else {
    const time = formatTime(audioPlayer.currentTime);
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
  }
}

// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
  let audioDuration = audioPlayer.duration;
  if (isNaN(audioDuration)) {
    audioDuration = 0;
  }
  let videoDuration = video.duration;
  if (isNaN(videoDuration)) {
    videoDuration = 0;
  }
  if (videoDuration > audioDuration) {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
    const seekPercentage = (seek.value / 100) * 100;
    timeMarker.style.left = `${Math.floor(seekPercentage)}%`;
  } else {
    seek.value = Math.floor(audioPlayer.currentTime);
    progressBar.value = Math.floor(audioPlayer.currentTime);
    const seekPercentage = (seek.value / 100) * 100;
    timeMarker.style.left = `${Math.floor(seekPercentage)}%`;
  }
}

// skipAhead jumps to a different point in the video when the progress bar
// is clicked
function skipAhead(event) {
  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  if (skipTo < video.duration) {
    video.currentTime = skipTo;
  }
  if (skipTo < audioPlayer.duration) {
    audioPlayer.currentTime = skipTo;
  }
  progressBar.value = skipTo;
  seek.value = skipTo;
  const seekPercentage = (seek.value / seek.max) * 100; // Assuming the max value of the seek input is 90
  timeMarker.style.left = `${Math.floor(seekPercentage)}%`;

  if (timeLineDuration > seekPercentage) video.currentTime = seekPercentage;
  if (timeLineDuration > seekPercentage)
    audioPlayer.currentTime = seekPercentage;
}

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume() {
  if (audioPlayer.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
  volumeIcons.forEach((icon) => {
    icon.classList.add("hidden");
  });

  volumeButton.setAttribute("data-title", "Mute (m)");

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove("hidden");
    volumeButton.setAttribute("data-title", "Unmute (m)");
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove("hidden");
  } else {
    volumeHigh.classList.remove("hidden");
  }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute("data-volume", volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}

// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    videoContainer.webkitRequestFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
}

// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
function updateFullscreenButton() {
  fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"));

  if (document.fullscreenElement) {
    fullscreenButton.setAttribute("data-title", "Exit full screen (f)");
  } else {
    fullscreenButton.setAttribute("data-title", "Full screen (f)");
  }
}

// togglePip toggles Picture-in-Picture mode on the video
async function togglePip() {
  try {
    if (video !== document.pictureInPictureElement) {
      pipButton.disabled = true;
      await video.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error(error);
  } finally {
    pipButton.disabled = false;
  }
}

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add("hide");
}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove("hide");
}

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
  const { key } = event;
  switch (key) {
    case "k":
      togglePlay();
      animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case "m":
      toggleMute();
      break;
    case "f":
      toggleFullScreen();
      break;
    case "p":
      togglePip();
      break;
  }
}

// generate frames

async function generateFrames(e) {
  //generate thumbnail URL data
  video.muted = true;
  var duration = e.duration;
  EndTimeinSeconds = duration;
  videoTime = duration;
  //time conversion for FeatureValues[EndTime]
  var measuredTime = new Date(null);
  measuredTime.setSeconds(duration); // specify value of SECONDS
  var MHSTime = measuredTime.toISOString().substr(11, 8);

  // FeatureValues["EndTime"] = MHSTime;
  // EndTrimValue.innerText = MHSTime;
  var FrameStep = Math.ceil(duration / 19);
  var i = 0;
  // Spinner.style.display = "none";
  var previousWorkingFrameData;

  //Temporary fix for firefox parseFloat()
  let tempCounter = 0;

  while (video.currentTime < duration) {
    video.currentTime = parseFloat(i);
    await timer(200);
    var thecanvas = document.createElement("canvas");
    var context = thecanvas.getContext("2d");
    context.drawImage(video, 0, 0, 250, 200);
    var dataURL = thecanvas.toDataURL();
    if (!isEmpty(dataURL)) {
      previousWorkingFrameData = dataURL;
    } else {
      dataURL = previousWorkingFrameData;
    }
    var img = document.createElement("img");
    img.className = "Frame";
    img.setAttribute("src", dataURL);
    img.classList.add("Animate");
    FramesLayer.appendChild(img);
    i = i + FrameStep;
    //Fix Temporary for FF
    if (duration - video.currentTime < FrameStep) {
      tempCounter++;
    }
    if (tempCounter >= 2) {
      break;
    }
  }
}

seek.addEventListener("input", skipAhead);
volume.addEventListener("input", updateVolume);
volumeButton.addEventListener("click", toggleMute);
fullscreenButton.addEventListener("click", toggleFullScreen);
videoContainer.addEventListener("fullscreenchange", updateFullscreenButton);
pipButton.addEventListener("click", togglePip);

document.addEventListener("DOMContentLoaded", () => {
  if (!("pictureInPictureEnabled" in document)) {
    pipButton.classList.add("hidden");
  }
});
document.addEventListener("keyup", keyboardShortcuts);

const isEmpty = (dataURL) => {
  var invalidUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=";
  if (dataURL === invalidUrl) return true;
  return false;
};

function generateTimePoints(videoDuration, interval) {
  const timePoints = [];
  let currentTime = 0;

  while (currentTime <= videoDuration) {
    timePoints.push(currentTime);
    currentTime;
    currentTime += interval;
  }

  return timePoints;
}

function getTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function updateTimeline(timePoints) {
  progressBar.innerHTML = "";
  let timeInseconds;
  timePoints.forEach((time) => {
    const timePointElement = document.createElement("div");
    timePointElement.classList.add("time-point");
    let actualTime = getTime(time);
    timePointElement.textContent = actualTime;
    timePointElement.style.color = "white";
    timePointElement.style.position = "absolute";
    let time1 = actualTime.split(":")[0];
    let time2 = actualTime.split(":")[1];
    if (time1 == "0") {
      timeInseconds = time2;
    } else {
      //convert into  seconds
      timeInseconds = +time1 * 60 + +time2;
    }
    let position = (timeInseconds / 100) * 100;
    if (position == 0) position = 1;
    timePointElement.style.left = Math.round(position) + "%";
    timePointElement.style.fontSize = "10px";
    progressBar.insertAdjacentElement("beforeend", timePointElement);
  });
}

let isDragging = false;
let offsetX = 0;

timeMarker.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - timeMarker.getBoundingClientRect().left;
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const containerRect = progressBar.getBoundingClientRect();

    // Bound the marker's position to stay within the timeline's width
    let newPosition = e.clientX - containerRect.left - offsetX;
    newPosition = Math.max(
      0,
      Math.min(newPosition, containerRect.width - timeMarker.offsetWidth)
    );

    // Update the seek input value and trigger the input event

    let allowedMovement = Math.round(timeLineDuration + 2);
    let Percentage = (newPosition / containerRect.width) * 100;

    // Calculate the percentage of the drag position within the container

    if (Percentage <= allowedMovement) {
      timeMarker.style.left = `${newPosition}px`;
      let value = (Percentage / 100) * 100;
      seek.value = value;

      if (value < timeLineDuration) video.currentTime = value;
      if (value < timeLineDuration) audioPlayer.currentTime = value;
    }
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

let uploadedFile = document.getElementById("files");
// function for getting files and setting it source

async function handleFileChange(pfile) {
  showLoading();
  let file;
  if (file) {
    file = pfile;
  } else {
    file = uploadedFile.files[0];
  }
  stopLoading();
  if (file) {
    // Check the MIME type to determine if it's an audio or video file
    if (file.type.startsWith("audio/")) {
      audioFilesContainer.innerHTML = "";
      audioPlayer.src = await createBlobUrl(file);
      audioPlayer.load();
      audioPlayer.pause();
      var fileName = file.name;
      var html = `
      <div class="audioFiles">${fileName}</div>
      `;
      audioFilesContainer.insertAdjacentHTML("beforeend", html);
      document
        .querySelector(".audioFiles")
        .addEventListener("click", (event) => {
          event.target.classList.add("selectedFile");
          if (video.duration > 0) {
            document
              .querySelector(".videoFiles")
              .classList.remove("selectedFile");
          }
        });
    } else if (file.type.startsWith("video/")) {
      videoFilesContainer.innerHTML = "";
      videoSrc.src = await createBlobUrl(file);
      video.load();
      video.pause();
      var fileName = file.name;
      var html = `
      <div class= "videoFiles">${fileName}</div>`;
      videoFilesContainer.insertAdjacentHTML("beforeend", html);
      document
        .querySelector(".videoFiles")
        .addEventListener("click", (event) => {
          event.target.classList.add("selectedFile");
          if (audioPlayer.duration > 0) {
            document
              .querySelector(".audioFiles")
              .classList.remove("selectedFile");
          }
        });
    } else if (file.type.startsWith("image/gif")) {
      videoFilesContainer.innerHTML = "";
      let fileName = "output.mp4";
      ffmpeg.FS("writeFile", "input.gif", await fetchFile(file));
      const command = `-i input.gif output.mp4`;
      await ffmpeg.run(...command.split(" "));
      const outputData = ffmpeg.FS("readFile", fileName);
      const outputBlob = new Blob([outputData.buffer], { type: "video/mp4" });
      var newUrl = await createBlobUrl(outputBlob);
      videoSrc.src = newUrl;
      video.load();
      video.play();
      var fName = file.name;
      var html = `
      <div class= "videoFiles">${fName}</div>`;
      videoFilesContainer.insertAdjacentHTML("beforeend", html);
      document
        .querySelector(".videoFiles")
        .addEventListener("click", (event) => {
          event.target.classList.add("selectedFile");
          if (audioPlayer.duration > 0) {
            document
              .querySelector(".audioFiles")
              .classList.remove("selectedFile");
          }
        });
    }
  }
  mainContainer.style.display = "flex";
}

function createBlobUrl(videoFile) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = function () {
      const arrayBuffer = fileReader.result;
      const blob = new Blob([arrayBuffer], { type: videoFile.type });
      const blobUrl = URL.createObjectURL(blob);
      resolve(blobUrl);
    };

    fileReader.onerror = function () {
      reject(new Error("Failed to read video file"));
    };

    fileReader.readAsArrayBuffer(videoFile);
  });
}

function pixelToRange(px, min_range, max_range) {
  if (px < 0) {
    px = 0;
  } else if (px > 100) {
    // Assuming your slider's max value is 100
    px = 100;
  }

  let new_value = ((px - 0) * (max_range - min_range)) / (100 - 0) + min_range;
  return new_value;
}

function openModal() {
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}

async function Trim() {
  let time = seek.value;
  let fileEle = document.querySelector(".selectedFile");
  let fileName = fileEle.textContent;
  type = fileName.split(".")[1];

  if (fileEle.classList.contains("videoFiles")) {
    let videoUrl = await videoSrc.src;
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const inputFile = new File([blob], "input." + type, {
      type: blob.type,
      lastModified: Date.now(),
    });
    const startDuration = "00:00:00";
    const endDuration = secondsToHHMMSS(time);
    const outputFile = "output." + type;
    ffmpeg.FS("writeFile", "input." + type, await fetchFile(inputFile));
    const command = `-i input.${type} -ss ${startDuration} -to ${endDuration} -c copy ${outputFile}`;
    await ffmpeg.run(...command.split(" "));
    const outputData = ffmpeg.FS("readFile", outputFile);
    const outputBlob = new Blob([outputData.buffer], { type: "video/mp4" });
    var newUrl = await createBlobUrl(outputBlob);
    videoSrc.src = newUrl;
    video.load();
    ffmpeg.FS("unlink", `input.` + type);
    ffmpeg.FS("unlink", outputFile);
    video.addEventListener("loadedmetadata", function () {
      video.play();
    });
  } else {
    let audioUrl = await audioPlayer.src;
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    const inputFile = new File([blob], "input." + type, {
      type: blob.type,
      lastModified: Date.now(),
    });
    const startDuration = "00:00:00";
    const endDuration = secondsToHHMMSS(time);
    const outputFile = "output." + type;
    ffmpeg.FS("writeFile", "input." + type, await fetchFile(inputFile));
    const command = `-i input.${type} -ss ${startDuration} -to ${endDuration} -c copy ${outputFile}`;
    await ffmpeg.run(...command.split(" "));
    const outputData = ffmpeg.FS("readFile", outputFile);
    const outputBlob = new Blob([outputData.buffer], { type: "mp3/wav/mpeg" });
    var newUrl = await createBlobUrl(outputBlob);
    audioPlayer.src = newUrl;
    audioPlayer.load();
    ffmpeg.FS("unlink", `input.` + type);
    ffmpeg.FS("unlink", outputFile);
    audio.addEventListener("loadedmetadata", function () {
      audio.play();
    });
  }
}

function fetchFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(new Uint8Array(event.target.result));
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
}

function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = secs.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

async function addAudioToVideo(videoBlobUrl, audioBlobUrl) {
  const response = await fetch(videoBlobUrl);
  const videoBlob = await response.blob();
  let videoDuration = video.duration;

  let outputFileName = `output.mp4`;
  const videoData = new Uint8Array(await videoBlob.arrayBuffer());
  ffmpeg.FS("writeFile", "input_video.mp4", videoData);

  const responseAudio = await fetch(audioBlobUrl);
  const audioBlob = await responseAudio.blob();

  const audioData = new Uint8Array(await audioBlob.arrayBuffer());
  ffmpeg.FS("writeFile", "input_audio.mp3", audioData);

  // Combine video and audio
  const command = `-i input_video.mp4 -i input_audio.mp3 -map 0:v -map 1:a -c:v copy -shortest ${outputFileName}`;
  await ffmpeg.run(...command.split(" "));

  // Read the output video file
  const outputData = ffmpeg.FS("readFile", outputFileName);

  // Clean up FFmpeg resources
  ffmpeg.FS("unlink", "input_video.mp4");
  ffmpeg.FS("unlink", "input_audio.mp3");
  ffmpeg.FS("unlink", outputFileName);

  const outputBlob = new Blob([outputData.buffer], { type: "video/mp4" });
  const blobUrl = await createBlobUrl(outputBlob);
  return blobUrl;
}

// for adding music to videos
async function addMusic() {
  let videoUrl = videoSrc.src;
  let audioUrl = audioPlayer.src;
  let outputUrl;
  if (audioUrl) {
    outputUrl = await addAudioToVideo(videoUrl, audioUrl);
  } else {
    outputUrl = videoUrl;
  }
  videoSrc.src = outputUrl;
  video.load();
  let a = document.createElement("a");
  a.href = outputUrl;
  a.download = "safevideokit.mp4";
  a.click();
  setTimeout(() => {
    if (lang === "en") {
      window.location.href = `/download?tool=${pageTool}`;
    } else {
      window.location.href = `/${lang}/download?tool=${pageTool}`;
    }
  }, 500);
}

// Add eventlisteners here
trimBtn.addEventListener("click", () => {
  Trim();
});
downloadBtn.addEventListener("click", async () => {
  await addMusic();
});
uploadBtn.addEventListener("click", () => {
  uploadedFile.click();
  closeModal();
});
playButton.addEventListener("click", togglePlay);
video.addEventListener("play", updatePlayButton);
video.addEventListener("pause", updatePlayButton);
video.addEventListener("load", updatePlayButton);
audioPlayer.addEventListener("load", updatePlayButton);
audioPlayer.addEventListener("play", updatePlayButton);
audioPlayer.addEventListener("pause", updatePlayButton);
video.addEventListener("loadedmetadata", initializeTimeLine);
audioPlayer.addEventListener("loadedmetadata", initializeTimeLine);
video.addEventListener("timeupdate", updateTimeElapsed);
audioPlayer.addEventListener("timeupdate", updateTimeElapsed);
video.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("timeupdate", updateProgress);
video.addEventListener("volumechange", updateVolumeIcon);
video.addEventListener("click", togglePlay);
video.addEventListener("click", animatePlayback);
uploadedFile.addEventListener("change", handleFileChange);
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

showDropDown.addEventListener("click", (event) => {
  event.stopPropagation();
  addScripts();
  if (dropDown.style.display !== "none") {
    dropDown.style.display = "none";
    icon.classList.remove("fa-angle-up");
    icon.classList.add("fa-angle-down");
  } else {
    dropDown.style.display = "block";
    icon.classList.remove("fa-angle-down");
    icon.classList.add("fa-angle-up");
  }
});
