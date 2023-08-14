const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
const { createFFmpeg } = FFmpeg;
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

const get_video_source_from_input = async (input) => {
    showLoader()
    const files = Array.from(input.files);
    if (files.length === 0) {
        alert('Please select images for the slideshow.');
        return;
    }
    const durationPerSlide = 3; // Duration per slide in seconds
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    const outputFilename = 'slideshow.mp4';
    try {
        let isImage
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileData = await fetchFile(file);
            isImage = file.type.startsWith('image/');
            await ffmpeg.FS('writeFile', `input${i}.${isImage ? 'jpg' : 'mp4'}`, fileData);
        }
        const concatInputs = files.map((_, i) => `file 'input${i}.${isImage ? 'jpg' : 'mp4'}'${isImage ? `\nduration ${durationPerSlide}` : ''}`);
        const concatFileContent = concatInputs.join('\n');
        let frameRateOptions 
        if (isImage) {
            frameRateOptions = '0.33';
        } else {
            frameRateOptions = '30';
        }
        await ffmpeg.FS('writeFile', 'concat.txt', concatFileContent);
        await ffmpeg.run('-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-r', frameRateOptions,  '-preset', "superfast", outputFilename);
        const data = ffmpeg.FS('readFile', outputFilename);
        const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        const videoElement = document.querySelector('#VDemo');
        console.log(videoElement);
        videoElement.controls = true;
        videoElement.addEventListener('loadedmetadata', () => {
            videoElement.play();
        });
        videoElement.src = videoUrl

        videoElement.addEventListener('error', () => {
            console.error('An error occurred while loading the video');
        });
        const videoEditor = document.querySelector('.videoEditor');
        videoEditor.style.display = "block"
        document.querySelector("#exportBtn").addEventListener("click", ((e) => {
            let a = document.createElement("a")
            a.href = videoUrl
            a.download = `safevideokit-slideshow-maker.mp4`
            document.body.appendChild(a)
            a.click()
        }))
    } catch (error) {
        console.error('An error occurred during slideshow creation:', error);
    }
}


function fetchFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
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
