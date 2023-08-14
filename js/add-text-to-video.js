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

let InputFormat = "mp4"
let outputFormat = "mp4"

//top/center :x=(w-tw)/2:y=10:
//top/left :x=10:y=10:
//top/right :x=w-tw-10:y=10
//bottom/left :x=10:y=h-th-10:
//botom/right :x=w-tw-10:y=h-th-1

const convertVideo = async (ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName) => {
    await ffmpeg.run(
        "-i", inputFileName,
        "-vf", `drawtext=text='${textToAdd}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()},scale=700:-1`,
        "-c:a", "copy",
        "-preset", "ultrafast",
        outputFileName
    );
};

let vfCommand
let x = 0 // left
let y = 0 //top
let output
let blob
let isDragging = false;
let offsetX, offsetY;
let textOverlay = document.getElementById('text-overlay');
let video = document.getElementById('VDemo');
async function initializeTextOverlay() {
    const containerWidth = video.offsetWidth;
    const containerHeight = video.offsetHeight;
    const textWidth = textOverlay.offsetWidth;
    const textHeight = textOverlay.offsetHeight;
    const initialX = (containerWidth - textWidth) / 2;
    const initialY = (containerHeight - textHeight) / 2;
    textOverlay.style.left = `${initialX}px`;
    textOverlay.style.top = `${initialY}px`;

    // Make the text overlay draggable
    textOverlay.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', debounce(handleMouseMove, 10));
    document.addEventListener('mouseup', handleMouseUp);


    document.addEventListener('click', function (event) {
        const isClickedInsideTextOverlay = textOverlay.contains(event.target);
        if (!isClickedInsideTextOverlay) {
            textOverlay.style.border = 'none';
        }
    });


    function handleMouseDown(e) {
        if (e.target === textOverlay) {
            isDragging = true;
            textOverlay.style.border = '3px dashed white';
            offsetX = e.clientX - parseFloat(textOverlay.style.left);
            offsetY = e.clientY - parseFloat(textOverlay.style.top);
            textOverlay.style.transition = 'none'; // disable transition during drag
        }
    }

    function handleMouseMove(e) {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            updateTextPosition(x, y);
        }
    }

    async function handleMouseUp(e) {
        if (!isDragging) return; // If not dragging, return early
        const videoElement = document.querySelector('#VDemo');
        const videoRect = videoElement.getBoundingClientRect();

        // Check if the mouseup event occurred within the boundaries of the video element
        if (
            e.clientX >= videoRect.left &&
            e.clientX <= videoRect.right &&
            e.clientY >= videoRect.top &&
            e.clientY <= videoRect.bottom
        ) {
            isDragging = false;
            console.log("Updated vfCommand:", vfCommand);
            textOverlay.style.transition = '';
        } else {
            // If dragging stopped outside the video element, reset dragging state and transition
            isDragging = false;
            textOverlay.style.transition = '';
        }
    }

    async function updateTextPosition(x, y) {
        const minX = 0;
        const maxX = video.offsetWidth - textOverlay.offsetWidth;
        const minY = 0;
        const maxY = video.offsetHeight - textOverlay.offsetHeight;

        // Converting pixel-based coordinates to normalized coordinates
        const normalizedX = x / video.offsetWidth;
        const normalizedY = y / video.offsetHeight;

        const constrainedX = Math.min(Math.max(x, minX), maxX);
        const constrainedY = Math.min(Math.max(y, minY), maxY);

        textOverlay.style.left = `${constrainedX}px`;
        textOverlay.style.top = `${constrainedY}px`;

        // Use normalized coordinates in the FFmpeg command
        vfCommand = `x=${normalizedX}*W:y=${normalizedY}*H`;
    }

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
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

            let fontFilePath = "/path/to/AlfaSlabOne-Regular.ttf";
            let textToAdd = "Your text here...";
            yourText.value = textToAdd;
            let backgroundColor = "black@0";
            let textColor = "white";
            let textSize = "50";
            textOverlay.style.fontFamily = 'Alfa Slab One';
            textOverlay.style.fontSize = textSize - 22 + 'px'

            reader.addEventListener("load", async function () {
                const inputBuffer = reader.result;
                const inputFormat = VideoSourceFile.name.split(".").pop();
                const inputFileName = `input.${inputFormat}`;
                const outputFileName = `output.${inputFormat}`;

                await ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
                ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));

                vfCommand = `x=${x}:y=${y}`
                await ffmpeg.run(
                    "-i", inputFileName,
                    "-preset", "ultrafast",
                    outputFileName
                );

                yourText.addEventListener('input', async (e) => {
                    textToAdd = e.target.value
                    textOverlay.innerText = textToAdd
                });
                textOverlay.addEventListener('input', async (e) => {
                    textToAdd = textOverlay.innerText
                    yourText.value = textOverlay.innerText
                });

                fontNameSelect.addEventListener('change', async (e) => {
                    const selectedOption = fontNameSelect.options[fontNameSelect.selectedIndex];
                    const selectedText = selectedOption.innerText;
                    textOverlay.style.fontFamily = selectedText;

                    // Load the selected font using WebFont.load
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
                });

                fontSizeSelect.addEventListener('change', async (e) => {
                    textSize = e.target.value
                    const adjustedFontSize = parseInt(e.target.value) - 22;
                    textOverlay.style.fontSize = `${adjustedFontSize}px`;
                });

                txtcolorPicker.addEventListener("change", async (e) => {
                    textColor = e.target.value
                    textOverlay.style.color = textColor
                    ColorSelect.style.background = "none"
                    innerColorBox.style.backgroundColor = textColor
                    txtcolorPicker.style.display = "block"
                });
                colorBoxes.forEach(colorBox => {
                    colorBox.addEventListener('click', async (event) => {
                        const dataColor = event.target.getAttribute('data-color');
                        innerColorBox.style.backgroundColor = dataColor
                        textOverlay.style.color = dataColor
                        textColor = dataColor
                        ColorSelect.style.background = "none"
                        txtcolorPicker.style.display = "block"
                    });
                });
                colorPicker.addEventListener("change", async (e) => {
                    backgroundColor = e.target.value
                    textOverlay.style.backgroundColor = backgroundColor
                    noColorSelect.style.background = "none"
                    innerBgBox.style.backgroundColor = backgroundColor
                    colorPicker.style.display = "block"
                });
                bgColorBoxes.forEach(colorBox => {
                    colorBox.addEventListener('click', async (event) => {
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
                    });
                });
                initializeTextOverlay()

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
                document.querySelector("#exportBtn").addEventListener("click", (async (e) => {
                    videoOverlayLoader()
                    await convertVideo(ffmpeg, inputFileName, vfCommand, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName);
                    output = ffmpeg.FS("readFile", outputFileName);
                    blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                    let a = document.createElement("a")
                    a.href = URL.createObjectURL(blob)
                    a.download = `safevideokit-loop-video.mp4`
                    document.body.appendChild(a)
                    a.click()
                    document.querySelector(".download-modal-container").style.display = "none"
                }))
                videoElement.src = URL.createObjectURL(blob);
                const videoEditor = document.querySelector('.videoEditor');
                videoEditor.style.display = "block"
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












