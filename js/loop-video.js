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

const loopOptions = document.querySelectorAll('.loopOption');
const audioOption = document.querySelectorAll('.audioOption');

const convertVideo = async (ffmpeg, inputFileName, outputFileName, optionId, audioEnabled) => {
    console.log(audioEnabled);
    // console.log(optionId);
    // console.log(audioEnabled ? '' : '-an');
    await ffmpeg.run("-stream_loop", `${optionId}`, "-i", inputFileName, "-c", "copy", audioEnabled ? '' : '-an', outputFileName);
};

const get_video_source_from_input = async (input) => {
    let VideoSourceFile = input.files[0]
    try {
        if (VideoSourceFile) {
            const ffmpeg = createFFmpeg({ log: false });
            await ffmpeg.load();
            const reader = new FileReader();
            reader.readAsArrayBuffer(VideoSourceFile);
            reader.addEventListener("load", async function () {
                const inputBuffer = reader.result;
                const inputFormat = VideoSourceFile.name.split(".").pop();
                const inputFileName = `input.${inputFormat}`;
                const outputFileName = `output.${outputFormat}`;
                let optionId = 1;
                let audioEnabled = true
                ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));
                await convertVideo(ffmpeg, inputFileName, outputFileName, optionId, audioEnabled);

                let output
                let blob
                loopOptions.forEach(option => {
                    option.addEventListener('click', async (e) => {
                        optionId = option.id;
                        loopOptions.forEach(option => {
                            option.classList.remove('active');
                        });
                        e.target.classList.add('active');
                        await convertVideo(ffmpeg, inputFileName, outputFileName, optionId, audioEnabled)
                        output = ffmpeg.FS("readFile", outputFileName);
                        blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                        const videoElement = document.querySelector('#VDemo');
                        videoElement.controls = true;
                        videoElement.addEventListener('loadedmetadata', () => {
                            videoElement.play();
                        });
                        videoElement.src = URL.createObjectURL(blob);
                        const videoEditor = document.querySelector('.videoEditor');
                        videoEditor.style.display = "block"
                    });
                });

                audioOption.forEach(option => {
                    option.addEventListener('click', async (e) => {
                        audioEnabled
                        let msg = ""
                        if (option.id == 1) {
                            audioEnabled = true
                            msg = "The final video will have sound"
                        } else {
                            audioEnabled = false
                            msg = "The final video will not have sound"
                        }
                        audioOption.forEach(option => {
                            option.classList.remove('actives');
                        });
                        console.log(audioEnabled);
                        option.classList.add('actives');
                        await convertVideo(ffmpeg, inputFileName, outputFileName, optionId, audioEnabled)
                        output = ffmpeg.FS("readFile", outputFileName);
                        blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                        const videoElement = document.querySelector('#VDemo');
                        videoElement.controls = true;
                        videoElement.addEventListener('loadedmetadata', () => {
                            videoElement.play();
                            document.querySelector(".audioMsg").innerHTML = `${msg}`
                        });
                        videoElement.src = URL.createObjectURL(blob);
                        const videoEditor = document.querySelector('.videoEditor');
                        videoEditor.style.display = "block"
                    });
                });


                output = ffmpeg.FS("readFile", outputFileName);
                blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                const videoElement = document.querySelector('#VDemo');
                videoElement.controls = true;
                videoElement.addEventListener('loadedmetadata', () => {
                    videoElement.play();
                    const seconds = parseInt(videoElement.duration);
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    let formattedDuration
                    if (minutes == 0) {
                        formattedDuration = `${remainingSeconds} seconds`;
                    } else {
                        formattedDuration = `${minutes} minute ${remainingSeconds} seconds`;
                    }
                    // console.log(formattedDuration);
                    document.querySelector(".finalOuputText").innerHTML = `The final output will be <p class="videoTime" style="color: #fff !important;">${formattedDuration}</p>`
                });
                videoElement.src = URL.createObjectURL(blob);
                const videoEditor = document.querySelector('.videoEditor');
                videoEditor.style.display = "block"

                document.querySelector("#exportBtn").addEventListener("click", ((e) => {
                    let a = document.createElement("a")
                    a.href = URL.createObjectURL(blob)
                    a.download = `safevideokit-loop-video.mp4`
                    document.body.appendChild(a)
                    a.click()
                }))
            });
        }
    } catch (error) {

    }
}






