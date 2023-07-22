const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
let Workspace = document.querySelector('.Workspace')
let UploadButton = document.querySelector('.Button')
var LandingText = document.querySelector('.Landingtext')
var Spinner = document.querySelector('.Spinner')
const { createFFmpeg } = FFmpeg;
let ffmpeg;
const modal = document.getElementById("customModal");
const closeModalBtn = document.getElementById("closeModalBtn");
function openModal() {
    modal.style.display = "flex";
}
function closeModal() {
    modal.style.display = "none";
}
closeModalBtn.addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});
async function load_ffmpeg() {
    ffmpeg = await createFFmpeg({ log: false });
    await ffmpeg.load();
}
load_ffmpeg();
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
    get_video_source_from_input(input)
}
const dropbox = document.getElementById('dropbox')
dropbox.addEventListener(
    'click',
    async (getDropBoxFile, showLoader, closeLoader) => {
        const getFile = chooseFromDropbox()
    }
)
let playButton = document.getElementById("playButton");
let audioInputSelect = document.querySelector("#audio-file");
let audioElement = document.createElement("audio");
audioElement.controls = false;
audioElement.loop = true;

let audioContainer = document.createElement("div");
audioContainer.id = "audio-container";
document.body.appendChild(audioContainer);
audioContainer.appendChild(audioElement);

let duration;
let audioFile;
let blob
let downloadButton = document.querySelector("#exportBtn");
let canvas = document.querySelector("#canvas");
let recorder = null;


function changeImage() {
    const fileInput = document.getElementById("images");
    fileInput.click();
}
let imageElement = new Image();
imageElement.src = 'default.jpeg';
let imagePreview = document.querySelector(".imagePreview");
let createPodcastVideo = document.querySelector(".createPodcastVideo")


const checkboxElement = document.getElementById("wave");
let audioWave = true
function handleCheckboxChange() {
    if (checkboxElement.checked) {
        audioWave = true
    } else {
        audioWave = false
    }
}
checkboxElement.addEventListener("change", handleCheckboxChange);

function get_images_source_from_input(input) {
    const file = input.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (e) {
        let imageData = e.target.result;
        let img = new Image();
        img.onload = function () {
            imageElement = img;
            imagePreview.src = img.src;
        };
        img.src = imageData;
    };
    reader.readAsDataURL(file);
    const fileNameElement = document.querySelector(".fileName");
    fileNameElement.textContent = file.name;
}
let isRecordingComplete = false;
let isConversionInProgress = false;
let audioCtx;
let source;
const get_video_source_from_input = async (input) => {
    showLoader()
    openModal()
    let videoEditor = document.querySelector('.videoEditor');
    videoEditor.style.display = "block"
    let VideoSourceFile = input.files[0]
    audioFile = input.files[0]
    try {
        createPodcastVideo.addEventListener("click", () => {
            closeModal()
          
            if (VideoSourceFile) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(VideoSourceFile);
                reader.addEventListener("load", async function () {
                    const audioData = reader.result;
                    audioCtx = new AudioContext();
                    audioCtx.decodeAudioData(audioData, function (buffer) {
                        source = audioCtx.createBufferSource();
                        source.buffer = buffer;
                        let analyser = audioCtx.createAnalyser();
                        analyser.fftSize = 2048;
                        let bufferLength = analyser.frequencyBinCount;
                        let dataArray = new Uint8Array(bufferLength);
                        source.connect(analyser);
                        analyser.connect(audioCtx.destination);
                        source.start();
                        duration = buffer.duration;

                        if (recorder) {
                            recorder.startRecording();
                        }
                        setTimeout(async function () {
                            if (recorder) {
                                recorder.stopRecording(async function () {
                                    blob = recorder.getBlob();
                                    isRecordingComplete = true;
                                    if (isConversionInProgress) {
                                        document.querySelector(".download-modal-container").style.display = "none"
                                        await convertVideoToMP4(blob, audioFile);
                                        isConversionInProgress = false; // Reset the flag after the conversion is done
                                    }
                                });
                            }
                        }, duration * 1000);

                        drawMusicVisualization();
                        function drawMusicVisualization() {
                            const WIDTH = canvas.width;
                            const HEIGHT = canvas.height;
                            let canvasCtx = canvas.getContext("2d");
                            if (imageElement) {
                                canvasCtx.drawImage(imageElement, 0, 0, WIDTH, HEIGHT);
                            } else {
                                canvasCtx.fillStyle = "white";
                                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                            }
                            requestAnimationFrame(drawMusicVisualization);
                            analyser.getByteFrequencyData(dataArray);
                            if (audioWave) {
                                let barWidth = (3000 / bufferLength) * 2.5;
                                let barHeight;
                                let x = 0;
                                for (let i = 0; i < bufferLength; i++) {
                                    barHeight = dataArray[i] / 2;
                                    canvasCtx.fillStyle = "white";
                                    canvasCtx.fillRect(
                                        x,
                                        HEIGHT - (barHeight / 2) * 1.5,
                                        barWidth,
                                        barHeight
                                    );
                                    x += barWidth + 1;
                                }
                            }
                        }
                    });

                });
            }
        })
    } catch (error) {
    }
}


async function setupRecorder() {
    let canvasStream = canvas.captureStream();
    let mixedStream = new MediaStream([
        ...canvasStream.getTracks()
    ]);
    recorder = RecordRTC(mixedStream, {
        type: "video",
        mimeType: "video/webm; codecs=vp9",
        frameRate: 30,
        quality: 10,
    });
}
setupRecorder();

function blobToUint8Array(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(new Uint8Array(reader.result));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

async function readAudioFile(audioFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(audioFile);
    });
}

function uint8ArrayToBlob(uint8Array, mimeType) {
    return new Blob([uint8Array], { type: mimeType });
}

async function convertVideoToMP4(blob, audioFile) {
    const inputBuffer = await blobToUint8Array(blob);
    ffmpeg.FS("writeFile", "input.webm", inputBuffer);
    const audioData = await readAudioFile(audioFile);
    ffmpeg.FS(
        "writeFile",
        "audio.mp3",
        new Uint8Array(audioData, 0, audioData.byteLength)
    );
    await ffmpeg.run(
        "-i",
        "input.webm",
        "-i",
        "audio.mp3",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        `output.mp4`
    );
    const outputData = ffmpeg.FS("readFile", "output.mp4");
    const outputBlob = uint8ArrayToBlob(outputData, "video/mp4");
    const url = URL.createObjectURL(outputBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "output.mp4";
    downloadLink.click();
    ffmpeg.FS("unlink", "input.webm");
    ffmpeg.FS("unlink", "audio.mp3");
    ffmpeg.FS("unlink", "output.mp4");
    URL.revokeObjectURL(url);
    ffmpeg.exit();
}

downloadButton.addEventListener("click", async function () {
    if (!isRecordingComplete) {
        if (audioCtx && audioCtx.state === "running") {
            audioCtx.suspend();
        }
        document.querySelector(".download-modal-container").style.display = "flex"
        isConversionInProgress = true;
        return;
    }


  
    // If recording is complete, proceed with the video conversion and other actions
    await convertVideoToMP4(blob, audioFile);
    audioElement.pause();
    audioElement.currentTime = 0;
});






