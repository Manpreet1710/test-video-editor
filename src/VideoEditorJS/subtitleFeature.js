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
let SubSourceurl=null;
var sourceBuffer = null
let SubSourceBuffer=null;
let type=null;

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
const closeLoader = () => {}
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
console.log = function () {
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
    var percentage = (seconds / videoTime) * 100
    ProgressBar.style.width = percentage + '%'
    LandingText.innerHTML = `Please wait ,we are adding subtitles to your video in the most secure way<br><span>${
      percentage > 0 ? percentage.toFixed(0) : 0
    }%</span>`
  }
}
const get_video_source_from_input = async (input) => {
  LandingText.innerText = 'Please wait,processing your video'
  Spinner.style.display = 'inherit'
  UploadButton.style.display = 'none'
  VideoSourceFile = input.files[0]
  VFileSrc.src=URL.createObjectURL(VideoSourceFile);
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

const UploadSubs = async (input) => {
  
  if(input.files.length>0)
  {
    VideoSourceFile = input.files[0];
    let temporary=(VideoSourceFile.name).split('.');
    type=temporary[temporary.length-1];
  }
  
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

const fetch_and_load_Video_to_FFmpeg = async () => {
  await ffmpeg.load()
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

const fetch_and_load_Subs_to_FFmpeg = async () => {
  if(!ffmpeg.isLoaded())
    await ffmpeg.load();
  SubSourceBuffer = await fetch(SubSourceurl).then((r) => r.arrayBuffer())
  ffmpeg.FS(
    'writeFile',
    'subtitle.'+type,
    new Uint8Array(SubSourceBuffer, 0, SubSourceBuffer.byteLength)
  )
  addSubs();
}

var addSubs = async () => {
  Spinner.style.display = 'none'
  Workspace.style.display = 'none'
  Landing.style.display = 'inherit'
  CancelProcess.style.display = 'inherit'
  var FFMPEGCommand = `-i input.mp4 -i subtitle.`+type+` -map 0 -map 1 -vcodec copy -acodec copy -c:s:0 copy -c:s mov_text Output.mp4`;
  var ArrayofInstructions = FFMPEGCommand.split(' ');
  await ffmpeg.run(...ArrayofInstructions);
  CancelProcess.style.display = 'none'
  LandingText.style.display = 'none'
  initateDownload();
}

const initateDownload = async () => {
  const output = ffmpeg.FS('readFile', `Output.mp4`);
  let hrefLink = URL.createObjectURL(
    new Blob([output.buffer], { type: `video/mp4` })
  );

  LoadingText.style.display = 'inherit'
  LoadingText.innerText = 'Thanks for your patience'
  DownloadBox.style.display = 'inherit'
  link.addEventListener('click',()=>handleDownload(hrefLink,"SubtitledVideo.mp4"));
}

let handleDownload = (src,fname) => {
  let tempLink = document.createElement('a')
  tempLink.href = src
  tempLink.download = fname;
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

function WriteSubs() {
  document.getElementsByClassName('Workspace')[0].style.display='none';
  document.getElementById('EditSubs').style.display='inherit';
  document.getElementById('VDemo').src=VFileSrc.src;
}

let rowCounter=0;

let startTime=[],endTime=[],subText=[];

function addRow()
{
    rowCounter++;

    let table=document.getElementById("cue-table");

    let row=document.createElement('tr');
    row.id=rowCounter+"row";
//    let col1=document.createElement('td');
    let col2=document.createElement('td');
    let col3=document.createElement('td');
    let col4=document.createElement('td');

//    col1.innerText=rowCounter;

    let col2Text=document.createElement('input');
    col2Text.type="time";
    col2Text.step="1";
    let id2=rowCounter+"col2";
    col2Text.id=id2;

    col2.appendChild(col2Text);

    let col3Text=document.createElement('input');
    col3Text.type="time";
    col3Text.step="1";
    let id3=rowCounter+"col3";
    col3Text.id=id3;

    col3.appendChild(col3Text);

    let col4Text=document.createElement('textarea');
    col4Text.cols="25";
    col4Text.rows="2";
    col4Text.setAttribute('style', 'overflow-y:hidden;');
    col4Text.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
    col4Text.style.resize="none";
    col4Text.placeholder="Enter subtitle text here";
    let id4=rowCounter+"col4";
    col4Text.id=id4;

    col4.appendChild(col4Text);

//    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);

    table.appendChild(row);

    let tableDiv=document.getElementsByClassName("subTable")[0];

    tableDiv.scrollTop=tableDiv.scrollHeight;

    document.getElementById(id2).addEventListener("focusin",function(e){
      document.getElementById(e.target.id).style.borderColor="rgb(11, 132, 248)";
    });

    document.getElementById(id2).addEventListener("focusout",function(e){
        document.getElementById(e.target.id).style.borderColor="gray";
        let currentId=(e.target.id).charAt(0);
        let temp=parseInt(currentId);
        if(temp>1)
        {
            let prevId=(temp-1)+"col3";
            let prevTime=document.getElementById(prevId).value;
            let currentTime=e.target.value;
            if(currentTime<prevTime)
            {   
                document.getElementById(e.target.id).style.borderColor="red";
                document.getElementById(e.target.id).title="Can't be less than previous End Time";
                e.target.value="0";
            }
            else
            {
                document.getElementById(e.target.id).title="";
                document.getElementById(e.target.id).style.borderColor="gray";
                startTime[temp]=e.target.value+",000";
            }
        }
        else
            startTime[temp]=e.target.value+",000";
    });

    document.getElementById(id3).addEventListener("focusin",function(e){
      document.getElementById(e.target.id).style.borderColor="rgb(11, 132, 248)";
    });

    document.getElementById(id3).addEventListener("focusout",function(e){
        document.getElementById(e.target.id).style.borderColor="gray";
        let currentId=(e.target.id).charAt(0);
        let temp=parseInt(currentId);
        
        let prevId=temp+"col2";
        let prevTime=document.getElementById(prevId).value;
        let currentTime=e.target.value;
        if(currentTime<prevTime)
        {    
            document.getElementById(e.target.id).style.borderColor="red";
            document.getElementById(e.target.id).title="End Time can't be less than start time";
            e.target.value="0";
        }
        else
        {
            document.getElementById(e.target.id).title="";
            document.getElementById(e.target.id).style.borderColor="gray";
            endTime[temp]=e.target.value+",000";
        }
    });

    document.getElementById(id4).addEventListener("focusout",function(e){
        let currentId=(e.target.id).charAt(0);
        let temp=parseInt(currentId);
        subText[temp]=e.target.value;
    });
}

function deleteLast() {
  if(rowCounter>0)
  {
    document.getElementById(rowCounter+"row").remove();
    startTime.splice(rowCounter,1);
    endTime.splice(rowCounter,1);
    subText.splice(rowCounter,1);
    rowCounter--;
  }
}

function exportSRT() {
    Spinner.style.display = 'none'
    document.getElementById("EditSubs").style.display = 'none'
    Landing.style.display = 'inherit'
    CancelProcess.style.display = 'inherit'
    let tempString="";
    for(let i=1;i<startTime.length;i++)
    {
      if(typeof startTime[i]!="undefined")
        if(typeof endTime[i]!="undefined")
          tempString+=i+"\n"+startTime[i]+" --> "+endTime[i]+"\n"+subText[i]+"\n\n";
    }
    let tempBlob=new Blob([tempString],{type: 'text\plain'});
    let url=URL.createObjectURL(tempBlob);
    CancelProcess.style.display = 'none'
    LandingText.style.display = 'none'

    LoadingText.style.display = 'inherit'
    LoadingText.innerText = 'Thanks for your patience'
    DownloadBox.style.display = 'inherit'
    link.addEventListener('click',()=>handleDownload(url,"Subtitles.srt"));
}

function uploadSRT() {
    Spinner.style.display = 'none'
    document.getElementById("EditSubs").style.display = 'none'
    let tempString="";
    for(let i=1;i<startTime.length;i++)
    {
      if(typeof startTime[i]!="undefined")
        if(typeof endTime[i]!="undefined")
          tempString+=i+"\n"+startTime[i]+" --> "+endTime[i]+"\n"+subText[i]+"\n\n";
    }
    let tempBlob=new Blob([tempString],{type: 'text\plain'});
    const reader=new FileReader();
    reader.readAsDataURL(tempBlob);
    reader.addEventListener('load',async ()=>{
        SubSourceurl=reader.result;
        type="srt";
        fetch_and_load_Subs_to_FFmpeg();
    },false);
}