const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
const { createFFmpeg, fetchFile } = FFmpeg
const ffmpeg = createFFmpeg({ log: true })
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
let videoDuration
var changeSubtitleInput = document.querySelector('.subtitleInput')
let PlayButton = document.querySelector(".PlayButton")
let playIcon = document.querySelector(".PlayIcon");
let seekSlider = document.getElementById("seekSlider");
let videoTime = document.querySelector(".video-time")
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
let VideoTimeinhhmmss = '00:00:00'
var LoadingText = document.querySelector('.LoadingText')
var Landing = document.querySelector('.Landing')
var values = document.querySelectorAll('.value')
const link = document.querySelector('.DownloadLink')
var DownloadBox = document.querySelector('.DownloadBox')
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
  console.log(element.id);
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
              ? ss.value
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
// console.stdlog = console.log.bind(console)
// console.log = function () {
//   let consoleLog = Array.from(arguments)

//   let CurrentTime = null
//   if (consoleLog[0].indexOf('time=') != -1) {
//     CurrentTime = consoleLog[0].slice(
//       consoleLog[0].indexOf('time='),
//       consoleLog[0].indexOf('time=') +
//         consoleLog[0]
//           .substring(consoleLog[0].indexOf('time='))
//           .indexOf('bitrate=')
//     )
//   }
//   if (consoleLog[0].indexOf('Duration:') != -1) {
//     VideoTimeinhhmmss = consoleLog[0].slice(
//       consoleLog[0].indexOf('Duration: ') + 10,
//       consoleLog[0].indexOf(',')
//     )
//   }
//   ProgressBar.style.width = '0%'
//   if (CurrentTime != null) {
//     let a = CurrentTime.slice(5, CurrentTime.length).split(':')
//     var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
//     let tot = VideoTimeinhhmmss.split(':')
//     videoTime = +tot[0] * 60 * 60 + +tot[1] * 60 + +tot[2]
//     var percentage = (seconds / videoTime) * 100
//     ProgressBar.style.width = percentage + '%'
//     LandingText.innerHTML = `Please wait ,we are adding subtitles to your video in the most secure way<br><span>${
//       percentage > 0 ? percentage.toFixed(0) : 0
//     }%</span>`
//   }
// }
changeSubtitleInput.addEventListener("input", (e) => {
  document.querySelector("#text-overlay").innerHTML = e.target.value
})
// set video in editor and load
const get_video_source_from_input = async (input) => {
  LandingText.innerText = 'Please wait,processing your video'
  Spinner.style.display = 'inherit'
  UploadButton.style.display = 'none'
  VideoSourceFile = input.files[0]
  let temp = (VideoSourceFile.name).split(".");
  if (temp[temp.length - 1] == "mp4") {
    let isLoadedMetadataEventAttached = false;
    const videoElement = document.querySelector('#VDemo');
    videoElement.src = URL.createObjectURL(VideoSourceFile);
    videoElement.controls = false;
    videoElement.addEventListener("timeupdate", () => {
      seekSlider.value = videoElement.currentTime;
      updateDurationText();
    });
    seekSlider.addEventListener("input", () => {
      videoElement.currentTime = seekSlider.value;
      updateDurationText();
    });
    function updateDurationText() {
      const currentTime = formatTime(videoElement.currentTime);
      const totalDuration = formatTime(videoElement.duration);
      videoTime.innerHTML = `${currentTime}&nbsp;/&nbsp;<span style="color:#5c647e">${totalDuration}</span>`;
    }
    videoElement.addEventListener('loadedmetadata', () => {
      if (!isLoadedMetadataEventAttached) { // add this line
        isLoadedMetadataEventAttached = true; // add this line
        videoDuration = convertHMS(videoElement.duration.toString().split(".")[0]);
        eh.value = videoDuration[0];
        em.value = videoDuration[1];
        es.value = videoDuration[2];
        videoElement.removeEventListener('loadedmetadata', () => { }, false); // add this line
      }
      updateDurationText();
      seekSlider.max = videoElement.duration;
      const seconds = parseInt(videoElement.duration);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (minutes == 0) {
        formattedDuration = `${remainingSeconds} seconds`;
      } else {
        formattedDuration = `${minutes} minute ${remainingSeconds} seconds`;
      }
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
    })
  }
  else {
    document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload a .mp4 file.";
    document.getElementById("ErrorBox").style.display = "block";
    Landing.style.display = 'none'
    InputButtonContainer.style.display = 'none'
    Workspace.style.display = 'none'
  }
  const reader = new FileReader()
  reader.readAsDataURL(VideoSourceFile)
  reader.addEventListener(
    'load',
    async function () {
      ActualSourceurl = reader.result
      fetch_and_load_Video_to_FFmpeg()
    },
    false
  )
}
// load video on ffmpeg command 
const fetch_and_load_Video_to_FFmpeg = async () => {
  try {
    await ffmpeg.load()
  } catch (e) {
    document.getElementById("ErrorBoxMessage").innerHTML = "<center><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#ff0000' class='bi bi-exclamation-triangle' viewBox='0 0 16 16'><path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z'/><path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z'/></svg><br><b>Your file couldn't be processed on this browser. Please try this on latest version of Google Chrome Desktop.</b></center>";
    document.getElementById("ErrorBox").style.display = "block";
    Landing.style.display = 'none'
    InputButtonContainer.style.display = 'none'
    Workspace.style.display = 'none'
  }
  sourceBuffer = await fetch(ActualSourceurl).then((r) => r.arrayBuffer())
  ffmpeg.FS(
    'writeFile',
    `input.mp4`,
    new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
  )
  Landing.style.display = 'none'
  InputButtonContainer.style.display = 'none'
  Workspace.style.display = 'inherit'
}
// adding row and column for adding subtiles
let rowCounter = 1;
let rowData = []
let row1 = document.querySelector(".firstRow")
const timeInputs = row1.querySelectorAll('.timeInput');
const subtitleInput = row1.querySelector('.subtitleInput');
timeInputs.forEach((input, index) => {
  input.addEventListener('change', () => TrimChangeHandler(input, index));
});
subtitleInput.addEventListener('change', () => TrimChangeHandler(row1));
rowData.push({
  timeInputs,
  subtitleInput
});
let startTime = [], endTime = [], subText = [];
function addRow() {
  rowCounter++;
  console.log(videoDuration);
  let table = document.getElementById("cue-table");
  let row = document.createElement('tr');
  row.id = rowCounter + "row";
  row.innerHTML = `
    <td>
        <div class="sub-time">
            <input class="timeInput" type="number" id="hhs" placeholder="00" value="00"
                onchange="TrimChangeHandler(this,0)">
            :
            <input class="timeInput" type="number" id="mms" placeholder="00" value="00"
                onchange="TrimChangeHandler(this,0)">
            :
            <input class="timeInput" type="number" id="sss" placeholder="00" value="00"
                onchange="TrimChangeHandler(this,0)">
        </div>
        <br>
        <div class="sub-time">
            <input class="timeInput" type="number" id="hhe" placeholder="00"
                onchange="TrimChangeHandler(this,1)" value=${videoDuration[0]}>
            :
            <input class="timeInput" type="number" id="mme" placeholder="00"
                onchange="TrimChangeHandler(this,1)" value=${videoDuration[1]}>
            :
            <input class="timeInput" type="number" id="sse" placeholder="00"
                onchange="TrimChangeHandler(this,1)" value=${videoDuration[2]}>
        </div>
    </td>
    <td>
        <textarea class="subtitleInput" id="1col4" rows="2" style="resize: none;"
            placeholder="New subtitle"></textarea>
    </td>
`;
  table.appendChild(row);
  const timeInputs = row.querySelectorAll('.timeInput');
  const subtitleInput = row.querySelector('.subtitleInput');
  timeInputs.forEach((input, index) => {
    input.addEventListener('change', () => TrimChangeHandler(input, index));
  });
  subtitleInput.addEventListener('change', () => TrimChangeHandler(row));
  rowData.push({
    timeInputs,
    subtitleInput
  });
}
function deleteLast() {
  if (rowCounter > 0) {
    document.getElementById(rowCounter + "row").remove();
    startTime.splice(rowCounter, 1);
    endTime.splice(rowCounter, 1);
    subText.splice(rowCounter, 1);
    rowCounter--;
    rowData.pop()
    // make_and_load_VTT();
  }
}

