let { createFFmpeg, fetchFile } = FFmpeg;
let ffmpeg = createFFmpeg({ log: true });
ffmpeg.load();
let getScript = document.currentScript
let pageTool = getScript.dataset.tool
let fileName = getScript.dataset.filename
let folderName = getScript.dataset.foldername
let lang = getScript.dataset.lang
let VideoSourceFile = null
let Workspace = document.querySelector('.Workspace')
let UploadButton = document.querySelector('.Button')
let Spinner = document.querySelector('.spinner')
let LandingText = document.querySelector('.Landingtext')
let InputButtonContainer = document.querySelector('.Button')
let ActualSourceurl = null
let SubSourceurl = null;
let sourceBuffer = null
let SubSourceBuffer = null;
let type = null;
let VFileSrc = document.querySelector('.VideoFile video');
let gdrive = document.querySelector('#filepicker')
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
let colorBoxes = document.querySelectorAll('.txtColorBox');
let bgColorBoxes = document.querySelectorAll('.bgColorBox');
let images = document.querySelectorAll('.element');
let menuItems = document.querySelectorAll('.menu_item');
let textOverlayOptions = document.querySelector(".textOverlayOptions")
let elementOverlayoptions = document.querySelector(".elementOverlayoptions")
let addMedia = document.querySelector("#add-media")
let mediaUpload = document.querySelector(".media-upload")
let addAudio = document.querySelector("#add-audio")
let audioUpload = document.querySelector(".audio-upload")
let addFilters = document.querySelector("#add-filters")
let videoFiltersOptions = document.querySelector(".video-filters-options")
let filterContainers = document.querySelectorAll('.filter-container');
let addTextButton = document.querySelector(".add-text-button")
let trimBtn = document.getElementById("Trim");
let audioPlayer = document.getElementById("audioPlayer");
let timeElapsed = document.getElementById("time-elapsed");
let duration = document.getElementById("duration");
let progressBar = document.getElementById("progress-bar");
let seek = document.getElementById("seek");
let fullscreenButton = document.getElementById("fullscreen-button");
let videoContainer = document.getElementById("VContainer");
let fullscreenIcons = fullscreenButton.querySelectorAll("use");
let FramesLayer = document.querySelector(".frames");
let timeMarker = document.querySelector(".time-marker");
let timeTick = document.querySelector("time-marker-tick");
let videoFilesContainer = document.querySelector(".video-files-container");
let audioFilesContainer = document.querySelector(".audio-files-container");
let timeLineDuration = 0;
let totalTime=document.querySelector(".total-time")

//Left side bar toggle functionlity here...
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
});//Closed here... 

function toggleColorPicker() {
    colorPicker.style.display = colorPicker.style.display === "none" ? "block" : "none";
}
function toggleTxtColorPicker() {
    txtcolorPicker.style.display = txtcolorPicker.style.display === "none" ? "block" : "none";
}
// Getting File
const getFile = (file) => {
    const input = {
        files: [file],
    }
    get_video_source_from_input(input)
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
// File Upload Loader
const showLoader = () => {
    document.querySelector(".toaster").style.display = "none"
    LandingText.innerText = 'Please wait,processing your video'
    Spinner.style.display = 'inherit'
    UploadButton.style.display = 'none'
    document.querySelector(".Landing").style.display = "flex"
    document.querySelector(".Landing").style.width = "100%"
    document.querySelector(".Landing").style.justifyContent = "center"
}
const closeLoader = () => { }
// Google drive and dropbox feature
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
)//Closed

