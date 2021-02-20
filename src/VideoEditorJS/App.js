
//variables
const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
var StartTrimValue=document.querySelector('.StartValue');
var EndTrimValue=document.querySelector('.EndValue');
var Ratio;
var videoSource= document.getElementById("video"); // added for clarity: this is needed
var FinalVideosrc;
var video;
var ActualSourceurl;
var EndTimeinSeconds;
var StartTimeinSeconds=0;
var FramesLayer=document.querySelector(".FramesLayer .Frames");
var DoneButton=document.querySelector('.done');
var CancelButton=document.querySelector('.cancel');
var CurrentCropTop;
var CurrentCropLeft;
var CurrentCropWidth;
var CurrentCropHeight;
var TopError;
var Resizable=document.querySelector('.resizable');
var Trimmers = document.querySelectorAll(".Trimmer");
var isTrimmed=0,isRotated=0,isFlipped=0,isCropped=0;
var StartTime='00:00:00';
var EndTime;
var sourceBuffer;
var EditedBuffer;
var RotationAngle=0;
var DownloadButton=document.querySelector('.Download');
var VideoSourceFile;
var CanvasVideoWidth=640;
var CanvasVideoHeight=480;
var ActualSourceVideoWidth;
var ActualSourceVideoHeight;
var RatioOfResolutions={
    RatioWidth:1,
    RatioHeight:1
}
var Workspace=document.querySelector(".Workspace");
var UploadButton=document.querySelector(".Button");
var Spinner=document.querySelector(".Spinner");
var LandingText=document.querySelector('.Landingtext');
let FinalCropTop;
let FinalCropLeft;
let FinalCropWidth;
let FinalCropHeight;
var LoadingText=document.querySelector(".LoadingText");
var playPauseButton=document.querySelector(".PlayButton");
playPauseButton.style.backgroundImage=`url("../public/styles/media/icons/play.png")`;
let TogglePlay=0;
var InitialStartTrimPosition;
var InitialEndTrimPosition;
var ToggleFlipOptions=0;
var FlipX=document.querySelector('.FHorz');
var FlipY=document.querySelector('.FVert');
var FlipReset=document.querySelector('.FReset');
var QuickDownload=document.querySelector('.QuickDownload');
var SlowDownload=document.querySelector('.SlowDownload');
var ToggleDownloadOptions=0;
var LandingPage=document.querySelector('.Landing');

const TogglePlayPause=()=>{
  if(TogglePlay===1)
  {
    playPauseButton.style.backgroundImage=`url("../public/styles/media/icons/play.png")`;
    videoSource.pause();
    TogglePlay=0;
  }
  else
  {
    playPauseButton.style.backgroundImage=`url("../public/styles/media/icons/pause.png")`;
    playVideoPreview();
    TogglePlay=1;
  }
}

playPauseButton.addEventListener('click',TogglePlayPause);
//this should be called when the video is loaded 
const fetch_and_load_Video_to_FFmpeg=async ()=>{
    await ffmpeg.load();
    sourceBuffer= await fetch(ActualSourceurl).then(r => r.arrayBuffer());  
}




//have to change based on the input

//observer for style change
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        var Target=mutations[0].target;
        if(Target.id=="StartTrim")
        {
            var Left=Target.style.left
            var LeftValue=parseInt(Left.slice(0,Left.indexOf("p")));
            var NewTime=LeftValue*ratio;
            videoSource.currentTime=NewTime;
            StartTimeinSeconds=NewTime;
            var Milliseconds=((NewTime%1).toFixed(1)).toString().slice(1);
            var measuredTime = new Date(null);
            measuredTime.setSeconds(NewTime); // specify value of SECONDS
            var MHSTime = measuredTime.toISOString().substr(11, 8);
            StartTrimValue.innerText=MHSTime;
            StartTime=MHSTime+Milliseconds;
            
        }
        else{
            var Right=Target.style.left
            var RightValue=parseInt(Right.slice(0,Right.indexOf("p")));
            var NewTime=RightValue*ratio;
            var Milliseconds=((NewTime%1).toFixed(1)).toString().slice(1);
            var measuredTime = new Date(null);
            measuredTime.setSeconds(NewTime); // specify value of SECONDS
            var MHSTime = measuredTime.toISOString().substr(11, 8);
            EndTrimValue.innerText=MHSTime;
            EndTime=MHSTime+Milliseconds;
        }
        
        isTrimmed=1
    });    
});
for(let i=0;i<2;++i)
{
    observer.observe(Trimmers[i], { attributes : true, attributeFilter : ['style'] });
}

