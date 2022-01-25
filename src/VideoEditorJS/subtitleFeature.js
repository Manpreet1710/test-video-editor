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

// Drag and Drop Feature
UploadButton.addEventListener("dragover",function(evt){
  evt.preventDefault();
});

UploadButton.addEventListener("dragenter",function(evt){
  evt.preventDefault();
});

UploadButton.addEventListener("drop",function(evt){
  evt.preventDefault();
  let tempInput=document.getElementById("files");
  tempInput.files=evt.dataTransfer.files;
  let tempType=(tempInput.files[0].name).split(".");
  if(tempType[tempType.length-1]=="mp4")
  {
    let event = new Event('change');
    tempInput.dispatchEvent(event);
  }
  else
  {
    document.getElementById("ErrorBoxMessage").innerText="This type of File could not be processed. Please upload a .mp4 file.";
    document.getElementById("ErrorBox").style.display="block";
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
  let temp=(VideoSourceFile.name).split(".");
  if(temp[temp.length-1]=="mp4")
  {
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
  else
  {
    document.getElementById("ErrorBoxMessage").innerText="This type of File could not be processed. Please upload a .mp4 file.";
    document.getElementById("ErrorBox").style.display="block";
    Landing.style.display = 'none'
    InputButtonContainer.style.display = 'none'
    Workspace.style.display = 'none'
  }
}

const UploadSubs = async (input) => {
  
  if(input.files.length>0)
  {
    VideoSourceFile = input.files[0];
    let temporary=(VideoSourceFile.name).split('.');
    type=temporary[temporary.length-1];
  }
  
  if(type=="vtt"||type=="srt")
  {
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
  else
  {
    document.getElementById("ErrorBoxMessage").innerText="This type of File could not be processed. Please upload .srt or .vtt file.";
    document.getElementById("ErrorBox").style.display="block";
    LandingPage.style.display = 'none'
    Workspace.style.display = 'none'
  }
}

const fetch_and_load_Video_to_FFmpeg = async () => {
  try{
    await ffmpeg.load()
  }catch(e)
      {
        document.getElementById("ErrorBoxMessage").innerHTML="<center><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#ff0000' class='bi bi-exclamation-triangle' viewBox='0 0 16 16'><path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z'/><path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z'/></svg><br><b>Your file couldn't be processed on this browser. Please try this on latest version of Google Chrome Desktop.</b></center>";
        document.getElementById("ErrorBox").style.display="block";
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

const fetch_and_load_Subs_to_FFmpeg = async () => {
  if(!ffmpeg.isLoaded())
  {
    try{
      await ffmpeg.load();
    }catch(e)
      {
        document.getElementById("ErrorBoxMessage").innerHTML="<center><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#ff0000' class='bi bi-exclamation-triangle' viewBox='0 0 16 16'><path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z'/><path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z'/></svg><br><b>Your file couldn't be processed on this browser. Please try this on latest version of Google Chrome Desktop.</b></center>";
        document.getElementById("ErrorBox").style.display="block";
        Landing.style.display = 'none'
        InputButtonContainer.style.display = 'none'
        Workspace.style.display = 'none'
      }
  }
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
  Landing.style.display = 'none'
  InputButtonContainer.style.display = 'none'
  Workspace.style.display = 'none'
  document.getElementsByClassName('Workspace')[0].style.display='none';
  document.getElementsByClassName('Body')[0].style.overflow='hidden';
  document.getElementById('EditBox').style.display='block';
  document.getElementById('VDemo').src=VFileSrc.src;

  document.getElementById('1col4').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
  let tableDiv=document.getElementById("subTable");

  tableDiv.scrollTop=tableDiv.scrollHeight;

  document.getElementById("1col2").addEventListener("focusin",function(e){
    document.getElementById(e.target.id).style.borderColor="rgb(11, 132, 248)";
  });

  document.getElementById("1col2").addEventListener("focusout",function(e){
      document.getElementById(e.target.id).style.borderColor="gray";
      let currentId=(e.target.id).charAt(0);
      let temp=parseInt(currentId);
      if(e.target.value>(((document.getElementById("VDemo").duration).toString()).toHHMMSS())){
        document.getElementById(e.target.id).style.borderColor="red";
        document.getElementById(e.target.id).title="Can't be more than video length";
        e.target.value="0";
      }
      else{
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
              startTime[temp]=e.target.value+".000";
              make_and_load_VTT();
          }
      }
      else
      {
        startTime[temp]=e.target.value+".000";
        make_and_load_VTT();
      }
      }
  });

  document.getElementById("1col3").addEventListener("focusin",function(e){
    document.getElementById(e.target.id).style.borderColor="rgb(11, 132, 248)";
  });

  document.getElementById("1col3").addEventListener("focusout",function(e){
      document.getElementById(e.target.id).style.borderColor="gray";
      let currentId=(e.target.id).charAt(0);
      let temp=parseInt(currentId);
      
      let prevId=temp+"col2";
      let prevTime=document.getElementById(prevId).value;
      let currentTime=e.target.value;
      if(currentTime>(((document.getElementById("VDemo").duration).toString()).toHHMMSS())){
        document.getElementById(e.target.id).style.borderColor="red";
        document.getElementById(e.target.id).title="Can't be more than video length";
        e.target.value="0";
      }
      else{
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
          endTime[temp]=e.target.value+".000";
          make_and_load_VTT();
      }
      }
  });

  document.getElementById("1col4").addEventListener("focusout",function(e){
      let currentId=(e.target.id).charAt(0);
      let temp=parseInt(currentId);
      subText[temp]=e.target.value;
      make_and_load_VTT();
  });
}

let rowCounter=1;

let startTime=[],endTime=[],subText=[];

function addRow()
{
    rowCounter++;

    let table=document.getElementById("cue-table");

    let row=document.createElement('tr');
    row.id=rowCounter+"row";
//    let col1=document.createElement('td');
    let col2=document.createElement('td');
//    let col3=document.createElement('td');
    let col4=document.createElement('td');

//    col1.innerText=rowCounter;

    let col2Text=document.createElement('input');
    col2Text.type="time";
    col2Text.step="1";
    let id2=rowCounter+"col2";
    col2Text.id=id2;

    col2.appendChild(col2Text);
    col2.appendChild(document.createElement('br'));
    col2.appendChild(document.createElement('br'));

    let col3Text=document.createElement('input');
    col3Text.type="time";
    col3Text.step="1";
    let id3=rowCounter+"col3";
    col3Text.id=id3;

    col2.appendChild(col3Text);

    let col4Text=document.createElement('textarea');
    col4Text.rows="3";
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
//    row.appendChild(col3);
    row.appendChild(col4);

    table.appendChild(row);

    let tableDiv=document.getElementById("subTable");

    tableDiv.scrollTop=tableDiv.scrollHeight;

    document.getElementById(id2).addEventListener("focusin",function(e){
      document.getElementById(e.target.id).style.borderColor="rgb(11, 132, 248)";
    });

    document.getElementById(id2).addEventListener("focusout",function(e){
        document.getElementById(e.target.id).style.borderColor="gray";
        let currentId=(e.target.id).charAt(0);
        let temp=parseInt(currentId);
        if(e.target.value>(((document.getElementById("VDemo").duration).toString()).toHHMMSS())){
          document.getElementById(e.target.id).style.borderColor="red";
          document.getElementById(e.target.id).title="Can't be more than video length";
          e.target.value="0";
        }
        else{
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
                startTime[temp]=e.target.value+".000";
                make_and_load_VTT();
            }
        }
        else
        {
          startTime[temp]=e.target.value+".000";
          make_and_load_VTT();
        }
        }
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
        if(currentTime>(((document.getElementById("VDemo").duration).toString()).toHHMMSS())){
          document.getElementById(e.target.id).style.borderColor="red";
          document.getElementById(e.target.id).title="Can't be more than video length";
          e.target.value="0";
        }
        else{
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
            endTime[temp]=e.target.value+".000";
            make_and_load_VTT();
        }
        }
    });

    document.getElementById(id4).addEventListener("focusout",function(e){
        let currentId=(e.target.id).charAt(0);
        let temp=parseInt(currentId);
        subText[temp]=e.target.value;
        make_and_load_VTT();
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
    make_and_load_VTT();
  }
}

function make_and_load_VTT() {
  if(startTime.length>0&&endTime.length>0&&subText.length>0)
  {
    let tempString="WEBVTT\n\n";
    for(let i=1;i<startTime.length;i++)
    {
      tempString+=startTime[i]+" --> "+endTime[i]+"\n"+subText[i]+"\n\n";
    }
    let tempBlob=new Blob([tempString],{type: 'text\plain'});
    let url=URL.createObjectURL(tempBlob);
    document.getElementById("TDemo").src=url;
    document.getElementById("TDemo").track.mode = 'showing';
  }
}

function exportSRT() {
    Spinner.style.display = 'none'
    document.getElementsByClassName('Body')[0].style.overflow='auto';
    document.getElementById("EditBox").style.display = 'none'
    Landing.style.display = 'inherit'
    CancelProcess.style.display = 'inherit'
    let tempString="";
    for(let i=1;i<startTime.length;i++)
    {
      if(typeof startTime[i]!="undefined")
        if(typeof endTime[i]!="undefined")
        {
          tempString+=i+"\n";
          for(let j=0;j<startTime[i].length;j++)
          {
            if(startTime[i].charAt(j)!='.')
              tempString+=startTime[i].charAt(j);
            else
              tempString+=',';
          }
          tempString+=" --> ";
          for(let k=0;k<endTime[i].length;k++)
          {
            if(endTime[i].charAt(k)!='.')
              tempString+=endTime[i].charAt(k);
            else
              tempString+=',';
          }
          tempString+="\n"+subText[i]+"\n\n";
        }
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
    document.getElementsByClassName('Body')[0].style.overflow='auto';
    document.getElementById("EditBox").style.display = 'none'
    let tempString="WEBVTT\n\n";
    for(let i=1;i<startTime.length;i++)
    {
      if(typeof startTime[i]!="undefined")
        if(typeof endTime[i]!="undefined")
          tempString+=startTime[i]+" --> "+endTime[i]+"\n"+subText[i]+"\n\n";
    }
    let tempBlob=new Blob([tempString],{type: 'text\plain'});
    const reader=new FileReader();
    reader.readAsDataURL(tempBlob);
    reader.addEventListener('load',async ()=>{
        try{
          SubSourceurl=reader.result;
          type="vtt";
          fetch_and_load_Subs_to_FFmpeg();
        }catch(e)
        {
          document.getElementById("ErrorBoxMessage").innerHTML="<center><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#ff0000' class='bi bi-exclamation-triangle' viewBox='0 0 16 16'><path d='M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z'/><path d='M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z'/></svg><br><b>Your file couldn't be processed on this browser. Please try this on latest version of Google Chrome Desktop.</b></center>";
          document.getElementById("ErrorBox").style.display="block";
          Landing.style.display = 'none'
          InputButtonContainer.style.display = 'none'
          Workspace.style.display = 'none'
        }
    },false);
}

String.prototype.toHHMMSS = function () {
  let sec_num = parseInt(this, 10); // don't forget the second param
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours + ':' + minutes + ':' + seconds;
}
  
