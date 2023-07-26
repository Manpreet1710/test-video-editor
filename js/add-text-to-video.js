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
});

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

var InputFormat = "mp4"
var outputFormat = "mp4"
//top/center :x=(w-tw)/2:y=10:
//top/left :x=10:y=10:
//top/right :x=w-tw-10:y=10
//bottom/left :x=10:y=h-th-10:
//botom/right :x=w-tw-10:y=h-th-1



const convertVideo = async (ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName) => {
    await ffmpeg.run(
        "-i", inputFileName,
        "-vf", `drawtext=text='${textToAdd}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}`,
        "-c:a", "copy",
        "-preset", "ultrafast",
        outputFileName
    );
};
let vfCommand
async function updateVFCommand(x, y, width, height) {
    y = Math.trunc(y);
    // vfCommand = `x=${x}:y=${y}:w=${width}:h=${height}`;
    // console.log(vfCommand);

}
let textOverlay = document.getElementById('text-overlay');
function initializeTextOverlay() {
    const video = document.getElementById('VDemo');
    const containerWidth = video.offsetWidth;
    const containerHeight = video.offsetHeight;
    const textWidth = textOverlay.offsetWidth;
    const textHeight = textOverlay.offsetHeight;

    const initialX = (containerWidth - textWidth) / 2;
    const initialY = (containerHeight - textHeight) / 2;
    console.log(containerWidth);

    textOverlay.style.left = `${initialX}px`;
    textOverlay.style.top = `${initialY}px`;

    // Make the text overlay draggable
    let isDragging = false;
    let offsetX, offsetY;

    textOverlay.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - textOverlay.getBoundingClientRect().left;
        offsetY = e.clientY - textOverlay.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            updateTextPosition(x, y);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Function to update the text overlay position
    function updateTextPosition(x, y) {
        const minX = 0;
        const maxX = containerWidth - textWidth;
        const minY = 0;
        const maxY = containerHeight - textHeight;

        const constrainedX = Math.min(Math.max(x, minX), maxX);
        const constrainedY = Math.min(Math.max(y, minY), maxY);

        textOverlay.style.left = `${constrainedX}px`;
        textOverlay.style.top = `${constrainedY}px`;
        updateVFCommand(constrainedX, constrainedY, textWidth, textHeight);
    }

}

const get_video_source_from_input = async (input) => {
    showLoader();
    let VideoSourceFile = input.files[0];
    try {
        if (VideoSourceFile) {
            const ffmpeg = createFFmpeg({ log: true });
            await ffmpeg.load();
            const reader = new FileReader();
            reader.readAsArrayBuffer(VideoSourceFile);

            let fontFilePath = "/path/to/arial.ttf";
            let textToAdd = "Your text here...";
            yourText.value = textToAdd;
            let backgroundColor = "0x000000";
            let textColor = "red";
            let textSize = "72";

            reader.addEventListener("load", async function () {
                const inputBuffer = reader.result;
                const inputFormat = VideoSourceFile.name.split(".").pop();
                const inputFileName = `input.${inputFormat}`;
                const outputFileName = `output.${inputFormat}`;

                await ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
                ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));

                vfCommand = "x=(w-tw)/2:y=(h/2)-(lh/2)"
                await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);

                let output
                let blob

                yourText.addEventListener('change', async (e) => {
                    videoOverlayLoader()
                    textToAdd = e.target.value
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    const videoElement = document.querySelector('#VDemo');
                    videoElement.controls = false;
                    videoElement.src = URL.createObjectURL(blob);
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                console.log(textOverlay);
                textOverlay.addEventListener('input', async (e) => {
                    videoOverlayLoader()
                    textToAdd = textOverlay.innerText
                    console.log(textToAdd);
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    const videoElement = document.querySelector('#VDemo');
                    videoElement.controls = false;
                    videoElement.src = URL.createObjectURL(blob);
                    document.querySelector(".download-modal-container").style.display = "none"
                });

                fontNameSelect.addEventListener('change', async (e) => {
                    videoOverlayLoader()
                    fontFilePath = e.target.value
                    await ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    const videoElement = document.querySelector('#VDemo');
                    videoElement.controls = false;
                    videoElement.src = URL.createObjectURL(blob);
                    document.querySelector(".download-modal-container").style.display = "none"
                });

                fontSizeSelect.addEventListener('change', async (e) => {
                    videoOverlayLoader()
                    textSize = e.target.value
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    const videoElement = document.querySelector('#VDemo');
                    videoElement.controls = false;
                    videoElement.src = URL.createObjectURL(blob);
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                txtcolorPicker.addEventListener("change", async (e) => {
                    videoOverlayLoader()
                    textColor = e.target.value
                    console.log(textColor);
                    ColorSelect.style.background = "none"
                    innerColorBox.style.backgroundColor = textColor
                    txtcolorPicker.style.display = "block"
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    const videoElement = document.querySelector('#VDemo');
                    videoElement.controls = false;
                    videoElement.src = URL.createObjectURL(blob);
                    document.querySelector(".download-modal-container").style.display = "none"
                });
                colorPicker.addEventListener("change", async (e) => {
                    videoOverlayLoader()
                    backgroundColor = e.target.value
                    noColorSelect.style.background = "none"
                    innerBgBox.style.backgroundColor = backgroundColor
                    colorPicker.style.display = "block"
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    const videoElement = document.querySelector('#VDemo');
                    videoElement.controls = false;
                    videoElement.src = URL.createObjectURL(blob);
                    document.querySelector(".download-modal-container").style.display = "none"
                });

                output = ffmpeg.FS("readFile", outputFileName);
                blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                const videoElement = document.querySelector('#VDemo');
                videoElement.controls = false;
                videoElement.addEventListener("timeupdate", () => {
                    seekSlider.value = videoElement.currentTime;
                    updateDurationText();
                });
                seekSlider.addEventListener("input", () => {
                    videoElement.currentTime = seekSlider.value;
                    updateDurationText();
                });

                // Update the duration text dynamically
                function updateDurationText() {
                    const currentTime = formatTime(videoElement.currentTime);
                    const totalDuration = formatTime(videoElement.duration);
                    videoTime.innerHTML = `${currentTime}&nbsp;/&nbsp;<span style="color:#5c647e">${totalDuration}</span>`;
                }

                videoElement.addEventListener('loadedmetadata', () => {
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
                initializeTextOverlay()
                document.querySelector("#exportBtn").addEventListener("click", ((e) => {
                    let a = document.createElement("a")
                    a.href = URL.createObjectURL(blob)
                    a.download = `safevideokit-loop-video.mp4`
                    document.body.appendChild(a)
                    a.click()
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
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}