// Video Processing Operation Loader
const videoProcessingLoading = () => {
    videoElement.pause();
    audioPlayer.pause();
    playIcon.style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/play.svg')";
    document.querySelector(".download-modal-container").style.display = "flex"
}
let videoFilter = ""
let videoElement = document.querySelector('#VDemo');
let downloadButton = document.querySelector("#exportBtn");
let currentSourceObjectURL = null;
let vfCommand;
let vfElementCommand;
let x = "(w-text_w)/2";
let y = "(h-text_h)/2";
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
let InputFormat = "mp4"
let outputFormat = "mp4"
let mediaType = null
let textOverlayEnabled = null
let elementOverlayEnabled = null
const convertVideo = async (ffmpeg, inputFileName, elements, vfCommand, vfElementCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName) => {
    // let videoFilterExpersion = videoFilter ? videoFilter + "," : "";
    let elementWidth = 250
    let elementHeight = 250
    let textOverlayCommand = `[0:v]drawtext=text='${textToAdd}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}`;
    let elementOverlayCommand = `[1][0]scale2ref=oh*mdar:ih*0.2[logo][video];[video][logo]overlay=${vfElementCommand}`
    let textOverlayWithElementOverLay = `[1:v]scale=${elementWidth}:${elementHeight}[emoji_scaled];[0:v][emoji_scaled]overlay=${vfElementCommand}[temp];[temp]drawtext=text='${textToAdd}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}[out]`
    let videoOverlayCommands = ""
    if (textOverlayEnabled && elementOverlayEnabled) {
        videoOverlayCommands = textOverlayWithElementOverLay
    } else {
        if (textOverlayEnabled) {
            videoOverlayCommands = textOverlayCommand
        }
        if (elementOverlayEnabled) {
            videoOverlayCommands = elementOverlayCommand
        }
    }
    let videoEditorCommands = [
        '-i', inputFileName,
        // ...(mediaType == "audio" ? ["-i", "input_audio.mp3", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-shortest"] : []),
        ...(elementOverlayEnabled ? ["-i", elements] : []),
        ...(textOverlayEnabled || elementOverlayEnabled ? ["-filter_complex", videoOverlayCommands] : []),
        ...(textOverlayEnabled && elementOverlayEnabled ? ["-map", "[out]"] : []),
        // ...(!textOverlayEnabled && !elementOverlayEnabled ? [videoFilterExpersion ? "-vf" : "", videoFilterExpersion.replace(/,$/, "")] : []),
        '-c:a', 'copy',
        '-preset', 'ultrafast',
        outputFileName
    ];
    await ffmpeg.run(...videoEditorCommands);
};