const Set_actual_video_resolution=(Tempvideo)=>{
  
  InitialStartTrimPosition=Trimmers[0].offsetLeft;
  InitialEndTrimPosition=Trimmers[1].offsetLeft;
  ActualSourceVideoHeight=Tempvideo.videoHeight;
  ActualSourceVideoWidth=Tempvideo.videoWidth; 
  console.log("crop now");
}

const get_video_source_from_input=async(input)=>{
    LandingPage.style.height="90vh";
    LandingText.style.display="none";
    Spinner.style.display="inherit";
    UploadButton.style.display="none";
    Workspace.style.display="inherit";
    VideoSourceFile=input.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(VideoSourceFile);
    let TempVideo=document.createElement('video');
    TempVideo.onloadeddata = function() {
        Set_actual_video_resolution(this);
    };
    reader.addEventListener("load", async function () {
      // convert image file to base64 string
    videoSource.src=reader.result;
    ActualSourceurl=reader.result;
    TempVideo.src=ActualSourceurl;
    fetch_and_load_Video_to_FFmpeg();  
      //generate Frames in FrameLayer
    video=videoSource.cloneNode(true);  
    video.addEventListener('loadeddata', async function() {
        await generateFrames(this);

    });
      
    }, false);

    
    

}




const timer = ms => new Promise(res => setTimeout(res, ms))



const isEmpty=(dataURL)=>
{
    var invalidUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=";
    if(dataURL===invalidUrl)
    return true;
    return false;
}


async function generateFrames(e) {     
    //generate thumbnail URL data
    video.muted=true;
    var duration=e.duration;
    EndTimeinSeconds=duration;
    ratio=duration/(FramesLayer.offsetWidth-20);
    //time conversion for endtime
    var measuredTime = new Date(null);
    measuredTime.setSeconds(duration); // specify value of SECONDS
    var MHSTime = measuredTime.toISOString().substr(11, 8);

    EndTime=MHSTime;
    EndTrimValue.innerText=MHSTime;
    var FrameStep=Math.ceil((duration/19));
    var i=0
    Spinner.style.display="none";
    var previousWorkingFrameData;
    while(video.currentTime<duration)
    {    
        
        video.currentTime=parseFloat(i);
        await timer(200);
        var thecanvas=document.createElement('canvas')
        var context = thecanvas.getContext('2d');
        context.drawImage(video, 0, 0,250,200);
        var dataURL=thecanvas.toDataURL();
        if(!isEmpty(dataURL))
        {
            previousWorkingFrameData=dataURL;
        }               
        else{
            dataURL=previousWorkingFrameData;
        }
        var img = document.createElement('img');
        img.className="Frame";
        img.setAttribute('src', dataURL);
        img.classList.add("Animate");
        FramesLayer.appendChild(img);
        i=i+FrameStep;
}
}