//upload subtitle file
const UploadSubs = async (input) => {
  document.querySelector(".box").style.background = "#a55eea"
  document.querySelector(".box").style.minHeight = "300px"
  document.querySelector(".box-border").style.display = "block"
  if (input.files.length > 0) {
    VideoSourceFile = input.files[0];
    let temporary = (VideoSourceFile.name).split('.');
    type = temporary[temporary.length - 1];
  }
  if (type == "vtt" || type == "srt") {
    const reader = new FileReader();
    reader.readAsDataURL(VideoSourceFile);
    reader.addEventListener(
      'load',
      async function () {
        SubSourceurl = reader.result;
        fetch_and_load_Subs_to_FFmpeg();
      },
      false
    )
  }
  else {
    document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload .srt or .vtt file.";
    document.getElementById("ErrorBox").style.display = "block";
    LandingPage.style.display = 'none'
    Workspace.style.display = 'none'
  }
}
const fetch_and_load_Subs_to_FFmpeg = async () => {
  if (!ffmpeg.isLoaded()) {
    try {
      await ffmpeg.load();
    } catch (e) {
      document.getElementById("ErrorBoxMessage").innerHTML = "<center><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#ff0000' class='bi bi-exclamation-triangle' viewBox='0 0 16 16'><path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z'/><path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z'/></svg><br><b>Your file couldn't be processed on this browser. Please try this on latest version of Google Chrome Desktop.</b></center>";
      document.getElementById("ErrorBox").style.display = "block";
      Landing.style.display = 'none'
      InputButtonContainer.style.display = 'none'
      Workspace.style.display = 'none'
    }
  }
  SubSourceBuffer = await fetch(SubSourceurl).then((r) => r.arrayBuffer())
  ffmpeg.FS(
    'writeFile',
    'subtitle.' + type,
    new Uint8Array(SubSourceBuffer, 0, SubSourceBuffer.byteLength)
  )
  addSubs();
}
const addSubs = async () => {
  Spinner.style.display = 'none'
  Workspace.style.display = 'none'
  Landing.style.display = 'inherit'
  CancelProcess.style.display = 'inherit'
  LoadingText.style.display = 'inherit'
  LoadingText.innerText = 'Thanks for your patience'
  DownloadBox.style.display = 'inherit'
  link.addEventListener('click', async () => {
    var FFMPEGCommand = `-i input.mp4 -i subtitle.` + type + ` -c:v copy -c:a copy -c:s mov_text -map 0 -map 1 -metadata:s:s:0 language=eng Output.mp4`;
    const ArrayOfInstructions = FFMPEGCommand.split(' ');
    await ffmpeg.run(...ArrayOfInstructions);
    const output = ffmpeg.FS('readFile', `Output.mp4`);
    let url = URL.createObjectURL(new Blob([output.buffer], { type: `video/mp4` }));
    let tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = "SubtitledVideo.mp4";
    tempLink.click();
  });
  CancelProcess.style.display = 'none'
  LandingText.style.display = 'none'
}
function make_and_load_VTT() {
  if (startTime.length > 0 && endTime.length > 0 && subText.length > 0) {
    let tempString = "WEBVTT\n\n";
    for (let i = 1; i < startTime.length; i++) {
      tempString += startTime[i] + " --> " + endTime[i] + "\n" + subText[i] + "\n\n";
    }
    let tempBlob = new Blob([tempString], { type: 'text\plain' });
    let url = URL.createObjectURL(tempBlob);
    document.getElementById("TDemo").src = url;
    document.getElementById("TDemo").track.mode = 'showing';
  }
}

