let addr = (window.location.href).split("-");
let site = addr[addr.length - 1];


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
let SubSourceurl = null;
var sourceBuffer = null
let SubSourceBuffer = null;
let type = null;
let percentage = 0;

let cards = document.getElementsByClassName("check-item");
let flag = true;

let width, height, asW, asH, fps, dimens;
let counter = 0;
let downloadLinks = [];

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
    if (tempType[tempType.length-1]=="mp4"||tempType[tempType.length-1]=="mov"||tempType[tempType.length-1]=="ogg"||tempType[tempType.length-1]=="webm") {
        type = tempType.length-1;
        let event = new Event('change');
        tempInput.dispatchEvent(event);
    }
    else {
        document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload a supported video file.";
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
const mimeTypes = 'video/mp4,video/mov,video/ogg,video/webm'
const filemimes = ['.mp4', '.mov', '.ogg', '.webm']
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
    console.log(file)
    console.log(input)
    console.log(input.files[0])
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
        let pTemp = ((seconds / (videoTime)) * 100)
        if(pTemp<0)
            flag = false;
        if(parseInt(pTemp.toFixed(0))>=100 && flag==false)
        {
            percentage+=pTemp/cards.length;
            flag = true;
        }
        //console.stdlog(pTemp,percentage);
        ProgressBar.style.width = percentage + '%'
        LandingText.innerHTML = `Please wait ,we are resizing your video in the most secure way<br><span>${percentage > 0 ? percentage.toFixed(0) : 0
            }%</span>`
    }
}
const get_video_source_from_input = async (input) => {
    LandingText.innerText = 'Please wait,processing your video'
    Spinner.style.display = 'inherit'
    UploadButton.style.display = 'none'
    VideoSourceFile = input.files[0]
    let temp = (VideoSourceFile.name).split(".");
    if (temp[temp.length-1]=="mp4"||temp[temp.length-1]=="mov"||temp[temp.length-1]=="ogg"||temp[temp.length-1]=="webm") {
        type = temp[temp.length-1];
        VFileSrc.src = URL.createObjectURL(VideoSourceFile);
        VFileSrc.addEventListener('loadedmetadata', function() {
            this.currentTime = 1;
          }, false);
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
    else {
        document.getElementById("ErrorBoxMessage").innerText = "This type of File could not be processed. Please upload a supported video file.";
        document.getElementById("ErrorBox").style.display = "block";
        Landing.style.display = 'none'
        InputButtonContainer.style.display = 'none'
        Workspace.style.display = 'none'
    }
}

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
        `input.`+type,
        new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    )
    Landing.style.display = 'none'
    InputButtonContainer.style.display = 'none'
    Workspace.style.display = 'inherit'
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", "/assets/resizeSocialData/resolutionData.json", true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            dimens = JSON.parse(rawFile.responseText)[site];
            for(let i = 0; i < Object.keys(dimens).length;i++){
                //console.log(dimens[i.toString()]["name"]);
                let w = 0 , h = 0;
                
                w = parseInt(dimens[i.toString()]["width"]);
                h = parseInt(dimens[i.toString()]["height"]);

                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                ctx.drawImage(VFileSrc,0,0,VFileSrc.videoWidth,VFileSrc.videoHeight);
                let dataURI = canvas.toDataURL('image/jpeg');
                
                let cardHeader = document.createElement("div");
                cardHeader.setAttribute("class","card-header");
                let temp = document.createElement("div");
                temp.className = "row";
                let cardHeader1 = document.createElement("div");
                cardHeader1.className = "col-md-auto";
                cardHeader1.innerHTML = "<h5>"+dimens[i.toString()]["name"]+"</h5>";

                let checkDiv = document.createElement("div");
                checkDiv.className = "col-md-auto ml-auto";

                let cardHeader2 = document.createElement("input");
                cardHeader2.type = "checkbox";
                cardHeader2.classList.add("check-item","align-baseline");
                cardHeader2.style.width = "30px";
                cardHeader2.style.height = "30px";
                temp.appendChild(cardHeader1);
                checkDiv.appendChild(cardHeader2);
                temp.appendChild(checkDiv);
                cardHeader.appendChild(temp);

                let cardBody = document.createElement("div");
                cardBody.setAttribute("class","card-body");

                let cardImg = document.createElement("img");
                cardImg.setAttribute("class","card-img-top");
                const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                const VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                cardImg.style.width = (100*w/VW)/4+"vw";
                cardImg.style.height = (100*h/VH)/4+"vh";
                cardImg.src = dataURI;
                cardBody.appendChild(cardImg);

                let cardText = document.createElement("h6");
                cardText.innerHTML = w+" X "+h;
                cardText.style.float = "right";
                let cardFooter = document.createElement("div");
                cardFooter.setAttribute("class","card-footer");
                cardFooter.appendChild(cardText);

                let card = document.createElement("div");
                card.setAttribute("class","card");
                card.style.boxShadow = "gray";

                card.appendChild(cardHeader);
                card.appendChild(cardBody);
                card.appendChild(cardFooter);

                document.getElementById("row").appendChild(card);

                // Workspace.appendChild(col);
            }
        }
    }
    rawFile.send(null);
}

