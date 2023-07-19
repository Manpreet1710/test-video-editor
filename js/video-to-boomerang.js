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
let isgif = false;
let StartTimeinSeconds = 0;
let videoDuration = null;
let FeatureValues = {
    StartTime: "00:00:00",
    EndTime: "00:00:00",
};
let EndTimeChange = {
    hhe: document.querySelector("#hhe"),
    mme: document.querySelector("#mme"),
    sse: document.querySelector("#sse"),
};
let StartTimeChange = {
    hhs: document.querySelector("#hhs"),
    mms: document.querySelector("#mms"),
    sss: document.querySelector("#sss"),
};
let sh = document.querySelector("#hhs"),
    sm = document.querySelector("#mms"),
    ss = document.querySelector("#sss"),
    eh = document.querySelector("#hhe"),
    em = document.querySelector("#mme"),
    es = document.querySelector("#sse");

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

function convertHMS(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return [hours, minutes, seconds];
}
let TrimmVideo = false
const TrimChangeHandler = (element, value) => {
    TrimmVideo = true
    switch (element.id) {
        case "hhs":
            sh.value =
                Number(sh.value) < 0
                    ? "00"
                    : Number(sh.value) > Number(eh.value)
                        ? "00"
                        : sh.value;
            break;
        case "mms":
            sm.value =
                Number(sm.value) < 0
                    ? "00"
                    : Number(sh.value) < Number(eh.value)
                        ? sm.value
                        : Number(sh.value) === Number(sh.value) &&
                            Number(sm.value) < Number(em.value)
                            ? sm.value
                            : "00";
            break;
        case "sss":
            ss.value =
                Number(ss.value) < 0
                    ? "00"
                    : Number(sm.value) < Number(em.value)
                        ? ss.value
                        : Number(sm.value) === Number(em.value) &&
                            Number(ss.value) < Number(es.value)
                            ?  ss.value
                            : "00";

            break;
        case "hhe":
            eh.value =
                Number(eh.value) < 0
                    ? videoDuration[0]
                    : Number(eh.value) > Number(videoDuration[0])
                        ? videoDuration[0]
                        : eh.value;
            break;
        case "mme":
            em.value =
                Number(em.value) < 0
                    ? videoDuration[1]
                    : Number(em.value) > Number(videoDuration[1])
                        ? videoDuration[1]
                        : em.value;
            break;
        case "sse":
            es.value =
                Number(es.value) < 0
                    ? videoDuration[2]
                    : Number(es.value) > Number(videoDuration[2])
                        ? videoDuration[2]
                        : es.value;
            break;

        default:
            break;
    }
};
var InputFormat = "mp4"
var outputFormat = "mp4"

const loopOptions = document.querySelectorAll('.loopOption');
// async function convertVideo(ffmpeg, inputFileName, outputFileName, optionId) {
//     let loopOption = "";
//     if (optionId !== undefined && optionId > 0) {
//         loopOption = `-stream_loop ${optionId}`;
//     }
//     const trimmOption = TrimmVideo ? `-ss ${sh.value}:${sm.value}:${ss.value} -to ${eh.value}:${em.value}:${es.value}` : '';
//     const allinOneCommand = `${loopOption} -i ${inputFileName} ${trimmOption} ${TrimmVideo ? `-c:v libx264 -c:a copy` : `-c copy`} ${outputFileName}`;
//     const ArrayofInstructions = allinOneCommand.split(" ");
//     await ffmpeg.run(...ArrayofInstructions);
// }

async function convertVideo(ffmpeg, inputFileName, outputFileName, optionId) {
    const trimDuration = `${eh.value}:${em.value}:${es.value}`;
    const loopOption = optionId > 0 ? `-stream_loop ${optionId}` : "-stream_loop -1";

    // Generate a unique name for the temporary trimmed file
    const trimmedFileName = "trimmed_" + outputFileName;

    const trimCommand = `-i ${inputFileName} -ss ${sh.value}:${sm.value}:${ss.value} -to ${trimDuration} -c:v libx264 -preset ultrafast -c:a copy ${trimmedFileName}`;
    const loopCommand = `${loopOption} -i ${trimmedFileName} -c copy ${outputFileName}`;

    const trimArrayofInstructions = trimCommand.split(" ");
    await ffmpeg.run(...trimArrayofInstructions);

    const loopArrayofInstructions = loopCommand.split(" ");
    await ffmpeg.run(...loopArrayofInstructions);

    // Remove the temporary trimmed file
    ffmpeg.FS("unlink", trimmedFileName);
}


const get_video_source_from_input = async (input) => {
    showLoader()
    let VideoSourceFile = input.files[0]
    const video = document.querySelector('#VDemo');
    video.src = URL.createObjectURL(VideoSourceFile);
    video.controls = false;
    let isLoadedMetadataEventAttached = false; // add this line
    video.addEventListener('loadedmetadata', () => {
        if (!isLoadedMetadataEventAttached) { // add this line
            isLoadedMetadataEventAttached = true; // add this line
            videoDuration = convertHMS(video.duration.toString().split(".")[0]);
            eh.value = videoDuration[0];
            em.value = videoDuration[1];
            es.value = videoDuration[2];
            video.removeEventListener('loadedmetadata', () => { }, false); // add this line
        } // add this line
    });
    try {
        if (VideoSourceFile) {
            const ffmpeg = createFFmpeg({ log: true });
            await ffmpeg.load();
            const reader = new FileReader();
            reader.readAsArrayBuffer(VideoSourceFile);
            reader.addEventListener("load", async function () {
                const inputBuffer = reader.result;
                const inputFormat = VideoSourceFile.name.split(".").pop();
                const inputFileName = `input.${inputFormat}`;
                const outputFileName = `output.${outputFormat}`;
                let optionId = 1;
                ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));
                let startTime = "00:00:00";
                let endTime = "00:00:10";
                if (isgif) {
                    startTime = `${sh.value}:${sm.value}:${ss.value}`;
                    endTime = `${eh.value}:${em.value}:${es.value}`;
                }
                await convertVideo(ffmpeg, inputFileName, outputFileName, optionId);
                let output
                let blob
                loopOptions.forEach(option => {
                    option.addEventListener('click', async (e) => {
                        optionId = option.id;
                        loopOptions.forEach(option => {
                            option.classList.remove('active');
                        });
                        e.target.classList.add('active');
                        await convertVideo(ffmpeg, inputFileName, outputFileName, optionId)
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
                output = ffmpeg.FS("readFile", outputFileName);
                blob = new Blob([output.buffer], { type: `video/${inputFormat}` });
                console.log(blob);
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