// add manually subtitle
function WriteSubs() {
  document.querySelector(".toaster").style.left = "0px"
  document.querySelector(".toaster").style.right = "auto"
  Landing.style.display = 'none'
  InputButtonContainer.style.display = 'none'
  Workspace.style.display = 'none'
  document.getElementsByClassName('Workspace')[0].style.display = 'none';
  document.getElementsByTagName('Body')[0].style.overflow = 'hidden';
  document.getElementById('EditBox').style.display = 'block';
  let tableDiv = document.getElementById("subTable");
  tableDiv.scrollTop = tableDiv.scrollHeight;
  // document.getElementById("1col2").addEventListener("focusin", function (e) {
  //   document.getElementById(e.target.id).style.borderColor = "rgb(11, 132, 248)";
  // });
  // let startTime = document.getElementById("1col2")
  // document.getElementById("1col2").addEventListener("focusout", function (e) {
  //   document.getElementById(e.target.id).style.borderColor = "gray";
  //   let currentId = (e.target.id).charAt(0);
  //   let temp = parseInt(currentId);
  //   if (e.target.value > (((document.getElementById("VDemo").duration).toString()).toHHMMSS())) {
  //     document.getElementById(e.target.id).style.borderColor = "red";
  //     document.getElementById(e.target.id).title = "Can't be more than video length";
  //     e.target.value = "0";
  //   }
  //   else {
  //     if (temp > 1) {
  //       let prevId = (temp - 1) + "col3";
  //       let prevTime = document.getElementById(prevId).value;
  //       let currentTime = e.target.value;
  //       if (currentTime < prevTime) {
  //         document.getElementById(e.target.id).style.borderColor = "red";
  //         document.getElementById(e.target.id).title = "Can't be less than previous End Time";
  //         e.target.value = "0";
  //       }
  //       else {
  //         document.getElementById(e.target.id).title = "";
  //         document.getElementById(e.target.id).style.borderColor = "gray";
  //         startTime[temp] = e.target.value + ".000";
  //         make_and_load_VTT();
  //       }
  //     }
  //     else {
  //       startTime[temp] = e.target.value + ".000";
  //       make_and_load_VTT();
  //     }
  //   }
  // });


  // document.getElementById("1col3").addEventListener("focusin", function (e) {
  //   document.getElementById(e.target.id).style.borderColor = "rgb(11, 132, 248)";
  // });

  // document.getElementById("1col3").addEventListener("focusout", function (e) {
  //   document.getElementById(e.target.id).style.borderColor = "gray";
  //   let currentId = (e.target.id).charAt(0);
  //   let temp = parseInt(currentId);

  //   let prevId = temp + "col2";
  //   let prevTime = document.getElementById(prevId).value;
  //   let currentTime = e.target.value;
  //   if (currentTime > (((document.getElementById("VDemo").duration).toString()).toHHMMSS())) {
  //     document.getElementById(e.target.id).style.borderColor = "red";
  //     document.getElementById(e.target.id).title = "Can't be more than video length";
  //     e.target.value = "0";
  //   }
  //   else {
  //     if (currentTime < prevTime) {
  //       document.getElementById(e.target.id).style.borderColor = "red";
  //       document.getElementById(e.target.id).title = "End Time can't be less than start time";
  //       e.target.value = "0";
  //     }
  //     else {
  //       document.getElementById(e.target.id).title = "";
  //       document.getElementById(e.target.id).style.borderColor = "gray";
  //       endTime[temp] = e.target.value + ".000";
  //       make_and_load_VTT();
  //     }
  //   }
  // });

  // document.getElementById("1col4").addEventListener("focusout", function (e) {
  //   let currentId = (e.target.id).charAt(0);
  //   let temp = parseInt(currentId);
  //   subText[temp] = e.target.value;
  //   make_and_load_VTT();
  // });
}
// generate srt from written subtitles
function generateSRT(subtitleText, startTimeInSeconds, endTimeInSeconds) {
  const srtContent = [];
  const subtitleLines = subtitleText.trim().split('\n');
  let sequence = 1;
  for (const line of subtitleLines) {
    const startTime = formatTime(startTimeInSeconds);
    const endTime = formatTime(endTimeInSeconds);

    srtContent.push(`${sequence}`);
    srtContent.push(`${startTime} --> ${endTime}`);
    srtContent.push(line);
    srtContent.push('');

    sequence++;
  }
  return srtContent.join('\n');
}
//export srt
function exportSRT() {
  function timeToSeconds(time) {
    const parts = time.split(":").map(parseFloat);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  let srtContent = ""; // Initialize with an empty string to accumulate the content
  rowData.forEach((data) => {
    const startTime = `${data.timeInputs[0].value}:${data.timeInputs[1].value}:${data.timeInputs[2].value}`;
    const endTime = `${data.timeInputs[3].value}:${data.timeInputs[4].value}:${data.timeInputs[5].value}`;
    const startTimeInSeconds = timeToSeconds(startTime);
    const endTimeInSeconds = timeToSeconds(endTime);
    let subtitleText;

    if (data.subtitleInput.value == "") {
      subtitleText = "New Subtitle";
    } else {
      subtitleText = data.subtitleInput.value;
    }
    const subtitleSRT = generateSRT(subtitleText, startTimeInSeconds, endTimeInSeconds);
    srtContent += subtitleSRT + "\n"; // Accumulate the subtitle content
  });

  const tempBlob = new Blob([srtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(tempBlob);

  let tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.download = "Subtitles.srt";
  tempLink.click();
}
// export video as a .mp4
async function exportVideo() {
  function timeToSeconds(time) {
    const parts = time.split(":").map(parseFloat);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  let InputFormat = "mp4";
  let textSize = "50";
  let textColor = "white";
  let backgroundColor = "#000000b3";
  let startTime = `${sh.value}:${sm.value}:${ss.value}` // Start time for the overlay in HH:MM:SS format
  let endTime = `${eh.value}:${em.value}:${es.value}` // End time for the overlay in HH:MM:SS format
  let vfCommand = `x=(w-tw)/2:y=h-70`;
  let fontFilePath = "/path/to/ARIAL.ttf";
  await ffmpeg.FS("writeFile", fontFilePath.split("/").pop(), await fetchFile(fontFilePath));
  let filterArray = [];
  rowData.forEach((data) => {
    const startTime = `${data.timeInputs[0].value}:${data.timeInputs[1].value}:${data.timeInputs[2].value}`;
    const endTime = `${data.timeInputs[3].value}:${data.timeInputs[4].value}:${data.timeInputs[5].value}`;
    const startTimeInSeconds = timeToSeconds(startTime);
    const endTimeInSeconds = timeToSeconds(endTime);
    let subtitleText
    if (data.subtitleInput.value == "") {
      subtitleText = "New Subtitle"
    } else {
      subtitleText = data.subtitleInput.value;
    }
    const subtitleOverlayFilter = `drawtext=text='${subtitleText.replace(/\n/g, '\\n')}':${vfCommand}:fontsize=${textSize}:fontcolor=${textColor}:box=1:boxcolor=${backgroundColor}:fontfile=${fontFilePath.split("/").pop()}:enable='between(t,${startTimeInSeconds},${endTimeInSeconds})'`;
    filterArray.push(subtitleOverlayFilter);
  });
  const combinedFilters = filterArray.join(',');
  const textOverlayFilter = `[0:v]${combinedFilters} [vout]`;
  const command = [
    '-i', 'input.mp4',
    '-filter_complex', textOverlayFilter,
    '-map', '[vout]', '-map', '0:a',
    '-c:a', 'copy',
    '-preset', 'ultrafast',
    'Output.mp4'
  ];
  await ffmpeg.run(...command);
  let output = ffmpeg.FS("readFile", "Output.mp4");
  let blob = new Blob([output.buffer], { type: `video/${InputFormat}` });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `safevideokit-subtitle.mp4`;
  document.body.appendChild(a);
  a.click();
}
String.prototype.toHHMMSS = function () {
  let sec_num = parseInt(this, 10); // don't forget the second param
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}
function padTime(value) {
  return value.toString().padStart(2, '0');
}
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `;
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