async function setSize(e) {
    // let percentage = 0;
    Spinner.style.display = 'none'
    Workspace.style.display = 'none'
    Landing.style.display = 'inherit'
    CancelProcess.style.display = 'inherit'
    // ProgressBar.style.width = '0%'
    // LandingText.innerHTML = `Please wait ,we are resizing your video in the most secure way<br><span>${percentage > 0 ? percentage.toFixed(0) : 0}%</span>`
    cards = document.getElementsByClassName("check-item");
    if (e == "All") {
        for (let i = 0; i < cards.length; i++) {
            width = parseFloat(dimens[i.toString()]["width"]);
            height = parseFloat(dimens[i.toString()]["height"]);
            asW = parseFloat(dimens[i.toString()]["aspect-width"]);
            asH = parseFloat(dimens[i.toString()]["aspect-height"]);
            fps = parseFloat(dimens[i.toString()]["fps"]);
            await resizeVideo();
            // percentage += parseInt(100 / cards.length);
            // ProgressBar.style.width = percentage + '%'
            // LandingText.innerHTML = `Please wait ,we are resizing your video in the most secure way<br><span>${percentage > 0 ? percentage.toFixed(0) : 0}%</span>`
        }
    }
    else {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].checked) {
                width = parseFloat(dimens[i.toString()]["width"]);
                height = parseFloat(dimens[i.toString()]["height"]);
                asW = parseFloat(dimens[i.toString()]["aspect-width"]);
                asH = parseFloat(dimens[i.toString()]["aspect-height"]);
                fps = parseFloat(dimens[i.toString()]["fps"]);
                await resizeVideo();
                // percentage += parseInt(100 / cards.length);
                // ProgressBar.style.width = percentage + '%'
                // LandingText.innerHTML = `Please wait ,we are resizing your video in the most secure way<br><span>${percentage > 0 ? percentage.toFixed(0) : 0}%</span>`
            }
        }
    }
    if (percentage < 100) {
        for(let i=percentage;i<=100;i++)
        {
                ProgressBar.style.width = i + '%'
                LandingText.innerHTML = `Please wait ,we are resizing your video in the most secure way<br><span>${i.toFixed(0)}%</span>`   
                await new Promise(resolve=>setTimeout(resolve,500));
        }
    }
    setTimeout(()=>{
        CancelProcess.style.display = 'none'
        LandingText.style.display = 'none'
        LoadingText.style.display = 'inherit'
        LoadingText.innerText = 'Thanks for your patience'
        DownloadBox.style.display = 'inherit'
        link.addEventListener('click', () => handleDownload(downloadLinks));
    },2000)
}


var resizeVideo = async () => {
    
    var FFMPEGCommand = `-i input.`+type+` -vf scale=`+width+`:`+height+` -aspect `+asW+`:`+asH+` -filter:v fps=`+fps +` -crf 18 Output.`+type;
    var ArrayofInstructions = FFMPEGCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);
    initateDownload();
}

const initateDownload = async () => {
    const output = ffmpeg.FS('readFile', `Output.` + type);
    let hrefLink = new Blob([output.buffer], { type: `video/*` });

    downloadLinks[counter++] = hrefLink;
}

let handleDownload = (src) => {
    let zip = new JSZip();

    for (let i = 0; i < src.length; i++) {
        zip.file("Output"+(i+1)+"."+type,src[i]);
    }
    zip.generateAsync({type:"base64"}).then(function (base64) {
        let hrefLink = "data:application/zip;base64," + base64;
        let tempLink = document.createElement("a");
        tempLink.href = hrefLink;
        tempLink.download = "Output.zip";
        tempLink.click();
        setTimeout(() => {
            if (lang === 'en') {
                window.location.href = `/download?tool=${pageTool}`
            } else {
                window.location.href = `/${lang}/download?tool=${pageTool}`
            }
        }, 1000)
    }, function (err) {
        console.log(err);
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