// Video Timeline Functionlity
let isDrag = false;
let offsetx = 0;
timeMarker.addEventListener("mousedown", (e) => {
    isDrag = true;
    offsetx = e.clientX - timeMarker.getBoundingClientRect().left;
});
window.addEventListener("mousemove", (e) => {
    if (isDrag) {
        const containerRect = progressBar.getBoundingClientRect();
        let newPosition = e.clientX - containerRect.left - offsetx;
        newPosition = Math.max(
            0,
            Math.min(newPosition, containerRect.width - timeMarker.offsetWidth)
        );
        let allowedMovement = Math.round(timeLineDuration + 2);
        let Percentage = (newPosition / containerRect.width) * 100
        if (Percentage <= allowedMovement) {
            timeMarker.style.left = `${newPosition} px`;
            let value = (Percentage / 100) * 100;
            seek.value = value;

            if (value < timeLineDuration) video.currentTime = value;
            if (value < timeLineDuration) audioPlayer.currentTime = value;
        }
    }
});
window.addEventListener("mouseup", () => {
    isDrag = false;
});
async function initializeTimeLine() {
    let audioDuration = audioPlayer.duration;
    if (isNaN(audioDuration)) audioDuration = 0;
    let videoDuration = video.duration;
    if (isNaN(videoDuration)) videoDuration = 0;
    timeLineDuration = audioDuration > videoDuration ? audioDuration : videoDuration;
    const time = formatTimeToSeconds(timeLineDuration);
    if (timeLineDuration <= 5) {
        seek.setAttribute("max", timeLineDuration);
        totalTime.innerHTML = `&nbsp;&nbsp<span style="color:#000">${time.minutes}:${time.seconds}</span>`;
        totalTime.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
        let intervals = timeLineDuration;
        let timePoints = generateTimePoints(time.seconds, intervals);
        updateTimeline(timePoints);
    } else {
        seek.setAttribute("max", timeLineDuration);
        totalTime.innerHTML = `&nbsp;&nbsp<span style="color:#000">${time.minutes}:${time.seconds}</span>`;
        totalTime.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);

        let intervals = timeLineDuration / 2;
        if (intervals > 50) {
            intervals = intervals / 2;
        }
        let dynamicInterval = Math.max(Math.floor(intervals / 10) * 10, 5);
        let timePoints = generateTimePoints(timeLineDuration, dynamicInterval);
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
        videoTime.innerHTML = `${time}&nbsp;&nbsp`;
        videoTime.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
    } else {
        const time = formatTime(audioPlayer.currentTime);
        videoTime.innerHTML = `${time}&nbsp;&nbsp`;
        videoTime.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
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
    timeMarker.style.left = `${Math.floor(seekPercentage)} % `;

    if (timeLineDuration > seekPercentage) video.currentTime = seekPercentage;
    if (timeLineDuration > seekPercentage)
        audioPlayer.currentTime = seekPercentage;
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
            timeInseconds = +time1 * 60;
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
    return `${minutes}: ${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
//Closed

// Overlay Drag and Drop Functionlity
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
addTextButton.addEventListener("click", () => {
    textOverlayEnabled = true
    textOverlay.style.visibility = "visible"
    initializeTextOverlay()
})
//Closed
//Video Play / Pause
function togglePlayPause() {
    if (videoElement.paused) {
        videoElement.play();
        audioPlayer.play();
        playIcon.style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/pause.svg')";
    } else {
        videoElement.pause();
        audioPlayer.pause();
        playIcon.style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/play.svg')";
    }
}
PlayButton.addEventListener("click", togglePlayPause);

let fontFilePath = "/path/to/AlfaSlabOne-Regular.ttf";
let textToAdd = "Your text here...";
yourText.value = textToAdd;
let backgroundColor = "black@0";
let textColor = "white";
let textSize = "50";
let elements = false
const videoOverlays = async () => {
    await ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
    textOverlay.style.border = '2px solid #0098FD';
    textOverlay.style.fontFamily = 'Alfa Slab One';
    textOverlay.style.fontSize = textSize - 22 + 'px'
    vfCommand = `x=${x}:y=${y}`
    vfElementCommand = `x=0:y=0`
    yourText.addEventListener('input', async (e) => {
        videoProcessingLoading()
        textToAdd = e.target.value
        textOverlay.innerText = textToAdd
        document.querySelector(".download-modal-container").style.display = "none"
    });
    textOverlay.addEventListener('input', async (e) => {
        textToAdd = textOverlay.innerText
        yourText.value = textOverlay.innerText
    });
    fontNameSelect.addEventListener('change', async (e) => {
        videoProcessingLoading()
        const selectedOption = fontNameSelect.options[fontNameSelect.selectedIndex];
        const selectedText = selectedOption.innerText;
        textOverlay.style.fontFamily = selectedText;

        WebFont.load({
            google: {
                families: [`${selectedText}: 200, 300, 400, 500, 600, 700, 800 & display=swap`]
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
        videoProcessingLoading()
        textSize = e.target.value
        const adjustedFontSize = parseInt(e.target.value) - 22;
        textOverlay.style.fontSize = `${adjustedFontSize} px`;
        document.querySelector(".download-modal-container").style.display = "none"
    });
    txtcolorPicker.addEventListener("change", async (e) => {
        videoProcessingLoading()
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
            videoProcessingLoading()
            textColor = dataColor
            ColorSelect.style.background = "none"
            txtcolorPicker.style.display = "block"
            document.querySelector(".download-modal-container").style.display = "none"
        });
    });
    colorPicker.addEventListener("change", async (e) => {
        videoProcessingLoading()
        backgroundColor = e.target.value
        textOverlay.style.backgroundColor = backgroundColor
        noColorSelect.style.background = "none"
        innerBgBox.style.backgroundColor = backgroundColor
        colorPicker.style.display = "block"
        document.querySelector(".download-modal-container").style.display = "none"
    });
    bgColorBoxes.forEach(colorBox => {
        colorBox.addEventListener('click', async (event) => {
            videoProcessingLoading()
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
    // element overlay added
    images.forEach((image) => {
        image.addEventListener("click", async (e) => {
            videoProcessingLoading()
            elementOverlayEnabled = true
            const element = e.target.src;
            elements = element.split("/").pop();
            elementOverlay.src = element
            await ffmpeg.FS("writeFile", elements, await fetchFile(element));
            document.querySelector(".download-modal-container").style.display = "none"
        })
    })
}
// Add Video filters 
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
            const filter = `eq = brightness = ${brightnessLevel} `;
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
        await applyVideoFilter();
    });
})
const applyVideoFilter = async () => {
    videoProcessingLoading();
    const inputFileName = `input.mp4`
    const outputFileName = `output.mp4`;
    const response = await fetch(videoElement.src);
    const videoBlob = await response.blob();
    const videoData = new Uint8Array(await videoBlob.arrayBuffer());
    ffmpeg.FS("writeFile", inputFileName, videoData);
    const filterArg = videoFilter ? ["-vf", videoFilter] : []
    await ffmpeg.run(
        "-i", "input.mp4",
        ...filterArg,
        "-preset", "ultrafast",
        outputFileName
    );
    output = ffmpeg.FS("readFile", "output.mp4");
    blob = new Blob([output.buffer], { type: `video/mp4` });
    videoElement.src = URL.createObjectURL(blob);
    // ffmpeg.FS("unlink", inputFileName);
    // ffmpeg.FS("unlink", outputFileName);
    document.querySelector(".download-modal-container").style.display = "none";
}
// export final video 
const exportVideo = async () => {
    const inputFileName = `input.mp4`
    const outputFileName = `output.mp4`;
    const response = await fetch(videoElement.src);
    const videoBlob = await response.blob();
    const videoData = new Uint8Array(await videoBlob.arrayBuffer());
    ffmpeg.FS("writeFile", inputFileName, videoData);
    await convertVideo(ffmpeg, inputFileName, elements, vfCommand, vfElementCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
    output = ffmpeg.FS("readFile", "output.mp4");
    blob = new Blob([output.buffer], { type: `video/mp4` });
    let a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `safevideokit.mp4`
    document.body.appendChild(a)
    a.click()
    // ffmpeg.FS("unlink", inputFileName);
    // ffmpeg.FS("unlink", outputFileName);
    document.querySelector(".download-modal-container").style.display = "none"
}
// File Upload 
const get_video_source_from_input = async (input) => {
    showLoader();
    VideoSourceFile = input.files[0];
    try {
        if (!VideoSourceFile.type.startsWith("audio/")) {
            mediaType = "video"
            videoElement.controls = false;
            videoElement.src = URL.createObjectURL(VideoSourceFile);
            videoElement.addEventListener("timeupdate", () => {
                updateTimeElapsed()
                updateProgress()
            });
            videoElement.addEventListener('loadedmetadata', () => {
                initializeTextOverlay()
                initializeTimeLine()
            });
            videoElement.addEventListener('ended', () => {
                document.querySelector(".PlayIcon").style.backgroundImage = "url('/public/styles/VideoEditor/media/icons/play.svg')";
            });
            const reader = new FileReader();
            reader.readAsArrayBuffer(VideoSourceFile);
            reader.addEventListener("load", async function () {
                const inputBuffer = reader.result;
                const inputFormat = VideoSourceFile.name.split(".").pop();
                const inputFileName = `input.${inputFormat}`;
                ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));
                videoOverlays()
                downloadButton.addEventListener("click", (async (e) => {
                    videoProcessingLoading()
                    exportVideo()
                }))
            })
            var fileName = VideoSourceFile.name
            var html = `
            <div class="videoFiles"> ${fileName}</> `;
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
        } else {
            mediaType = "audio"
            let audioFile = VideoSourceFile
            const responseAudio = await fetch(URL.createObjectURL(audioFile));
            const audioBlob = await responseAudio.blob();
            const audioData = new Uint8Array(await audioBlob.arrayBuffer());
            ffmpeg.FS("writeFile", "input_audio.mp3", audioData);

            const inputFileName = `input.mp4`
            const outputFileName = `output.mp4`;
            const response = await fetch(videoElement.src);
            const videoBlob = await response.blob();
            const videoData = new Uint8Array(await videoBlob.arrayBuffer());
            ffmpeg.FS("writeFile", inputFileName, videoData);
            // Combine video and audio
            const command = `-i ${inputFileName} -i input_audio.mp3 -map 0:v -map 1:a -c:v copy  ${outputFileName}`;
            await ffmpeg.run(...command.split(" "));

            // Read the output video file
            output = ffmpeg.FS("readFile", outputFileName);
            blob = new Blob([output.buffer], { type: `video/mp4` });
            videoElement.src = URL.createObjectURL(blob);
            audioFilesContainer.innerHTML = "";
            audioPlayer.src = URL.createObjectURL(audioFile);
            audioPlayer.load();
            audioPlayer.pause();
            // ffmpeg.FS("unlink", inputFileName);
            // ffmpeg.FS("unlink", "input_audio.mp3");
            // ffmpeg.FS("unlink", outputFileName);

            var fileName = audioFile.name;
            var html = `<div class="audioFiles"> ${fileName}</>`;
            audioFilesContainer.insertAdjacentHTML("beforeend", html);
            document.querySelector(".audioFiles").addEventListener("click", (event) => {
                event.target.classList.add("selectedFile");
                if (video.duration > 0) {
                    document.querySelector(".videoFiles").classList.remove("selectedFile");
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
    const videoEditor = document.querySelector('.videoEditor');
    videoEditor.style.display = "block"
}
audioPlayer.addEventListener("timeupdate", updateTimeElapsed);
audioPlayer.addEventListener("loadedmetadata", initializeTimeLine);
audioPlayer.addEventListener("timeupdate", updateProgress);

// Trim Video
function secondsToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = secs.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} `;
}
async function Trim() {
    let time = seek.value;
    let fileEle = document.querySelector(".selectedFile");
    let fileName = fileEle.textContent;
    type = fileName.split(".")[1];
    if (fileEle.classList.contains("videoFiles")) {
        let videoUrl = await video.src;
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
        var newUrl = URL.createObjectURL(outputBlob);
        videoElement.src = newUrl;
        videoElement.load();
        // ffmpeg.FS("unlink", `input.` + type);
        // ffmpeg.FS("unlink", outputFile);
        // video.addEventListener("loadedmetadata", function () {
        //     video.play();
        // });
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
        const command = `- i input.${type} -ss ${startDuration} -to ${endDuration} -c copy ${outputFile} `;
        await ffmpeg.run(...command.split(" "));
        const outputData = ffmpeg.FS("readFile", outputFile);
        const outputBlob = new Blob([outputData.buffer], { type: "mp3/wav/mpeg" });
        var newUrl = URL.createObjectURL(outputBlob);
        audioPlayer.src = newUrl;
        audioPlayer.load();
        ffmpeg.FS("unlink", `input.` + type);
        ffmpeg.FS("unlink", outputFile);
        audio.addEventListener("loadedmetadata", function () {
            audio.play();
        });
    }
}
trimBtn.addEventListener("click", () => {
    Trim();
});
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `;
}//Closed

// Video Full Screen Mode
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
function updateFullscreenButton() {
    fullscreenIcons.forEach((icon) => icon.classList.toggle("hidden"));

    if (document.fullscreenElement) {
        fullscreenButton.setAttribute("data-title", "Exit full screen (f)");
    } else {
        fullscreenButton.setAttribute("data-title", "Full screen (f)");
    }
}
fullscreenButton.addEventListener("click", toggleFullScreen);
videoContainer.addEventListener("fullscreenchange", updateFullscreenButton);
//Closed
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