//make the trim elements draggable
dragElement(document.getElementById("StartTrim"));
dragElement(document.getElementById("EndTrim"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
    // set the element's new position:
    let NewPos=elmnt.offsetLeft - pos1;
    if(NewPos>=InitialStartTrimPosition && NewPos<=InitialEndTrimPosition)
    {
    elmnt.style.left = (NewPos) + "px";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


//lets make trim funcitonalities here



const ChangeHandler=(event,value)=>{
    if(value===0)
    {
        StartTime=event.value;
        StartTrimValue.innerText=event.value;
        var a = StartTime.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
        Trimmers[0].style.left=(seconds/ratio)+1+'px';
    }
    else
    {
        
        EndTime=event.value;
        EndTrimValue.innerText=event.value;
        var a = EndTime.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
        Trimmers[1].style.left=(seconds/ratio)+1+'px';
    }

}






const playVideoPreview=async()=>{
    //change actual video src to src#t 00:00 to 00:10 using basic html
    videoSource.src=`${ActualSourceurl}#t=${StartTime},${EndTime}`;
    videoSource.play();
}

const Render_edited_video=async ()=>{
    const outputActual = await ffmpeg.FS("readFile", "Output.mp4");

    var blobUrlActual=URL.createObjectURL(
        new Blob([outputActual.buffer], { type: "video/mp4" })
    );
    FinalVideosrc=blobUrlActual;
}
    

const TrimVideo=async (option)=>{
    ffmpeg.FS(
      "writeFile",
      "inputTrim.mp4",
      new Uint8Array(sourceBuffer, 0,sourceBuffer.byteLength)
    );
    // var TrimCommand=`-i inputTrim.mp4 -ss ${StartTime} -t ${EndTime} -async 1 Output.mp4`;
    // var TrimCommand=`-ss ${StartTime} -t  -i inputTrim.mp4 -acodec copy -vcodec copy -async 1 Output.mp4`;
    // if(option===1)
    var TrimCommand=`-i inputTrim.mp4 -ss ${StartTime} -to ${EndTime}  -c copy Output.mp4`;
    // else
    // var TrimCommand=`-i inputTrim.mp4 -force_key_frames ${StartTime},${EndTime} Output.mp4`;
    //for display
    // var DelayAudioCommandDownload=`-i EditedOutput.mp4 -itsoffset 0.4 -i EditedOutput.mp4 -c:a copy -c:v copy -map 0:v:0 -map 1:a:0 Output.mp4`;
    var ArrayofInstructions=TrimCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);
    // ArrayofInstructions=DelayAudioCommandDownload.split(' ');
    // await ffmpeg.run(...ArrayofInstructions);
    
}

const RotatePreview=(direction)=>{
    var Width,Height;
    if((RotationAngle/90)%2===0)
    {
        Width=480;
        Height=480;
    }
    else
    {
        Width=640;
        Height=480;
    };

    if(direction==2)
    { 
        RotationAngle+=90;
    }
    else{
        RotationAngle-=90;
    }

    videoSource.style.width=Width+'px';
    videoSource.style.height=Height+'px';
    videoSource.style.transform=`rotate(-${RotationAngle}deg)`;   
}

// const CheckRotation=()=>{
//   if(RotationAngle===0) return-1;
//   else if(RotationAngle===90) return 90
//   else if (RotationAngle===-90) return -90
//   else if (RotationAngle===180||RotationAngle===-180) return 180
  
// }

const RotateVideo=async()=>{

    //rotate the video  here
    if(isCropped===1|| isFlipped===1|| isTrimmed===1 || isRotated===1)
    {
        const LastEditedFile= await ffmpeg.FS("readFile", "Output.mp4");
        // console.log(sourceBuffer,[LastEditedFile.buffer]);
        ffmpeg.FS(
            "writeFile",
            "inputRotate.mp4",
            new Uint8Array(LastEditedFile, 0,LastEditedFile.byteLength)
          );
          
    }
    else{
    ffmpeg.FS(
        "writeFile",
        "inputRotate.mp4",
        new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    );
    }
    if(RotationAngle!=0)
    {
    var RotateCommand=`-i inputRotate.mp4 -c copy -metadata:s:v:0 rotate=${RotationAngle} Output.mp4`;
    var ArrayofInstructions=RotateCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);
    isRotated=1
    }
    



}

const Show_or_Hide_Buttons=(Request)=>{
    
    if(Request===0) DownloadButton.style.display="inherit";
    else if(Request===1)
    {
    DoneButton.style.display="none";
    CancelButton.style.display="none";
    Confirm_crop_dimensions_and_crop()
    }
    else if(Request===2)    ResetCrop();

}
     
const InitiateCropping=()=>{
    Resizable.style.display="inherit";
    DoneButton.style.display="inherit";
    CancelButton.style.display="inherit";

}

const ResetCrop=()=>{
  Resizable.style.width="";
  Resizable.style.height="";
  Resizable.style.top="";
  Resizable.style.left="";
  Resizable.style.display="none";
  DoneButton.style.display="none";
  CancelButton.style.display="none";
}


const Set_crop_dimensions=()=>{

        CurrentCropWidth=Resizable.style.width;
        CurrentCropWidth=parseInt(CurrentCropWidth.slice(0,CurrentCropWidth.indexOf('p')));
        CurrentCropHeight=Resizable.style.height;
        CurrentCropHeight=parseInt(CurrentCropHeight.slice(0,CurrentCropHeight.indexOf('p')));
        CurrentCropTop=Resizable.offsetTop;
        CurrentCropLeft=Resizable.offsetLeft;
        
}

const Confirm_crop_dimensions_and_crop=()=>{
    //now change dimension wiith respect to actual video dimension
    //operations here
    RatioOfResolutions.RatioWidth=ActualSourceVideoWidth/CanvasVideoWidth;
    RatioOfResolutions.RatioHeight=ActualSourceVideoHeight/CanvasVideoHeight;
    // console.log({CurrentCropHeight,CurrentCropWidth,CurrentCropTop,CurrentCropLeft})
    FinalCropTop=(CurrentCropTop-179)*RatioOfResolutions.RatioHeight;
    FinalCropLeft=(CurrentCropLeft-544)*RatioOfResolutions.RatioWidth;
    FinalCropWidth=CurrentCropWidth*RatioOfResolutions.RatioWidth;
    FinalCropHeight=CurrentCropHeight*RatioOfResolutions.RatioHeight;
    //display video with croppped dimensions
    //call the crop function or call it atlast
    isCropped=1;
    Show_or_Hide_Buttons(0);
    Resizable.style.display="none";
}

const CropVideo=async()=>{

    if(isFlipped===1|| isRotated===1 || isTrimmed===1)
    {
        const LastEditedFile= await ffmpeg.FS("readFile", "Output.mp4");
        ffmpeg.FS(
            "writeFile",
            "inputCrop.mp4",
            new Uint8Array(LastEditedFile, 0,LastEditedFile.byteLength)
          );
          
    }
    else{

    ffmpeg.FS(
      "writeFile",
      "inputCrop.mp4",
      new Uint8Array(sourceBuffer, 0,sourceBuffer.byteLength)
    );

    }
    // var CropCommand=`-i inputCrop.mp4 -filter:v crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} Output.mp4`;
    // var CropCommand=`-i inputCrop.mp4 -filter:v crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} -c:a copy -qp 0 Output.mp4;`
    // var CropCommand=`-i inputCrop.mp4 -vf crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} -c:v libx264 -crf 0 -c:a copy Output.mp4`;
    var CropCommand=`-i inputCrop.mp4 -vf crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} -threads 5 -preset ultrafast -strict -2 Output.mp4`;
    var ArrayofInstructions=CropCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);


}


