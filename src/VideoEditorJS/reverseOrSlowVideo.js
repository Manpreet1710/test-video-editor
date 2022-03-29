const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang

const { createFFmpeg } = FFmpeg
const ffmpeg = createFFmpeg({ log: true })
var ProgressBar = document.querySelector('.ProgressBar')
var VideoSourceFile = null
var Workspace = document.querySelector('.Workspace')
var UploadButton = document.querySelector('.Button')
var Spinner = document.querySelector('.Spinner')
var LandingText = document.querySelector('.Landingtext')
var InputButtonContainer = document.querySelector('.Button')
var ActualSourceurl = null
var sourceBuffer = null
let Duration = 0;
var FileName = document.querySelector('.VideoFile h4')
var VFileSrc;

let VFileSrcSize = 0;
let streamCounter = 0;
let speed = 1.0;
let percentage = 0;
let type = null;
let process = "";
let setting = document.getElementById("setting");
let addr = (window.location.href).split("-");
let site = addr[addr.length - 1];
if (site == "slow") {
  process = "slowing";
  setting.innerHTML = "<video src='' crossorigin id='videoFile' controls='controls' style='width: 100%;height: 200px;'></video><br><span id='msg' style='display: none;color: red;'><strong>Your Audio will be muted now</strong></span><br><label for='audio'><h3>Speed</h3></label>&nbsp;&nbsp;<input type='range' name='speed' id='speed' min='25' max='100' value='100' onchange='getSpeed(this)'>&nbsp;&nbsp;<span id='percent'>1X</span>"
  document.getElementById("ExtractBtn").innerHTML = "Slow Video";
  VFileSrc = document.getElementById('videoFile');
}
if (site == "reverse") {
  process = "reversing";
  setting.innerHTML = "<video src='' crossorigin id='videoFile' controls='controls' style='display: none;width: 100%;height: 200px;'></video><label for='audio'><h3>Mute Audio</h3></label>&nbsp;&nbsp;<input type='checkbox' id='audio' name='audio' style='width:1em;height:1em;'></input>"
  document.getElementById("ExtractBtn").innerHTML = "Reverse Video";
  VFileSrc = document.getElementById('videoFile');
}

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
const mimeTypes = 'video/mp4,video/mov,video/ogg,video/webm,video/mkv'
const filemimes = ['.mp4', '.mov', '.ogg', '.webm', '.mkv']
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
  if (tempType[tempType.length - 1] == "mp4" || tempType[tempType.length - 1] == "mov" || tempType[tempType.length - 1] == "ogg" || tempType[tempType.length - 1] == "webm" || temp[temp.length - 1] == "mkv") {
    let event = new Event('change');
    tempInput.dispatchEvent(event);
  }
  else {
    document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload .mp4,.mov,.ogg,.mkv or .webm file.";
    document.getElementById("ErrorBox").style.display = "block";
    Landing.style.display = 'none'
    InputButtonContainer.style.display = 'none'
    Workspace.style.display = 'none'
  }
});

let VideoTimeinhhmmss = '00:00:00'
var LoadingText = document.querySelector('.LoadingText')
var Landing = document.querySelector('.Landing')

const link = document.querySelector('.DownloadLink')
var DownloadBox = document.querySelector('.DownloadBox')
var videoTime = 0
var CancelProcess = document.getElementById('CancelProcess')
var CancelProgressOverlay = document.getElementById('OverlayCancel')
var Show_or_Hide_CancelProgressOverlay = (params) => {
  if (params == 'open') {
    CancelProgressOverlay.style.display = 'inherit'
    return
  } else if (params == 'Yes') {
    location.reload()
    return
  } else if (params == 'No') {
    CancelProgressOverlay.style.display = 'none'
    return
  }
}
console.stdlog = console.log.bind(console)
console.logs = [];
console.log = function () {
  console.logs.push(Array.from(arguments));
  let consoleLog = Array.from(arguments)

  let CurrentTime = null
  if (consoleLog[0].indexOf('time=') != -1) {
    CurrentTime = consoleLog[0].slice(
      consoleLog[0].indexOf('time='),
      consoleLog[0].indexOf('time=') +
      consoleLog[0]
        .substring(consoleLog[0].indexOf('time='))
        .indexOf('bitrate=')
    )
  }
  if (consoleLog[0].indexOf('Duration:') != -1) {
    VideoTimeinhhmmss = consoleLog[0].slice(
      consoleLog[0].indexOf('Duration: ') + 10,
      consoleLog[0].indexOf(',')
    )
  }
  ProgressBar.style.width = '0%'
  if (CurrentTime != null) {
    let a = CurrentTime.slice(5, CurrentTime.length).split(':')
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
    let tot = VideoTimeinhhmmss.split(':')
    videoTime = +tot[0] * 60 * 60 + +tot[1] * 60 + +tot[2]
    percentage = (seconds / (videoTime * speed)) * 100
    if (percentage >= 100) {
      ProgressBar.style.width = 100 + '%'
      LandingText.innerHTML = `Please wait ,we are ${process} video in the most secure way<br><span>100%</span>`
    }
    else {
      ProgressBar.style.width = percentage + '%'
      LandingText.innerHTML = `Please wait ,we are ${process} video in the most secure way<br><span>${percentage > 0 ? percentage.toFixed(0) : 0
        }%</span>`
    }
  }
}
const get_video_source_from_input = async (input) => {
  LandingText.innerText = 'Please wait,processing your video'
  Spinner.style.display = 'inherit'
  UploadButton.style.display = 'none'
  VideoSourceFile = input.files[0]
  let temp = (VideoSourceFile.name).split(".");
  if (temp[temp.length - 1] == "mp4" || temp[temp.length - 1] == "mov" || temp[temp.length - 1] == "ogg" || temp[temp.length - 1] == "webm" || temp[temp.length - 1] == "mkv") {
    type = temp[temp.length - 1];
    VFileSrc.src = URL.createObjectURL(VideoSourceFile);
    VFileSrcSize = VideoSourceFile.size;

    if ((site == "reverse" && VFileSrcSize < 10591081) || (site == "slow" && VFileSrcSize < 31457280)) {
      VFileSrc.onloadedmetadata = function () {
        Duration = VFileSrc.duration;
      }
      FileName.innerText = VideoSourceFile.name
      const reader = new FileReader()
      reader.readAsDataURL(VideoSourceFile)

      reader.addEventListener(
        'load',
        async function () {
          try {
            ActualSourceurl = reader.result
            await fetch_and_load_Video_to_FFmpeg()
          } catch (e) {
            document.getElementById("ErrorBoxMessage").innerHTML = "<center><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#ff0000' class='bi bi-exclamation-triangle' viewBox='0 0 16 16'><path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z'/><path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z'/></svg><br><b>Your file couldn't be processed on this browser. Please try this on latest version of Google Chrome Desktop.</b></center>";
            document.getElementById("ErrorBox").style.display = "block";
            Landing.style.display = 'none'
            InputButtonContainer.style.display = 'none'
            Workspace.style.display = 'none'
          }
        },
        false
      )
    }
    else{
      Spinner.style.display = "none";
      LandingText.innerText = "File is too large be processed. Please upload smaller file or this file splitted into smaller parts.";
    }
  }
  else {
    document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload .mp4,.mov,.ogg,.mkv or .webm file.";
    document.getElementById("ErrorBox").style.display = "block";
    Landing.style.display = 'none'
    InputButtonContainer.style.display = 'none'
    Workspace.style.display = 'none'
  }
}

