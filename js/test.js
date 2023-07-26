const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
const { createFFmpeg, fetchFile } = FFmpeg;
var ffmpeg;
const fetch_and_load_Video_to_FFmpeg = async () => {
    ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
}
fetch_and_load_Video_to_FFmpeg()
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
yourText.value = "Your text here..."

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

const convertVideo = async (ffmpeg, inputFileName, textToAdd, textSize, textColor, backgroundColor, fontFilePath, outputFileName) => {
    await ffmpeg.run(
        "-i", inputFileName,
        "-vf", `drawtext=text='${textToAdd}':x=(w-tw)/2:y=(h/2)-(lh/2):fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}`,
        "-c:a", "copy",
        "-preset", "ultrafast",
        outputFileName
    );
};





let video
let canvas
const get_video_source_from_input = async (input) => {
    showLoader()
    const VideoSourceFile = input.files[0];
    const reader = new FileReader()
    reader.readAsDataURL(VideoSourceFile)
    reader.addEventListener("load", async function () {
        canvas = new fabric.Canvas('canvas');
        const videoElement = document.createElement('video');
        videoElement.setAttribute('height', '500');
        videoElement.setAttribute('width', '800');
        videoElement.setAttribute('class', 'canvas-img');
        videoElement.setAttribute('src', reader.result);
        video = videoElement

        video.addEventListener('ended', async function () {
            await convertFramesToVideo()
        })
        const videoObj = new fabric.Image(videoElement, {
            left: 400, // Adjust the position as needed
            top: 300, // Adjust the position as needed
            originX: 'center',
            originY: 'center',
            objectCaching: false,
            selectable: false, // Disable video selection
        });
        canvas.add(videoObj);
        videoObj.getElement().play();

        fabric.Object.prototype.set({
            transparentCorners: false,
            cornerColor: "#0090ff",
            borderColor: "#000",
            cornerSize: 10,
            borderScaleFactor: 2,
            padding: 4,
        });
        const textObj = new fabric.IText(yourText.value, {
            left: 250,
            top: 250,
            fontFamily: 'Arial',
            fontSize: 36,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            fill: 'white',
            strokeWidth: 2,
            backgroundColor: 'red',
            objectCaching: false,
        });
        canvas.add(textObj);
        yourText.addEventListener('input', (e) => {
            yourText.value = e.target.value;
            textObj.set('text', yourText.value);
            canvas.renderAll();
        });
        fabric.util.requestAnimFrame(function render() {
            canvas.renderAll();
            fabric.util.requestAnimFrame(render);
        });
        // Define variables to store the previous and current time values.
        let previousTime = 0;
        let currentTime = 0;

        videoElement.addEventListener('timeupdate', function () {
            // Render the canvas and convert it to a data URL.
            canvas.renderAll();
            const dataURL = canvas.toDataURL('image/png');

            // Calculate the current time value in seconds.
            currentTime = videoElement.currentTime;

            // Calculate the time interval between consecutive time updates.
            const timeInterval = currentTime - previousTime;

            // Calculate the frame rate for the current frame.
            const frameRate = timeInterval > 0 ? 1 / timeInterval : 0;

            // Store the data URL and frame rate for the current frame.
            frames.push({ dataURL: dataURL, frameRate: frameRate });

            // Update the previous time value for the next iteration.
            previousTime = currentTime;
        });

        const videoEditor = document.querySelector('.videoEditor');
        videoEditor.style.display = "block";
    });

};

let frames = [];
async function convertFramesToVideo() {
    let framesData = frames
    const outputFilename = "output.mp4";
    await convertFrames(framesData, outputFilename);
}
async function convertFrames(framesData, outputFilename) {
    await ffmpeg.FS("mkdir", "/frames");
    for (let i = 0; i < framesData.length; i++) {
        const imageData = framesData[i].dataURL.replace("data:image/png;base64,", "");
        const imageUint8Array = base64ToUint8Array(imageData);
        await ffmpeg.FS("writeFile", `/frames/frame_${i}.png`, imageUint8Array);
    }
    await ffmpeg.run("-framerate", "3", "-i", "/frames/frame_%d.png", "-c:v", "libx264", "-preset", "ultrafast", outputFilename);
    document.querySelector("#exportBtn").addEventListener("click", () => {
        const data = ffmpeg.FS('readFile', outputFilename);
        const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = videoUrl;
        a.download = "output.mp4";
        a.click();
    })
}
function base64ToUint8Array(base64Data) {
    const binaryString = atob(base64Data);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}



























function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}