const ShowFlipOptions=()=>{
  if(ToggleFlipOptions==0)
  {
    FlipX.style.display="inherit";
    FlipY.style.display="inherit";
    FlipReset.style.display="inherit";
    ToggleFlipOptions=1;
  }
  else{
    FlipX.style.display="none";
    FlipY.style.display="none";
    FlipReset.style.display="none";
    ToggleFlipOptions=0;
  }
  
}

const setFlip=(direction)=>{
    if ((isFlipped===1 && direction===1)||(isFlipped===2 && direction===2))
    {
      isFlipped=0;
    }
    else isFlipped=direction;
    Flip_preview();

}

const Flip_preview=()=>{

  if(isFlipped===2)
  {
    videoSource.style.transform="rotateY(180deg)";
  }
  else if(isFlipped===1){
    videoSource.style.transform="rotateX(180deg)";
  }
  else if(isFlipped===0)
  {
    videoSource.style.transform="rotateX(0deg) rotateY(0deg)";
  }
}

const FlipVideo=async()=>{
    if(isTrimmed===1)
    {
        const LastEditedFile= await ffmpeg.FS("readFile", "Output.mp4");
        ffmpeg.FS(
            "writeFile",
            "inputFlip.mp4",
            new Uint8Array(LastEditedFile, 0,LastEditedFile.byteLength)
          );
          
    }
    else{

    ffmpeg.FS(
      "writeFile",
      "inputFlip.mp4",
      new Uint8Array(sourceBuffer, 0,sourceBuffer.byteLength)
    );

    }
    if(isFlipped===1)
    {
    var FlipCommand="-i inputFlip.mp4 -vf vflip -threads 5 -c:a copy Output.mp4";
    
    }
    else
    {
    var FlipCommand="-i inputFlip.mp4 -vf hflip -threads 5 -c:a copy Output.mp4";
    }
    
    var ArrayofInstructions=FlipCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);


}



