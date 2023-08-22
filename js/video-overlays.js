const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
const { createFFmpeg, fetchFile } = FFmpeg;
var ffmpeg;
var ProgressBar = document.querySelector('.ProgressBar')
var VideoSourceFile = null
var Workspace = document.querySelector('.Workspace')
var UploadButton = document.querySelector('.Button')
var Spinner = document.querySelector('.Spinner')
var LandingText = document.querySelector('.Landingtext')
var InputButtonContainer = document.querySelector('.Button')
var ActualSourceurl = null
let SubSourceurl = null;
var sourceBuffer = null
let SubSourceBuffer = null;
let type = null;
let PlayButton = document.querySelector(".PlayButton")
let playIcon = document.querySelector(".PlayIcon");
let seekSlider = document.getElementById("seekSlider");
let videoTime = document.querySelector(".video-time")
let yourText = document.querySelector("#yourText")
let colorPicker = document.querySelector("#colorPicker");
let txtcolorPicker = document.querySelector("#txtcolorPicker")
let innerBgBox = document.querySelector(".innerBgBox")
let noColorSelect = document.querySelector(".noColorSelect")
let ColorSelect = document.querySelector(".ColorSelect")
let innerColorBox = document.querySelector(".innerColorBox")
let fontSizeSelect = document.querySelector("#font-size-select")
let fontNameSelect = document.querySelector("#font-name-select")
const colorBoxes = document.querySelectorAll('.txtColorBox');
let bgColorBoxes = document.querySelectorAll('.bgColorBox');
const images = document.querySelectorAll('.element');
const menuItems = document.querySelectorAll('.menu_item');
let textOverlayOptions = document.querySelector(".textOverlayOptions")
let elementOverlayoptions = document.querySelector(".elementOverlayoptions")
let addMedia = document.querySelector("#add-media")
let mediaUpload = document.querySelector(".media-upload")
let addAudio = document.querySelector("#add-audio")
let audioUpload = document.querySelector(".audio-upload")
let addFilters = document.querySelector("#add-filters")
let videoFiltersOptions = document.querySelector(".video-filters-options")

let filterContainers = document.querySelectorAll('.filter-container');

const audioPlayer = document.getElementById("audioPlayer");
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
const videoSrc = document.getElementById("video");
let videoFilesContainer = document.querySelector(".video-files-container");
let audioFilesContainer = document.querySelector(".audio-files-container");
let timeLineDuration = 0;
const modal = document.getElementById("customModal");
const closeModalBtn = document.getElementById("closeModalBtn");
let downloadBtn = document.querySelector(".downloadBtn");
let mainContainer = document.querySelector(".containerMan");
const chooseFile = document.querySelector(".Button");

menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', (e) => {
        menuItems.forEach(item => {
            const tab = item.querySelector('.tab');
            tab.classList.remove('tabClicked');
            item.querySelector(".tab-label").style.color = "#7F7F81";
            const svgPath = item.querySelector('svg rect');
            svgPath.setAttribute('fill', '#C8CBD4');
        });
        const tab = e.currentTarget.querySelector('.tab');
        tab.classList.add('tabClicked');
        e.currentTarget.querySelector(".tab-label").style.color = "#0098FD";
        const svgPath = tab.querySelector('svg rect');
        svgPath.setAttribute('fill', '#6FB5F5');
    });
});