const fetch_and_load_Video_to_FFmpeg = async () => {
  await ffmpeg.load()
  sourceBuffer = await fetch(ActualSourceurl).then((r) => r.arrayBuffer())
  ffmpeg.FS(
    'writeFile',
    `input.` + type,
    new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
  )
  Landing.style.display = 'none'
  InputButtonContainer.style.display = 'none'
  Workspace.style.display = 'inherit'
  document.getElementById("ExtractBtn").style.display = "inherit";
}

function getSpeed(e) {
  let p = e.value;
  document.getElementById('percent').innerText = "" + (p / 100) + "X";
  if (p < 50) {
    document.getElementById('msg').style.display = "block";
    VFileSrc.muted = true;
  }
  else {
    document.getElementById('msg').style.display = "none";
    VFileSrc.muted = false;
  }
  let temp = 100 / p;
  temp = temp.toFixed(2);
  speed = parseFloat(temp);
  VFileSrc.pause();
  VFileSrc.currentTime = 0;
  VFileSrc.playbackRate = 1 / speed;
  VFileSrc.play();
}

var processVideo = async () => {
  Spinner.style.display = 'none'
  Workspace.style.display = 'none'
  Landing.style.display = 'inherit'
  CancelProcess.style.display = 'inherit'
  var FFMPEGCommand;
  if (site == "reverse") {
    if (document.getElementById("audio").checked) {
      FFMPEGCommand = `-i input.` + type + ` -vf reverse -an -preset ultrafast Output.` + type;
    }
    else {
      FFMPEGCommand = `-i input.` + type + ` -vf reverse -af areverse -preset ultrafast Output.` + type;
    }
  }
  else {
    var FFMPEGCommand1 = `-i input.` + type;
    var ArrayofInstructions = FFMPEGCommand1.split(' ');
    await ffmpeg.run(...ArrayofInstructions);
    for (let i = 0; i < console.logs.length; i++) {
      let temp = console.logs[i][0].match(/Stream #/gi);
      if (temp != null)
        streamCounter++;
    }
    if (speed >= 0.5 && speed <= 2.0 && streamCounter >= 2) {
      let atem = 1 / speed;
      FFMPEGCommand = `-i input.` + type + ` -filter_complex [0:v]minterpolate=mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=60,setpts=` + speed + `*PTS[v];[0:a]atempo=` + atem + `[a] -map [v] -map [a] -preset ultrafast  Output.` + type;
    }
    else
      FFMPEGCommand = `-i input.` + type + ` -filter:v minterpolate=mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=60,setpts=` + speed + `*PTS -an -preset ultrafast Output.` + type;
  }
  var ArrayofInstructions = FFMPEGCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
  if (percentage < 100) {
    for (let i = percentage; i <= 100; i++) {
      ProgressBar.style.width = i + '%'
      LandingText.innerHTML = `Please wait ,we are ${process} video in the most secure way<br><span>${i.toFixed(0)}%</span>`
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  CancelProcess.style.display = 'none'
  LandingText.style.display = 'none'
  initateDownload()
}

const initateDownload = async () => {
  const output = ffmpeg.FS('readFile', `Output.` + type);
  let hrefLink = URL.createObjectURL(
    new Blob([output.buffer], { type: `video/*` })
  );

  LoadingText.style.display = 'inherit'
  LoadingText.innerText = 'Thanks for your patience'
  DownloadBox.style.display = 'inherit'
  link.addEventListener('click', () => handleDownload(hrefLink));
}

let handleDownload = (src, fname) => {
  let tempLink = document.createElement('a')
  tempLink.href = src
  tempLink.download = `Output.` + type;
  tempLink.click()
  setTimeout(() => {
    if (lang === 'en') {
      window.location.href = `/download?tool=${pageTool}`
    } else {
      window.location.href = `/${lang}/download?tool=${pageTool}`
    }
  }, 500)
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
