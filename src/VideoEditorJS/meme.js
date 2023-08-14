const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
const { createFFmpeg, fetchFile } = FFmpeg;
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
let watermarkInput = document.querySelector("#upload-logo")
let alignmentBtns =document.querySelector(".alignment-btns")
let waterMarkscale = document.querySelector(".waterMarkscale")




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
let output
let blob
let alignment = "bottom-right"; 
let scaleFactor = 0.3
async function addWatermarkToVideo(ffmpeg, inputFileName, watermarkImage, outputFileName) {
  videoOverlayLoader()
  ffmpeg.FS("writeFile", "watermark.png", await fetchFile(watermarkImage));

  let filtergraph;
  if (alignment === "top-left") {
    filtergraph = `movie=watermark.png, scale=w=iw*${scaleFactor}:h=ih*${scaleFactor} [watermark]; [in][watermark] overlay=10:10 [out]`;
  } else if (alignment === "top-right") {
    filtergraph = `movie=watermark.png, scale=w=iw*${scaleFactor}:h=ih*${scaleFactor} [watermark]; [in][watermark] overlay=W-w-10:10 [out]`;
  } else if (alignment === "bottom-left") {
    filtergraph = `movie=watermark.png, scale=w=iw*${scaleFactor}:h=ih*${scaleFactor} [watermark]; [in][watermark] overlay=10:H-h-10 [out]`;
  } else if (alignment === "bottom-right") {
    filtergraph = `movie=watermark.png, scale=w=iw*${scaleFactor}:h=ih*${scaleFactor} [watermark]; [in][watermark] overlay=W-w-10:H-h-10 [out]`;
  }
  
  await ffmpeg.run("-i", inputFileName, "-vf", filtergraph, "-preset", "ultrafast", outputFileName);
  output = ffmpeg.FS("readFile", outputFileName);
  blob = new Blob([output.buffer], { type: `video/${InputFormat}` });
  const videoElement = document.querySelector('#VDemo');
  videoElement.src = URL.createObjectURL(blob);
  document.querySelector(".download-modal-container").style.display = "none"
}

let ffmpeg;
let inputFileName;
let outputFileName;
let watermarkFile
const get_video_source_from_input = async (input) => {
  showLoader();
  let VideoSourceFile = input.files[0];
  try {
    if (VideoSourceFile) {
      ffmpeg = createFFmpeg({ log: true });
      await ffmpeg.load();
      const reader = new FileReader();
      reader.readAsArrayBuffer(VideoSourceFile);
      reader.addEventListener("load", async function () {
        const inputBuffer = reader.result;
        const inputFormat = VideoSourceFile.name.split(".").pop();
        inputFileName = `input.${inputFormat}`;
        outputFileName = `output.${inputFormat}`;
        ffmpeg.FS("writeFile", inputFileName, new Uint8Array(inputBuffer));
        watermarkInput.addEventListener("change", (event) => {
          watermarkFile = event.target.files[0];
          alignmentBtns.style.opacity = "1"
          alignmentBtns.style.pointerEvents = "auto"
          waterMarkscale.style.opacity = "1"
          waterMarkscale.style.pointerEvents = "auto"

      
          addWatermarkToVideo(ffmpeg, inputFileName, watermarkFile, outputFileName);
        });
        await ffmpeg.run("-i", inputFileName, "-c", "copy", outputFileName);

        output = ffmpeg.FS("readFile", outputFileName);
        blob = new Blob([output.buffer], { type: `video/${InputFormat}` });
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
function setAlignment(align) {
  alignment = align;
  addWatermarkToVideo(ffmpeg, inputFileName, watermarkFile, outputFileName);
}

function applyFilter() {
  scaleFactor = parseFloat(document.getElementById("scalingFactor").value)
  console.log(scaleFactor);
  addWatermarkToVideo(ffmpeg, inputFileName, watermarkFile, outputFileName);
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