document.getElementById("textMenuItem").addEventListener("click", () => {
    textOverlayOptions.classList.remove("d-none");
    elementOverlayoptions.classList.add("d-none");
    mediaUpload.classList.add("d-none")
    audioUpload.classList.add("d-none")
    videoFiltersOptions.classList.add("d-none")
});
document.getElementById("elementMenuItem").addEventListener("click", (e) => {
    textOverlayOptions.classList.add("d-none");
    elementOverlayoptions.classList.remove("d-none");
    mediaUpload.classList.add("d-none")
    audioUpload.classList.add("d-none")
    videoFiltersOptions.classList.add("d-none")
});
addMedia.addEventListener("click", (e) => {
    elementOverlayoptions.classList.add("d-none");
    textOverlayOptions.classList.add("d-none");
    mediaUpload.classList.remove("d-none")
    audioUpload.classList.add("d-none")
    videoFiltersOptions.classList.add("d-none")
});
addAudio.addEventListener("click", (e) => {
    audioUpload.classList.remove("d-none")
    mediaUpload.classList.add("d-none")
    elementOverlayoptions.classList.add("d-none");
    textOverlayOptions.classList.add("d-none");
    videoFiltersOptions.classList.add("d-none")
});
addFilters.addEventListener("click", (e) => {
    videoFiltersOptions.classList.remove("d-none")
    audioUpload.classList.add("d-none")
    mediaUpload.classList.add("d-none")
    elementOverlayoptions.classList.add("d-none");
    textOverlayOptions.classList.add("d-none");
});
function toggleColorPicker() {
    colorPicker.style.display = colorPicker.style.display === "none" ? "block" : "none";
}
function toggleTxtColorPicker() {
    txtcolorPicker.style.display = txtcolorPicker.style.display === "none" ? "block" : "none";
}
// Drag and Drop Feature
UploadButton.addEventListener("dragover", function (evt) {
    evt.preventDefault();
});
UploadButton.addEventListener("dragenter", function (evt) {
    evt.preventDefault();
})
UploadButton.addEventListener("drop", function (evt) {
    evt.preventDefault();
    let tempInput = document.getElementById("files");
    tempInput.files = evt.dataTransfer.files;
    let tempType = (tempInput.files[0].name).split(".");
    if (tempType[tempType.length - 1] == "mp4") {
        let event = new Event('change');
        tempInput.dispatchEvent(event);
    }
    else {
        document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload a .mp4 file.";
        document.getElementById("ErrorBox").style.display = "block";
        Landing.style.display = 'none'
        InputButtonContainer.style.display = 'none'
        Workspace.style.display = 'none'
    }
});
var VFileSrc = document.querySelector('.VideoFile video');
const gdrive = document.querySelector('#filepicker')
const getFile = (file) => {
    const input = {
        files: [file],
    }
    get_video_source_from_input(input)
}
const showLoader = () => {
    LandingText.innerText = 'Please wait,processing your video'
    Spinner.style.display = 'inherit'
    UploadButton.style.display = 'none'
    document.querySelector(".Landing").style.display = "flex"
    document.querySelector(".Landing").style.width = "100%"
    document.querySelector(".Landing").style.justifyContent = "center"
}
const videoOverlayLoader = () => {
    document.querySelector(".download-modal-container").style.display = "flex"
}
const closeLoader = () => { }
const mimeTypes = 'video/mp4'
const filemimes = ['.mp4']
gdrive.addEventListener(
    'click',
    (getFile, mimeTypes, showLoader, closeLoader) => {
        const data = loadPicker()
    }
)
const getDropBoxFile = (file) => {
    const input = {
        files: [file],
    }
    console.stdlog(file)
    console.stdlog(input)
    console.stdlog(input.files[0])
    get_video_source_from_input(input)
}
const dropbox = document.getElementById('dropbox')
dropbox.addEventListener(
    'click',
    async (getDropBoxFile, showLoader, closeLoader) => {
        const getFile = chooseFromDropbox()
    }
)
let InputFormat = "mp4"
let outputFormat = "mp4"
const convertVideo = async (ffmpeg, inputFileName, emojiFileName, vfCommand, vfElementCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName) => {
    let filterArg = ""
    if (videoFilter) {
        filterArg = videoFilter + ","
    } else {
        filterArg = ""
    }
    const textOverlayFilter = `[0:v]${filterArg}drawtext=text='${textToAdd}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}`;
    if (emojiFileName) {
        const emojiWidth = 250;
        const emojiHeight = 250;
        const ffmpegCommand = [
            "-i", inputFileName,
            "-i", emojiFileName,
            "-filter_complex", `[1:v]scale=${emojiWidth}:${emojiHeight}[emoji_scaled];[0:v][emoji_scaled]overlay=${vfElementCommand}[temp];[temp]${filterArg}drawtext=text='${textToAdd}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}[out]`,
            "-map", "[out]",
            "-map", "0:a",
            "-c:a", "copy",
            "-preset", "ultrafast",
            outputFileName
        ];
        await ffmpeg.run(...ffmpegCommand);
    }
    else {
        const command = [
            '-i', inputFileName,
            '-filter_complex', textOverlayFilter,
            '-c:a', 'copy',
            '-preset', 'ultrafast',
            outputFileName
        ];
        await ffmpeg.run(...command);
    }
};
let vfCommand;
let vfElementCommand;
let x = 0; // left
let y = 0; // top
let output;
let blob;
let isDragging = false;
let offsetX, offsetY;
let elementOverlay = document.querySelector("#element-overlay");
let textOverlay = document.getElementById('text-overlay');
let video = document.getElementById('VDemo');
let offsetXTextOverlay, offsetYTextOverlay;
let offsetXElementOverlay, offsetYElementOverlay;
let isTextOverlayDragging = false;
let isElementOverlayDragging = false;
async function initializeTimeLine() {
    let audioDuration = audioPlayer.duration;
    if (isNaN(audioDuration)) audioDuration = 0;
    let videoDuration = video.duration;
    if (isNaN(videoDuration)) videoDuration = 0;
    timeLineDuration = audioDuration > videoDuration ? audioDuration : videoDuration;
    const time = formatTimeToSeconds(timeLineDuration);
    if (timeLineDuration <= 5) {
        seek.setAttribute("max", timeLineDuration);
        duration.innerText = `${time.minutes}:${time.seconds}`;
        duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
        let intervals = timeLineDuration;
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
        let dynamicInterval = Math.max(Math.floor(intervals / 10) * 10, 5);
        let timePoints = generateTimePoints(time.seconds, dynamicInterval);
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
function formatTimeToSeconds(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
    return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
    };
}
function updateTimeElapsed() {
    let audioDuration = audioPlayer.duration;
    if (isNaN(audioDuration)) {
        audioDuration = 0;
    }
    let videoDuration = video.duration;
    videoDuration = video.duration;

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
function updateTimeline(timePoints) {
    console.log(timePoints);
    progressBar.innerHTML = "";
    let timeInseconds;
    timePoints.forEach((time) => {
        const timePointElement = document.createElement("div");
        timePointElement.classList.add("time-point");
        let actualTime = getTime(time);
        timePointElement.textContent = actualTime;
        timePointElement.style.color = "black";
        timePointElement.style.position = "absolute";
        let time1 = actualTime.split(":")[0];
        let time2 = actualTime.split(":")[1];
        if (time1 == "0") {
            timeInseconds = time2;
        } else {
            timeInseconds = +time1 * 60 + time2;
        }
        let position = (timeInseconds / 100) * 100;
        if (position == 0) position = 1;
        timePointElement.style.left = Math.round(position) + "%";
        timePointElement.style.fontSize = "12px";
        progressBar.insertAdjacentElement("beforeend", timePointElement);
    });
}
function getTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
function initializeTextOverlay() {
    const containerWidth = video.offsetWidth;
    const containerHeight = video.offsetHeight;
    const textWidth = textOverlay.offsetWidth;
    const textHeight = textOverlay.offsetHeight;
    const initialX = (containerWidth - textWidth) / 2;
    const initialY = (containerHeight - textHeight) / 2;
    textOverlay.style.left = `${initialX}px`;
    textOverlay.style.top = `${initialY}px`;
    elementOverlay.style.left = `${initialX}px`;
    elementOverlay.style.top = `${initialY}px`;
    textOverlay.addEventListener('mousedown', handleMouseDown);
    elementOverlay.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', function (event) {
        if (!textOverlay.contains(event.target)) {
            textOverlay.style.border = 'none';
            textOverlay.classList.add('without-dots');
        }
        if (!elementOverlay.contains(event.target)) {
            elementOverlay.style.border = 'none';
        }
    });
}
function handleMouseDown(e) {
    if (e.target === textOverlay) {
        isTextOverlayDragging = true;
        textOverlay.style.border = '2px solid #0098FD';
        textOverlay.classList.remove('without-dots');
        offsetXTextOverlay = e.clientX - parseFloat(textOverlay.style.left);
        offsetYTextOverlay = e.clientY - parseFloat(textOverlay.style.top);
        // textOverlay.style.transition = 'none';
        // e.preventDefault();
    }
    if (e.target === elementOverlay) {
        isElementOverlayDragging = true;
        elementOverlay.style.border = '2px solid #0098FD';
        offsetXElementOverlay = e.clientX - parseFloat(elementOverlay.style.left);
        offsetYElementOverlay = e.clientY - parseFloat(elementOverlay.style.top);
        elementOverlay.style.transition = 'none';
        e.preventDefault();
    }
}
function handleMouseMove(e) {
    if (isTextOverlayDragging) {
        const x = e.clientX - offsetXTextOverlay;
        const y = e.clientY - offsetYTextOverlay;

        // Check if the mouse is outside the video bounds
        const videoRect = video.getBoundingClientRect();
        if (
            e.clientX < videoRect.left ||
            e.clientX > videoRect.right ||
            e.clientY < videoRect.top ||
            e.clientY > videoRect.bottom
        ) {
            // Hide the text overlay
            textOverlay.style.display = 'none';
        } else {
            // Show the text overlay and update its position
            textOverlay.style.display = 'block';
            updateOverlayPosition(x, y, textOverlay);
            vfCommand = `x=${x / video.offsetWidth}*W:y=${y / video.offsetHeight}*H`;
        }
    }

    if (isElementOverlayDragging) {
        const x = e.clientX - offsetXElementOverlay;
        const y = e.clientY - offsetYElementOverlay;

        // Check if the mouse is outside the video bounds
        const videoRect = video.getBoundingClientRect();
        if (
            e.clientX < videoRect.left ||
            e.clientX > videoRect.right ||
            e.clientY < videoRect.top ||
            e.clientY > videoRect.bottom
        ) {
            // Hide the element overlay
            elementOverlay.style.display = 'none';
        } else {
            // Show the element overlay and update its position
            elementOverlay.style.display = 'block';
            updateOverlayPosition(x, y, elementOverlay);
            vfElementCommand = `x=${x / video.offsetWidth}*W:y=${y / video.offsetHeight}*H`;
        }
    }
}
function handleMouseUp() {
    if (isTextOverlayDragging) {
        isTextOverlayDragging = false;
        textOverlay.style.transition = '';
    }
    if (isElementOverlayDragging) {
        isElementOverlayDragging = false;
        elementOverlay.style.transition = '';
    }
}
async function updateOverlayPosition(x, y, overlay) {
    const minX = 0;
    const maxX = video.offsetWidth - overlay.offsetWidth;
    const minY = 0;
    const maxY = video.offsetHeight - overlay.offsetHeight;
    const constrainedX = Math.min(Math.max(x, minX), maxX);
    const constrainedY = Math.min(Math.max(y, minY), maxY);
    overlay.style.left = `${constrainedX}px`;
    overlay.style.top = `${constrainedY}px`;
}
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}
let videoFilter = ""
async function applyVideoFilter(ffmpeg, inputFileName, outputFileName) {
    videoOverlayLoader();
    const filterArg = videoFilter ? ["-vf", videoFilter] : []
    await ffmpeg.run(
        "-i", inputFileName,
        ...filterArg,
        "-preset", "ultrafast",
        outputFileName
    );
    output = ffmpeg.FS("readFile", outputFileName);
    blob = new Blob([output.buffer], { type: `video/mp4` });
    video.src = URL.createObjectURL(blob);
    document.querySelector(".download-modal-container").style.display = "none";
}
const get_video_source_from_input = async (input) => {
    showLoader();
    document.querySelector(".toaster").style.display = "none"
    let VideoSourceFile = input.files[0];
    try {
        if (VideoSourceFile) {
            var fileName = VideoSourceFile.name
            var html = `
              <div class="videoFiles">${fileName}</div>`;
            videoFilesContainer.insertAdjacentHTML("beforeend", html);
            const ffmpeg = createFFmpeg({ log: true });
            await ffmpeg.load();
            const reader = new FileReader();
            reader.readAsArrayBuffer(VideoSourceFile);

            let fontFilePath = "/path/to/AlfaSlabOne-Regular.ttf";
            let textToAdd = "Your text here...";
            yourText.value = textToAdd;
            let backgroundColor = "black@0";
            let textColor = "white";
            let textSize = "50";
            textOverlay.style.border = '2px solid #0098FD';
            textOverlay.style.fontFamily = 'Alfa Slab One';
            textOverlay.style.fontSize = textSize - 22 + 'px'
            reader.addEventListener("load", async function () {
                const inputBuffer = reader.result;
                const inputFormat = VideoSourceFile.name.split(".").pop();
                const inputFileName = `input.${inputFormat}`;
                const outputFileName = `output.${inputFormat}`;
                await ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
                ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));
                let emojiFileName = false
                images.forEach((image) => {
                    image.addEventListener("click", async (e) => {
                        videoOverlayLoader()
                        const emojiPath = e.target.src;
                        emojiFileName = emojiPath.split("/").pop();
                        elementOverlay.src = emojiPath
                        await ffmpeg.FS("writeFile", emojiFileName, await fetchFile(emojiPath));
                        document.querySelector(".download-modal-container").style.display = "none"
                    })
                })
                vfCommand = `x=${x}:y=${y}`
                vfElementCommand = `x=${x}:y=${y}`

                filterContainers.forEach((container) => {
                    container.addEventListener("click", async (e) => {
                        const clickedFilterId = e.currentTarget.querySelector('.filter-box').id;
                        if (clickedFilterId === "sepia") {
                            videoFilter = "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131";
                        }
                        else if (clickedFilterId === "invert") {
                            videoFilter = "lutrgb=r=negval:g=negval:b=negval";
                        }
                        else if (clickedFilterId === "blur") {
                            videoFilter = "boxblur=10:1";
                        }
                        else if (clickedFilterId === "pixelate") {
                            videoFilter = "scale=iw/10:ih/10:flags=neighbor";
                        }
                        else if (clickedFilterId === "contrast") {
                            videoFilter = "eq=contrast=1.5"
                        }
                        else if (clickedFilterId === "red") {
                            videoFilter = "colorchannelmixer=rr=1:gg=0:bb=0";
                        }
                        else if (clickedFilterId === "blue") {
                            videoFilter = "colorchannelmixer=rr=0:gg=0:bb=1";
                        }
                        else if (clickedFilterId === "brightness") {
                            const brightnessLevel = 0.1;
                            const filter = `eq=brightness=${brightnessLevel}`;
                            videoFilter = filter
                        }
                        else if (clickedFilterId === "calmII") {
                            videoFilter = "eq=saturation=1.5"
                        }
                        else if (clickedFilterId === "grayscale") {
                            videoFilter = "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3";
                        }
                        else if (clickedFilterId === "hue") {
                            videoFilter = "hue=h=90:s=1"
                        }
                        else if (clickedFilterId === "noise") {
                            videoFilter = "noise=alls=100:allf=t+u"
                        }
                        else if (clickedFilterId === "painting") {
                            videoFilter = "edgedetect=mode=colormix:high=0"
                        }
                        else if (clickedFilterId === "vintage") {
                            videoFilter = "curves=r='0/0.11 .42/.51 1/0.95':g='0/0 0.50/0.48 1/1':b='0/0.22 .49/.44 1/0.8'"
                        }
                        else if (clickedFilterId === "emboss") {
                            videoFilter = "format=gray,geq=lum_expr='(p(X,Y)+(256-p(X-4,Y-4)))/2'"
                        }
                        else if (clickedFilterId === "sharpen") {
                            videoFilter = 'convolution="0 -1 0 -1 5 -1 0 -1 0:0 -1 0 -1 5 -1 0 -1 0:0 -1 0 -1 5 -1 0 -1 0:0 -1 0 -1 5 -1 0 -1 0'
                        }
                        else if (clickedFilterId === "rgb") {
                            videoFilter = "geq=r='X/W*r(X,Y)':g='(1-X/W)*g(X,Y)':b='(H-Y)/H*b(X,Y)'"
                        }
                        else {
                            videoFilter = "";
                        }
                        await applyVideoFilter(ffmpeg, inputFileName, outputFileName);
                    });
                })

                await ffmpeg.run(
                    "-i", inputFileName,
                    "-preset", "ultrafast",
                    outputFileName
                )
                yourText.addEventListener('change', async (e) => {
                    videoOverlayLoader()
                    textToAdd = e.target.value
                    textOverlay.innerText = textToAdd
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                textOverlay.addEventListener('input', async (e) => {
                    textToAdd = textOverlay.innerText
                    yourText.value = textOverlay.innerText
                });
                fontNameSelect.addEventListener('change', async (e) => {
                    videoOverlayLoader()
                    const selectedOption = fontNameSelect.options[fontNameSelect.selectedIndex];
                    const selectedText = selectedOption.innerText;
                    textOverlay.style.fontFamily = selectedText;

                    WebFont.load({
                        google: {
                            families: [`${selectedText}:200,300,400,500,600,700,800&display=swap`]
                        },
                        active: async () => {
                            // Once the font is loaded, you can perform additional actions if needed
                            fontFilePath = e.target.value;
                            ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
                        }
                    });
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                fontSizeSelect.addEventListener('change', async (e) => {
                    videoOverlayLoader()
                    textSize = e.target.value
                    const adjustedFontSize = parseInt(e.target.value) - 22;
                    textOverlay.style.fontSize = `${adjustedFontSize}px`;
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                txtcolorPicker.addEventListener("change", async (e) => {
                    videoOverlayLoader()
                    textColor = e.target.value
                    textOverlay.style.color = textColor
                    ColorSelect.style.background = "none"
                    innerColorBox.style.backgroundColor = textColor
                    txtcolorPicker.style.display = "block"
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                colorBoxes.forEach(colorBox => {
                    colorBox.addEventListener('click', async (event) => {
                        const dataColor = event.target.getAttribute('data-color');
                        innerColorBox.style.backgroundColor = dataColor
                        textOverlay.style.color = dataColor
                        videoOverlayLoader()
                        textColor = dataColor
                        ColorSelect.style.background = "none"
                        txtcolorPicker.style.display = "block"
                        document.querySelector(".download-modal-container").style.display = "none"
                    });
                });
                colorPicker.addEventListener("change", async (e) => {
                    videoOverlayLoader()
                    backgroundColor = e.target.value
                    textOverlay.style.backgroundColor = backgroundColor
                    noColorSelect.style.background = "none"
                    innerBgBox.style.backgroundColor = backgroundColor
                    colorPicker.style.display = "block"
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                bgColorBoxes.forEach(colorBox => {
                    colorBox.addEventListener('click', async (event) => {
                        videoOverlayLoader()
                        const dataColorValue = event.currentTarget.getAttribute('data-color-value');
                        if (dataColorValue == "black@0") {
                            noColorSelect.style.background = "url(/transparent-color-oval.svg)"
                            textOverlay.style.backgroundColor = "transparent"
                        } else {
                            noColorSelect.style.background = "none"
                            textOverlay.style.backgroundColor = dataColorValue
                        }
                        backgroundColor = dataColorValue
                        innerBgBox.style.backgroundColor = dataColorValue
                        colorPicker.style.display = "block"
                        document.querySelector(".download-modal-container").style.display = "none"

                    });
                });
                output = ffmpeg.FS("readFile", outputFileName);
                blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                const videoElement = document.querySelector('#VDemo');
                videoElement.controls = false;
                videoElement.addEventListener("timeupdate", () => {
                    seekSlider.value = videoElement.currentTime;
                    updateDurationText();
                    updateTimeElapsed()
                    updateProgress()
                });
                seekSlider.addEventListener("input", () => {
                    videoElement.currentTime = seekSlider.value;
                    updateDurationText();
                });
                function updateDurationText() {
                    const currentTime = formatTime(videoElement.currentTime);
                    const totalDuration = formatTime(videoElement.duration);
                    videoTime.innerHTML = `${currentTime}&nbsp;/&nbsp;<span style="color:#5c647e">${totalDuration}</span>`;
                }
                videoElement.addEventListener('loadedmetadata', () => {
                    initializeTextOverlay()
                    initializeTimeLine()
                    updateDurationText();
                    seekSlider.max = videoElement.duration;
                    const seconds = parseInt(videoElement.duration);
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    let formattedDuration
                    if (minutes == 0) {
                        formattedDuration = `${remainingSeconds} seconds`;
                    } else {
                        formattedDuration = `${minutes} minute ${remainingSeconds} seconds`;
                    }
                    // document.querySelector(".finalOuputText").innerHTML = `The final output will be <p class="videoTime" style="color: #fff !important;">${formattedDuration}</p>`
                });
                function togglePlayPause() {
                    if (videoElement.paused) {
                        videoElement.play();
                        playIcon.style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/pause.svg')";
                    } else {
                        videoElement.pause();
                        playIcon.style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/play.svg')";
                    }
                }
                PlayButton.addEventListener("click", togglePlayPause);
                videoElement.addEventListener('ended', () => {
                    document.querySelector(".PlayIcon").style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/play.svg')";
                });
                videoElement.src = URL.createObjectURL(blob);
                const videoEditor = document.querySelector('.videoEditor');
                videoEditor.style.display = "block"
                document.querySelector("#exportBtn").addEventListener("click", (async (e) => {
                    videoOverlayLoader()
                    await convertVideo(ffmpeg, inputFileName, emojiFileName, vfCommand, vfElementCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    let a = document.createElement("a")
                    a.href = URL.createObjectURL(blob)
                    a.download = `safevideokit-loop-video.mp4`
                    document.body.appendChild(a)
                    a.click()
                    document.querySelector(".download-modal-container").style.display = "none"
                }))
            })

        }
    } catch (error) {
        console.error(error);
    }
}
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `;
}
const showDropDown = document.querySelector('.file-pick-dropdown')
const icon = document.querySelector('.arrow-sign')
const dropDown = document.querySelector('.file-picker-dropdown')
showDropDown.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    addScripts()
    if (dropDown.style.display !== 'none') {
        dropDown.style.display = 'none'
        icon.classList.remove('fa-angle-up')
        icon.classList.add('fa-angle-down')
    } else {
        dropDown.style.display = 'block'
        icon.classList.remove('fa-angle-down')
        icon.classList.add('fa-angle-up')
    }
})

