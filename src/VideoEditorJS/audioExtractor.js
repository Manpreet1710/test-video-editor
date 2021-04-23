const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
var ProgressBar=document.querySelector('.ProgressBar');
var VideoSourceFile=null;
var Workspace=document.querySelector(".Workspace");
var UploadButton=document.querySelector(".Button");
var Spinner=document.querySelector(".Spinner");
var LandingText=document.querySelector('.Landingtext');
var InputButtonContainer=document.querySelector(".Button");
var ActualSourceurl=null;
var sourceBuffer=null;
var settings={
    outputFormat:"mp3",
    audioQuality:"default"
}
var LoadingText=document.querySelector('.LoadingText');
var Landing=document.querySelector(".Landing");
var values=document.querySelectorAll(".value");
const link = document.querySelector(".DownloadLink");
var DownloadBox=document.querySelector('.DownloadBox');
var videoTime=0;
var videoSource=document.createElement('video');
videoSource.setAttribute("type","video/mp4")
videoSource.addEventListener('loadeddata',(e)=>{
    videoTime=e.path[0].duration;
});
console.stdlog = console.log.bind(console);  
console.log = function(){
 
    let consoleLog=Array.from(arguments);
    
    let CurrentTime=null;
    if(consoleLog[0].indexOf("time=")!=-1)
    {
      CurrentTime=consoleLog[0].slice(consoleLog[0].indexOf("time="),consoleLog[0].indexOf("time=")+ consoleLog[0].substring(consoleLog[0].indexOf("time=")).indexOf("bitrate="));
    }
    ProgressBar.style.width="0%";
    if(CurrentTime!=null){
      console.stdlog(CurrentTime);
      let a=CurrentTime.slice(5,CurrentTime.length).split(':');
      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
      var percentage=seconds/videoTime*100;
      ProgressBar.style.width=percentage+"%";
      LandingText.innerHTML=`Please wait ,we are extracting audio in the most secure way<br><span>${percentage>0?percentage.toFixed(0):0}%</span>`;
    }
    
}





const get_video_source_from_input=async(input)=>{
    LandingText.innerText="Please wait,processing your video";
    Spinner.style.display="inherit";
    UploadButton.style.display="none";
    VideoSourceFile=input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(VideoSourceFile);

    reader.addEventListener("load", async function () {
      
        videoSource.src=reader.result;
        ActualSourceurl=reader.result;
        fetch_and_load_Video_to_FFmpeg();  
      
    }, false);

    
    

}

const fetch_and_load_Video_to_FFmpeg=async ()=>{
    await ffmpeg.load();
    sourceBuffer= await fetch(ActualSourceurl).then(r => r.arrayBuffer());  
    ffmpeg.FS(
        "writeFile",
        `input.mp4`,
        new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    );  
    Landing.style.display="none";
    InputButtonContainer.style.display="none";
    Workspace.style.display="inherit";
}
var PreviousSelectedValues={
    outputFormat:document.querySelector("#outputFormat #default"),
    audioQuality:document.querySelector("#audioQuality #default")
}

var handle_value_click=(e)=>{
    var CurrentID=e.target.parentElement.parentElement.id
    settings[CurrentID]=e.target.innerText.toLowerCase();
    PreviousSelectedValues[CurrentID].classList.remove("ActiveValue");
    PreviousSelectedValues[CurrentID]=e.target;
    PreviousSelectedValues[CurrentID].classList.add("ActiveValue");
}
values.forEach(value=>value.addEventListener('click',e=>handle_value_click(e)));

const Number_of_Cores=()=>{
    var logicalProcessors = window.navigator.hardwareConcurrency;
    return logicalProcessors;
}
  
var ThreadsCount=(Number_of_Cores())*4;
var ExtractAudio=async ()=>{
    Spinner.style.display="none";
    Workspace.style.display="none";
    Landing.style.display="inherit";
    var FFMPEGCommand=`-i input.mp4 ${(ThreadsCount>16)?`-threads 16`:`-threads ${ThreadsCount}`} -vn${(settings.audioQuality&&settings.audioQuality!=="default")?` -b:a ${settings.audioQuality}`:''} output.${settings.outputFormat}`;
    var ArrayofInstructions=FFMPEGCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);
    LandingText.style.display="none";
    initateDownload();
}

const initateDownload=async ()=>{
  
    // read the MP4 file back from the FFmpeg file system
    const output = ffmpeg.FS("readFile", `output.${settings.outputFormat}`);
    // ... and now do something with the file

    link.href = URL.createObjectURL(
    new Blob([output.buffer], { type:`audio/${settings.outputFormat}` })
    );
    link.download = `Output.${settings.outputFormat}`;
    
    LoadingText.style.display="inherit";
    LoadingText.innerText="Thanks for your patience";
    DownloadBox.style.display="inherit";
    
  }