const DownloadFile=async ()=>{
    Workspace.style.display="none";
    Spinner.style.display="inherit";
    LoadingText.style.display="inherit";

    if(isTrimmed===1)
    {
    LoadingText.innerText=`Please Wait...Trimming video`;
    await TrimVideo();
    }
    if(isFlipped!==0){
      LoadingText.innerText="Please Wait...Flipping and re-encoding video";
      await FlipVideo();
    }
    if(RotationAngle!==0)
    {
    LoadingText.innerText="Please Wait...Rotating Video";
    await RotateVideo();
    }
    if(isCropped===1)
    {
    LoadingText.innerText="Please Wait...Cropping and re-encoding video";
    await CropVideo(); 
    }
    var link = document.querySelector(".DownloadLink");
    if(isCropped===0&&isTrimmed===0&&isFlipped===0&&isRotated===0)
    {
      LoadingText.innerText="Please Wait...preparing your video";
      link.href = videoSource.src;
    }
    else{
      LoadingText.innerText="Please Wait...preparing your video";
      await Render_edited_video();
      link.href = FinalVideosrc;
    }
    LoadingText.innerText="none";
    Spinner.style.display="none";
    LoadingText.style.display="none";
    // Or maybe get it from the current document
    link.download = "OutputVideo.mp4";
    document.querySelector('.DownloadBox').style.display="inherit";



}



//add event listener for resize

Resizable.addEventListener("mouseup",Set_crop_dimensions)

/*Make resizable div by Hung Nguyen*/
function makeResizableDiv(div) {
    const element = document.querySelector(div);
    TopError=element.offsetTop;
    const resizers = document.querySelectorAll(div + ' .resizer')
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0;i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', function(e) {
        e.preventDefault()
        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
      })
      
      function resize(e) {
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y)
          if (width > minimum_size) {
            element.style.width = width + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
          }
        }
        else if (currentResizer.classList.contains('bottom-left')) {
          const height = original_height + (e.pageY - original_mouse_y)
          const width = original_width - (e.pageX - original_mouse_x)
          if (height > minimum_size) {
            element.style.height = height + 'px'
          }
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
          }
        }
        else if (currentResizer.classList.contains('top-right')) {
          const width = original_width + (e.pageX - original_mouse_x)
          const height = original_height - (e.pageY - original_mouse_y)
          if (width > minimum_size) {
            element.style.width = width + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
          }
        }
        else {
          const width = original_width - (e.pageX - original_mouse_x)
          const height = original_height - (e.pageY - original_mouse_y)
          if (width > minimum_size) {
            element.style.width = width + 'px'
            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
          }
          if (height > minimum_size) {
            element.style.height = height + 'px'
            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
          }
        }
      }
      
      function stopResize() {
        window.removeEventListener('mousemove', resize)
      }
    }
}
makeResizableDiv('.resizable')



// const AnimateDownloadButtons=()=>{
// if(ToggleDownloadOptions===0)
// {
//   QuickDownload.style.display="inherit";
//   SlowDownload.style.display="inherit";
//   QuickDownload.style.opacity=1;
//   SlowDownload.style.opacity=1;
//   QuickDownload.style.top="-30px";
//   SlowDownload.style.top="-60px";
//   ToggleDownloadOptions=1;
// }
// else{
//   QuickDownload.style.opacity=0;
//   SlowDownload.style.opacity=0;
//   QuickDownload.style.top="0px";
//   SlowDownload.style.top="0px";
//   QuickDownload.style.display="none";
//   SlowDownload.style.display="none";
//   ToggleDownloadOptions=0;
// }
// }