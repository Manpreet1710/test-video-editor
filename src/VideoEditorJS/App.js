//variables
const getScript = document.currentScript
const pageTool = getScript.dataset.tool
const fileName = getScript.dataset.filename
const folderName = getScript.dataset.foldername
const lang = getScript.dataset.lang
const { createFFmpeg } = FFmpeg
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
  get_video_source_from_input(input)
}
const dropbox = document.getElementById('dropbox')
dropbox.addEventListener(
  'click',
  async (getDropBoxFile, showLoader, closeLoader) => {
    const getFile = chooseFromDropbox()
  }
)
const ffmpeg = createFFmpeg({ log: true })
let setAll = (obj, val, key) => Object.keys(obj).forEach((k) => (obj[k] = val))
var previous_feature_selected = null
var previous_feature_displayed = null
var videoTime = 0
var ButtonLabel = document.getElementById('ButtonLabel')
var TrimInfo = document.querySelector('.TrimInfo')
var CancelProgressOverlay = document.getElementById('OverlayCancel')
let handleDownload = (src) => {
  let tempLink = document.createElement('a')
  tempLink.href = src
  tempLink.download = 'CroppedVideo.mp4'
  tempLink.click()
  setTimeout(() => {
    if (lang === 'en') {
      window.location.href = `/download?tool=${pageTool}`
    } else {
      window.location.href = `/${lang}/download?tool=${pageTool}`
    }
  }, 500)
}
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
function update_PreviousFeature_and_Change_Style(target) {
  previous_feature_selected = target.childNodes[3]
  target.className = 'Feature CurrentFeature'
  previous_feature_selected.style.width = '80px'
  previous_feature_selected.style.display = 'inherit'
}
const Show_or_Hide_featureNames = async (e) => {
  if (previous_feature_selected) {
    previous_feature_selected.style.display = 'none'
    previous_feature_selected.parentElement.className = 'Feature'
    previous_feature_selected.style.width = '60px'
  }
  update_PreviousFeature_and_Change_Style(e)
  ShowSettings(e.id)
}
var features = document.getElementsByClassName('Feature')
var Feature_Value_inputs = document.getElementsByName('FeatureValue')
var FeatureOriginals = {
  Resolution: document.querySelector('.ResolutionO'),
  Ratio: document.querySelector('.RatioO'),
  Speed: document.querySelector('.SpeedO'),
}
var previous_Selected_feature_option = {}
var CancelEditing = document.querySelector('.CancelEditing')

const Add_Remove_ClassOnClick = (e) => {
  var Target = e.target
  if (
    previous_Selected_feature_option[Target.className] != Target &&
    previous_Selected_feature_option[Target.className] !== null
  ) {
    if (previous_Selected_feature_option[[Target.className]]) {
      previous_Selected_feature_option[Target.className].classList.remove(
        'ActiveFeature'
      )
      previous_Selected_feature_option[Target.className] = null
    }
    if (
      FeatureOriginals[Target.className].classList.contains(
        `${Target.className}O`
      )
    ) {
      FeatureOriginals[Target.className].classList.remove('ActiveFeature')
      FeatureOriginals[Target.className].classList.remove(
        `${Target.className}O`
      )
    }

    previous_Selected_feature_option[Target.className] = Target
    previous_Selected_feature_option[Target.className].classList.add(
      'ActiveFeature'
    )
  }
}

console.stdlog = console.log.bind(console)
var inCompress = false
console.log = function () {
  let consoleLog = Array.from(arguments)
  let CurrentTime = null
  if (consoleLog[0].indexOf('time=') != -10)
    CurrentTime = consoleLog[0].slice(
      consoleLog[0].indexOf('time='),
      consoleLog[0].indexOf('time=') +
        consoleLog[0]
          .substring(consoleLog[0].indexOf('time='))
          .indexOf('bitrate=')
    )
  ProgressBar.style.width = '0%'
  if (consoleLog[0].indexOf('inputCompress') != -1) inCompress = true
  if (CurrentTime != '') {
    let a = CurrentTime.slice(5, CurrentTime.length).split(':')
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
    var percentage = (seconds / videoTime) * 100
    ProgressBar.style.width = percentage + '%'
    LandingText.innerHTML = `Please wait while we are ${
      inCompress ? 'compressing' : 'flipping'
    } your video in the most secured way.<br><span>${
      percentage > 0 ? percentage.toFixed(0) : 0
    }%</span>${percentage > 90 ? '<br>Almost done, few seconds left</br>' : ''}`
  }
}

const Eventlisteners_on_feature_click = (() => {
  for (index = 0; index < features.length; ++index) {
    features[index].addEventListener(
      'click',
      (e) => Show_or_Hide_featureNames(e.target),
      false
    )
  }
  for (index = 0; index < Feature_Value_inputs.length; ++index) {
    Feature_Value_inputs[index].addEventListener(
      'click',
      Add_Remove_ClassOnClick
    )
  }
})()

var ProgressBar = document.querySelector('.ProgressBar')
var StartTrimValue = document.querySelector('.StartValue')
var EndTrimValue = document.querySelector('.EndValue')
var SeekValue = document.querySelector('.SeekValue')
var Ratio
var videoSource = document.getElementById('video') // added for clarity: this is needed
var FinalVideosrc
var video
var ActualSourceurl
var EndTimeinSeconds
var StartTimeinSeconds = 0
var FramesLayer = document.querySelector('.FramesLayer .Frames')
var FramesLayerWrap = document.querySelector('.FramesLayer')
var CurrentCropTop
var CurrentCropLeft
var CurrentCropWidth
var CurrentCropHeight
var TopError
var Resizable = document.querySelector('.resizable')
var Trimmers = document.querySelectorAll('.Trimmer')
var isTrimmed = 0,
  isRotated = 0,
  isFlipped = 0,
  isCropped = 0,
  isCompressed = 0,
  isCut = 0,
  isSpeedChanged = 0,
  isResized = 0
var sourceBuffer
var EditedBuffer
var RotationAngle = 0
var VideoSourceFile
var CanvasVideoWidth = 480
var CanvasVideoHeight = 318
var ActualSourceVideoWidth
var ActualSourceVideoHeight
var RatioOfResolutions = {
  RatioWidth: 1,
  RatioHeight: 1,
}
var VideoResolution = {
  width: 0,
  height: 0,
}
var Workspace = document.querySelector('.Workspace')
var UploadButton = document.querySelector('.Button')
var Spinner = document.querySelector('.Spinner')
var LandingText = document.querySelector('.Landingtext')
let FinalCropTop
let FinalCropLeft
let FinalCropWidth
let FinalCropHeight
var LoadingText = document.querySelector('.LoadingText')
var playPauseButtonIcon = document.querySelector('.PlayIcon')
var playPauseButton = document.querySelector('.PlayButton')
playPauseButtonIcon.style.backgroundImage = `url("./public/styles/VideoEditor/media/icons/pause.svg")`
playPauseButtonIcon.style.backgroundImage = `url("./public/styles/VideoEditor/media/icons/play.svg")`
let TogglePlay = 0
var InitialStartTrimPosition
var InitialEndTrimPosition
var ToggleFlipOptions = 0
var ActiveFrames = document.querySelector('.ActiveFrames')
var FlipReset = document.querySelector('.FReset')
var ToggleDownloadOptions = 0
var LandingPage = document.querySelector('.Landing')
var SeekTrim = document.querySelector('#SeekTrim')

var CurrentFeature = null
var CompressionSettingsButton = document.querySelector(
  '.Encoding_and_compression_Settings'
)
var CompressionSettings = document.querySelector('.Compression_Settings')
var crfText = document.querySelector('#crfText')
var PlaybackSpeed = 1
var OriginalFeatures = {
  Resolution: document.querySelector('.ResolutionO'),
  Ratio: document.querySelector('.RatioO'),
  Speed: document.querySelector('.SpeedO'),
}
var Compression_Settings_ClickCount = 0
var ToggleCancelEdit = 0
var EditLandingText = (URL) => {
  if (URL.indexOf('mp4') != -1) {
    LandingText.innerText = 'or drop your mp4 file here'
    // ButtonLabel.innerText = 'UPLOAD MP4'
  } else if (URL.indexOf('mov') != -1) {
    LandingText.innerText = 'or drop your mov file here'
    // ButtonLabel.innerText = 'UPLOAD MOV'
  } else {
    LandingText.innerText = 'or drop your video file here'
    // ButtonLabel.innerText = 'UPLOAD VIDEO'
  }
}
var CurrentURL = window.location.href
Switch_to_Feature(
  CurrentURL.slice(CurrentURL.lastIndexOf('/') + 1, CurrentURL.length)
)
EditLandingText(
  CurrentURL.slice(CurrentURL.lastIndexOf('/') + 1, CurrentURL.length)
)
videoSource.onended = () => {
  TogglePlayPause(CurrentSeek.time)
}

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 32) {
    e.preventDefault()
    TogglePlayPause(CurrentSeek.Time)
  }
})
var Show_or_Hide_CancelEditOverlay = () => {
  if (ToggleCancelEdit == 0) {
    CancelEditing.style.display = 'inherit'
    ToggleCancelEdit = 1
    return
  } else {
    CancelEditing.style.display = 'none'
    ToggleCancelEdit = 0
    return
  }
}
var CancelEdit = () => {
  location.reload()
}

function AnimateCompression_Settings() {
  if (++Compression_Settings_ClickCount % 2 == 1) {
    CompressionSettings.style.display = 'inherit'
    CompressionSettings.classList.add('AnimateSettings')
  } else {
    CompressionSettings.style.display = 'none'
    CompressionSettings.classList.remove('AnimateSettings')
  }
}

var CurrentSeek = {
  Position: 0,
  Time: 0,
}

var SeekVideo = () => {
  videoSource.currentTime = CurrentSeek.Time
}
var OnSeekHover = (e) => {
  CurrentSeek.Position = e.pageX - FramesLayer.getBoundingClientRect().left
  CurrentSeek.Time = CurrentSeek.Position * ratio
  let Milliseconds = (CurrentSeek.Time % 1).toFixed(1).toString().slice(1)
  let measuredTime = new Date(null)
  measuredTime.setSeconds(CurrentSeek.Time) // specify value of SECONDS
  let MHSTime = measuredTime.toISOString().substr(11, 8)
  SeekValue.innerText = MHSTime + Milliseconds
  SeekTrim.style.left = CurrentSeek.Position + 'px'
}
FramesLayerWrap.addEventListener('click', SeekVideo)
FramesLayerWrap.addEventListener('mousemove', OnSeekHover)

var EndTimeChange = {
  hhe: document.querySelector('#hhe'),
  mme: document.querySelector('#mme'),
  sse: document.querySelector('#sse'),
}
var StartTimeChange = {
  hhs: document.querySelector('#hhs'),
  mms: document.querySelector('#mms'),
  sss: document.querySelector('#sss'),
}

var Settings = {
  TrimSettings: document.querySelector('.FrameSettings'),
  CropSettings: document.querySelector('.CropSettings'),
  ResolutionSettings: document.querySelector('.ResolutionSettings'),
  SpeedSettings: document.querySelector('.SpeedSettings'),
  RotateSettings: document.querySelector('.RotateSettings'),
  FlipSettings: document.querySelector('.FlipSettings'),
}

const Number_of_Cores = () => {
  var logicalProcessors = window.navigator.hardwareConcurrency
  return logicalProcessors
}
var ThreadsCount = Number_of_Cores() * 4

var FeatureValues = {
  StartTime: '00:00:00',
  EndTime: '00:00:00',
  Crop: '1:1',
  Resolution: 480,
  Speed: 1,
  Compression_data: {
    size: 0,
    speed: 'ultrafast',
    crf: 24,
  },
  Oformat: 'mp4',
}

async function ShowSettings(Feature_to_display, flag = false) {
  var CurrentFeature_settings = Feature_to_display + 'Settings'
  if (previous_feature_displayed) {
    if (CurrentFeature !== previous_feature_displayed.className || flag) {
      // console.stdlog(previous_feature_displayed,CurrentFeature)

      previous_feature_displayed.style.display = 'none'
      previous_feature_displayed.className === 'CropSettings'
        ? (Resizable.style.display = 'none')
        : null
    }
  }
  switch (Feature_to_display) {
    case 'Compress': {
      isCompressed = 1
      AnimateCompression_Settings()
      break
    }

    default: {
      CurrentFeature = await document.querySelector(`#${Feature_to_display}`)
      update_PreviousFeature_and_Change_Style(CurrentFeature)
      previous_feature_displayed = Settings[CurrentFeature_settings]
      previous_feature_displayed.style.display = 'inherit'
      if (Feature_to_display == 'Trim') {
        TrimInfo.style.display = 'inherit'
        // FramesLayerWrap.style.display="inherit";
      } else {
        TrimInfo.style.display = 'none'
      }
      break
    }
  }
}
function Switch_to_Feature(feature) {
  switch (feature) {
    case 'crop-mp4':
      ShowSettings('Crop')
      break
    case 'crop-video':
      ShowSettings('Crop')
      break

    case 'edit-mp4-video':
      ShowSettings('Trim')
      break

    case 'flip-video':
      ShowSettings('Flip')
      break

    case 'mov-compressor':
      ShowSettings('Compress')
      break
    case 'mp4-compressor':
      ShowSettings('Compress')
      break
    case 'video-compressor':
      ShowSettings('Compress')
      break

    case 'video-cutter':
      ShowSettings('Trim')
      break
    case 'mp4-cutter':
      ShowSettings('Trim')
      break

    case 'mp4-trimmer':
      ShowSettings('Trim')
      break
    case 'video-trimmer':
      ShowSettings('Trim')
      break

    case 'resize-video':
      ShowSettings('Resolution')
      break

    case 'video-rotater':
      ShowSettings('Rotate')
      break

    case 'video-splitter':
      ShowSettings('Trim')
      break
  }
}

var HandleFeatureValueChange = (target) => {
  var TargetClass = target.className
  var TargetValue = target.innerText
  switch (TargetClass) {
    case 'Ratio': {
      //resizable size has to be changed
      Resizable.style.display = 'inherit'
      if (TargetValue !== 'Original') {
        VideoResolution.width = parseInt(TargetValue.split(':')[0])
        VideoResolution.height = parseInt(TargetValue.split(':')[1])

        if (VideoResolution.width > VideoResolution.height) {
          if (VideoResolution.width !== 4) {
            Resizable.style.height =
              480 * (VideoResolution.height / VideoResolution.width) + 'px'
            Resizable.style.width = '480px'
          } else {
            Resizable.style.width =
              318 * (VideoResolution.width / VideoResolution.height) + 'px'
            Resizable.style.height = '318px'
          }
        } else {
          Resizable.style.width =
            318 * (VideoResolution.width / VideoResolution.height) + 'px'
          Resizable.style.height = '318px'
        }
        Confirm_crop_dimensions_and_crop()
      } else {
        Resizable.style.width = '480px'
        Resizable.style.height = '318px'
      }
      break
    }
    case 'Resolution': {
      FeatureValues.Resolution = parseInt(
        TargetValue.slice(0, TargetValue.indexOf('p'))
      )
      isResized = 1
      break
    }
    case 'Speed': {
      FeatureValues.Speed = parseInt(
        TargetValue.slice(0, TargetValue.indexOf('x'))
      )
      isSpeedChanged = 1
      break
      //now just set playback speed at final function
    }
  }
}
//from url
// Switch_to_Feature('crop-mp4');

var TogglePlayPause = (time = null) => {
  if (TogglePlay === 1) {
    playPauseButtonIcon.style.backgroundImage = `url("./public/styles/VideoEditor/media/icons/play.svg")`
    videoSource.pause()
    TogglePlay = 0
  } else {
    playPauseButtonIcon.style.backgroundImage = `url("./public/styles/VideoEditor/media/icons/pause.svg")`
    playVideoPreview(time)
    TogglePlay = 1
  }
}

playPauseButton.addEventListener('click', TogglePlayPause)
//this should be called when the video is loaded
const fetch_and_load_Video_to_FFmpeg = async () => {
  await ffmpeg.load()
  sourceBuffer = await fetch(ActualSourceurl).then((r) => r.arrayBuffer())
}

const Handle_Trimmer_Change = (Target, value) => {
  if (value == 0) {
    var Left = Target.style.left
    var Right = Target.nextSibling.nextSibling.style.left
    var LeftValue = parseInt(Left.slice(0, Left.indexOf('p')))
    var RightValue = Right
      ? parseInt(Right.slice(0, Right.indexOf('p')))
      : FramesLayer.offsetWidth
    var width = RightValue - LeftValue + 'px'
    ActiveFrames.style.left = Left
    width ? (ActiveFrames.style.width = width) : null
    var NewTime = LeftValue * ratio
    videoSource.currentTime = NewTime
    StartTimeinSeconds = NewTime
    var Milliseconds = (NewTime % 1).toFixed(1).toString().slice(1)
    var measuredTime = new Date(null)
    measuredTime.setSeconds(NewTime) // specify value of SECONDS
    var MHSTime = measuredTime.toISOString().substr(11, 8)
    StartTrimValue.innerText = MHSTime
    FeatureValues['StartTime'] = MHSTime + Milliseconds
    ;[
      StartTimeChange.hhs.value,
      StartTimeChange.mms.value,
      StartTimeChange.sss.value,
    ] = MHSTime.split(':')
    TrimInfo.innerText = `Your video will be splitted from ${FeatureValues['StartTime']} to ${FeatureValues['EndTime']}`
  } else {
    var Right = Target.style.left
    var Left = Target.previousSibling.previousSibling.style.left
    var LeftValue = Left ? parseInt(Left.slice(0, Left.indexOf('p'))) : 0
    var RightValue = parseInt(Right.slice(0, Right.indexOf('p')))
    var width = RightValue - LeftValue + 'px'
    ActiveFrames.style.left = Left ? Left : 0
    width ? (ActiveFrames.style.width = width) : null
    var NewTime = RightValue * ratio
    var Milliseconds = (NewTime % 1).toFixed(1).toString().slice(1)
    var measuredTime = new Date(null)
    measuredTime.setSeconds(NewTime) // specify value of SECONDS
    var MHSTime = measuredTime.toISOString().substr(11, 8)
    EndTrimValue.innerText = MHSTime
    FeatureValues['EndTime'] = MHSTime + Milliseconds
    ;[
      EndTimeChange.hhe.value,
      EndTimeChange.mme.value,
      EndTimeChange.sse.value,
    ] = MHSTime.split(':')
    TrimInfo.innerText = `Your video will be splitted from ${FeatureValues['StartTime']} to ${FeatureValues['EndTime']}`
  }
}

//have to change based on the input

//observer for style change
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutationRecord) {
    var Target = mutations[0].target
    Show_or_Hide_featureNames(document.getElementById('Trim'))
    ShowSettings('Trim', true)

    if (Target.id == 'StartTrim') {
      Handle_Trimmer_Change(Target, 0)
    } else {
      Handle_Trimmer_Change(Target, 1)
    }

    isTrimmed = 1
  })
})

for (let i = 0; i < 2; ++i) {
  observer.observe(Trimmers[i], {
    attributes: true,
    attributeFilter: ['style'],
  })
}

const Set_actual_video_resolution = (Tempvideo) => {
  ActualSourceVideoHeight = Tempvideo.videoHeight
  ActualSourceVideoWidth = Tempvideo.videoWidth
}

const get_video_source_from_input = async (input) => {
  console.stdlog(input)
  LandingText.innerText = 'Please wait,processing your video'
  Spinner.style.display = 'inherit'
  UploadButton.style.display = 'none'
  VideoSourceFile = input.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(VideoSourceFile)
  let TempVideo = document.createElement('video')
  TempVideo.onloadeddata = function () {
    Set_actual_video_resolution(this)
  }
  reader.addEventListener(
    'load',
    async function () {
      // convert image file to base64 string
      videoSource.src = reader.result
      ActualSourceurl = reader.result
      TempVideo.src = ActualSourceurl
      await fetch_and_load_Video_to_FFmpeg()
      //generate Frames in FrameLayer
      video = videoSource.cloneNode(true)
      video.addEventListener('loadeddata', async function () {
        await generateFrames(this)
      })
    },
    false
  )
}

const timer = (ms) => new Promise((res) => setTimeout(res, ms))

const isEmpty = (dataURL) => {
  var invalidUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII='
  if (dataURL === invalidUrl) return true
  return false
}

async function generateFrames(e) {
  //generate thumbnail URL data
  video.muted = true
  var duration = e.duration
  EndTimeinSeconds = duration
  videoTime = duration
  //time conversion for FeatureValues[EndTime]
  var measuredTime = new Date(null)
  measuredTime.setSeconds(duration) // specify value of SECONDS
  var MHSTime = measuredTime.toISOString().substr(11, 8)

  FeatureValues['EndTime'] = MHSTime
  EndTrimValue.innerText = MHSTime
  var FrameStep = Math.ceil(duration / 19)
  var i = 0
  Spinner.style.display = 'none'
  var previousWorkingFrameData

  while (video.currentTime < duration) {
    video.currentTime = parseFloat(i)
    await timer(200)
    var thecanvas = document.createElement('canvas')
    var context = thecanvas.getContext('2d')
    context.drawImage(video, 0, 0, 250, 200)
    var dataURL = thecanvas.toDataURL()
    if (!isEmpty(dataURL)) {
      previousWorkingFrameData = dataURL
    } else {
      dataURL = previousWorkingFrameData
    }
    var img = document.createElement('img')
    img.className = 'Frame'
    img.setAttribute('src', dataURL)
    img.classList.add('Animate')
    FramesLayer.appendChild(img)
    i = i + FrameStep
    let progressPercent = (i * 100) / duration
    progressPercent < 100
      ? (ProgressBar.style.width = progressPercent + '%')
      : null
  }
  LandingPage.style.display = 'none'
  Workspace.style.display = 'inherit'
  InitialStartTrimPosition = Trimmers[0].offsetLeft
  InitialEndTrimPosition = Trimmers[1].offsetLeft
  ratio = duration / (FramesLayer.offsetWidth - 20)
}

//make the trim elements draggable
dragElement(document.getElementById('StartTrim'))
dragElement(document.getElementById('EndTrim'))

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0

  if (document.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos3 = e.clientX
    // set the element's new position:
    let NewPos = elmnt.offsetLeft - pos1

    if (
      NewPos >= InitialStartTrimPosition &&
      NewPos <= InitialEndTrimPosition
    ) {
      var Left = Trimmers[0].style.left
      var Right = Trimmers[1].style.left

      if (elmnt.id == 'StartTrim') {
        let RightValue = Right.slice(0, Right.indexOf('p'))
        if (!RightValue || parseInt(RightValue) > NewPos) {
          elmnt.style.left = NewPos + 'px'
        }
      } else if (elmnt.id == 'EndTrim') {
        let LeftValue = Left.slice(0, Left.indexOf('p'))
        if (!LeftValue || parseInt(LeftValue) < NewPos) {
          elmnt.style.left = NewPos + 'px'
        }
      }
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}

//lets make trim funcitonalities here

const TrimChangeHandler = (value) => {
  if (value === 0) {
    FeatureValues[
      'StartTime'
    ] = `${StartTimeChange.hhs.value}:${StartTimeChange.mms.value}:${StartTimeChange.sss.value}`
    StartTrimValue.innerText = FeatureValues['StartTime']
    var seconds =
      +StartTimeChange.hhs.value * 60 * 60 +
      +StartTimeChange.mms.value * 60 +
      +StartTimeChange.sss.value
    Trimmers[0].style.left = seconds / ratio + 1 + 'px'
  } else {
    FeatureValues[
      'EndTime'
    ] = `${EndTimeChange.hhe.value}:${EndTimeChange.mme.value}:${EndTimeChange.sse.value}`
    EndTrimValue.innerText = FeatureValues['EndTime']
    var seconds =
      +EndTimeChange.hhe.value * 60 * 60 +
      +EndTimeChange.mme.value * 60 +
      +EndTimeChange.sse.value
    Trimmers[1].style.left = seconds / ratio + 1 + 'px'
  }
}

const playVideoPreview = async (starttime = null) => {
  //change actual video src to src#t 00:00 to 00:10 using basic html
  videoSource.src = `${ActualSourceurl}#t=${
    starttime ? starttime : FeatureValues['StartTime']
  },${FeatureValues['EndTime']}`
  videoSource.play()
}

const Render_edited_video = async () => {
  const outputActual = await ffmpeg.FS('readFile', 'Output.mp4')

  var blobUrlActual = URL.createObjectURL(
    new Blob([outputActual.buffer], { type: 'video/mp4' })
  )
  let FinalVideo=new Blob([outputActual.buffer], { type: 'video/mp4' });
  if(isCompressed==1)
  {
    if(VideoSourceFile.size<FinalVideo.size)
    {
      document.getElementById('ErrorDialog').style.display="block";
    }
    else
      FinalVideosrc = blobUrlActual
  }
  else
    FinalVideosrc = blobUrlActual
}

const TrimVideo = async (option) => {
  ffmpeg.FS(
    'writeFile',
    'inputTrim.mp4',
    new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
  )
  // var TrimCommand=`-i inputTrim.mp4 -ss ${FeatureValues['StartTime']} -t ${FeatureValues['EndTime']} -async 1 Output.mp4`;
  // var TrimCommand=`-ss ${FeatureValues[StartTime]} -t  -i inputTrim.mp4 -acodec copy -vcodec copy -async 1 Output.mp4`;
  // if(option===1)
  var TrimCommand = `-i inputTrim.mp4 -ss ${FeatureValues['StartTime']} -to ${FeatureValues['EndTime']}  -c copy Output.mp4`
  // else
  // var TrimCommand=`-i inputTrim.mp4 -force_key_frames ${FeatureValues[StartTime]},${FeatureValues[EndTime]} Output.mp4`;
  //for display
  // var DelayAudioCommandDownload=`-i EditedOutput.mp4 -itsoffset 0.4 -i EditedOutput.mp4 -c:a copy -c:v copy -map 0:v:0 -map 1:a:0 Output.mp4`;
  var ArrayofInstructions = TrimCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
  // ArrayofInstructions=DelayAudioCommandDownload.split(' ');
  // await ffmpeg.run(...ArrayofInstructions);
}
const CutVideo = async () => {
  ffmpeg.FS(
    'writeFile',
    'inputCut.mp4',
    new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
  )
  var CutCommand1 = `-i inputCut.mp4 -ss 00:00:00 -to 00:00:10 -c copy input1.mp4`
  // console.log(FeatureValues['EndTime'])
  var CutCommand2 = `-i inputCut.mp4 -ss 00:00:20 -to ${FeatureValues['EndTime']} -c copy input2.mp4`
  var MergeCommand = `-i input1.mp4 -i input2.mp4 -acodec copy \
  -vcodec copy -acodec copy Output.mp4`

  var ArrayofInstructions = CutCommand1.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
  // console.log("1")
  ArrayofInstructions = CutCommand2.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
  // console.log("2")
  ArrayofInstructions = MergeCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
  // console.log("3")
}
const RotatePreview = (Width, Height, direction) => {
  videoSource.style.width = Width + 'px'
  videoSource.style.height = Height + 'px'
  videoSource.style.transform = `rotate(${direction * RotationAngle}deg)`
}

const SetRotate = (direction) => {
  var Width, Height
  if ((RotationAngle / 90) % 2 === 0) {
    Width = 318
    Height = 318
  } else {
    Width = 480
    Height = 318
  }

  if (direction == 2) {
    RotationAngle += 90
    RotatePreview(Width, Height, -1)
  } else {
    RotationAngle -= 90
    RotatePreview(Width, Height, 1)
  }
}
// const CheckRotation=()=>{
//   if(RotationAngle===0) return-1;
//   else if(RotationAngle===90) return 90
//   else if (RotationAngle===-90) return -90
//   else if (RotationAngle===180||RotationAngle===-180) return 180

// }

const RotateVideo = async () => {
  //rotate the video  here
  if (
    isCropped === 1 ||
    isFlipped === 1 ||
    isTrimmed === 1 ||
    isRotated === 1
  ) {
    const LastEditedFile = await ffmpeg.FS('readFile', 'Output.mp4')
    // console.log(sourceBuffer,[LastEditedFile.buffer]);
    ffmpeg.FS(
      'writeFile',
      'inputRotate.mp4',
      new Uint8Array(LastEditedFile, 0, LastEditedFile.byteLength)
    )
  } else {
    ffmpeg.FS(
      'writeFile',
      'inputRotate.mp4',
      new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    )
  }
  if (RotationAngle != 0) {
    var RotateCommand = `-i inputRotate.mp4 -c copy -metadata:s:v:0 rotate=${RotationAngle} Output.mp4`
    var ArrayofInstructions = RotateCommand.split(' ')
    await ffmpeg.run(...ArrayofInstructions)
    isRotated = 1
  }
}

const InitiateCropping = () => {
  Resizable.style.display = 'inherit'
}

const Set_crop_dimensions = () => {
  CurrentCropWidth = Resizable.style.width
  CurrentCropWidth = parseInt(
    CurrentCropWidth.slice(0, CurrentCropWidth.indexOf('p'))
  )
  CurrentCropHeight = Resizable.style.height
  CurrentCropHeight = parseInt(
    CurrentCropHeight.slice(0, CurrentCropHeight.indexOf('p'))
  )
  CurrentCropTop = Resizable.offsetTop
  CurrentCropLeft = Resizable.offsetLeft
}
//Confirm_crop_dimensions_and_crop() to confirm crop
const Confirm_crop_dimensions_and_crop = () => {
  //now change dimension wiith respect to actual video dimension
  //operations here
  RatioOfResolutions.RatioWidth = ActualSourceVideoWidth / CanvasVideoWidth
  RatioOfResolutions.RatioHeight = ActualSourceVideoHeight / CanvasVideoHeight
  // console.log({CurrentCropHeight,CurrentCropWidth,CurrentCropTop,CurrentCropLeft})

  FinalCropTop = CurrentCropTop * RatioOfResolutions.RatioHeight
  FinalCropLeft = CurrentCropLeft * RatioOfResolutions.RatioWidth
  FinalCropWidth = CurrentCropWidth * RatioOfResolutions.RatioWidth
  FinalCropHeight = CurrentCropHeight * RatioOfResolutions.RatioHeight
  //display video with croppped dimensions
  //call the crop function or call it atlast
  isCropped = 1
  // Resizable.style.display="none";
}

const CropVideo = async () => {
  await Confirm_crop_dimensions_and_crop()
  if (isFlipped === 1 || isRotated === 1 || isTrimmed === 1) {
    const LastEditedFile = await ffmpeg.FS('readFile', 'Output.mp4')
    ffmpeg.FS(
      'writeFile',
      'inputCrop.mp4',
      new Uint8Array(LastEditedFile, 0, LastEditedFile.byteLength)
    )
  } else {
    ffmpeg.FS(
      'writeFile',
      'inputCrop.mp4',
      new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    )
  }
  // var CropCommand=`-i inputCrop.mp4 -filter:v crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} Output.mp4`;
  // var CropCommand=`-i inputCrop.mp4 -filter:v crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} -c:a copy -qp 0 Output.mp4;`
  // var CropCommand=`-i inputCrop.mp4 -vf crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} -c:v libx264 -crf 0 -c:a copy Output.mp4`;
  var CropCommand = `-i inputCrop.mp4 -vf crop=${FinalCropWidth}:${FinalCropHeight}:${FinalCropLeft}:${FinalCropTop} -threads 5 -preset ultrafast -strict -2 Output.mp4`
  var ArrayofInstructions = CropCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
}

const setFlip = (direction) => {
  if (
    (isFlipped === 1 && direction === 1) ||
    (isFlipped === 2 && direction === 2)
  ) {
    isFlipped = 0
  } else isFlipped = direction
  Flip_preview()
}

const Flip_preview = () => {
  if (isFlipped === 2) {
    videoSource.style.transform = 'rotateY(180deg)'
  } else if (isFlipped === 1) {
    videoSource.style.transform = 'rotateX(180deg)'
  } else if (isFlipped === 0) {
    videoSource.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }
}

const FlipVideo = async () => {
  if (isTrimmed === 1) {
    const LastEditedFile = await ffmpeg.FS('readFile', 'Output.mp4')
    ffmpeg.FS(
      'writeFile',
      'inputFlip.mp4',
      new Uint8Array(LastEditedFile, 0, LastEditedFile.byteLength)
    )
  } else {
    ffmpeg.FS(
      'writeFile',
      'inputFlip.mp4',
      new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    )
  }
  if (isFlipped === 1) {
    var FlipCommand = `-i inputFlip.mp4 -vf vflip -threads ${
      ThreadsCount > 10 ? 10 : ThreadsCount
    } -c:a copy Output.mp4`
  } else {
    var FlipCommand = `-i inputFlip.mp4 -vf hflip -threads ${
      ThreadsCount > 10 ? 10 : ThreadsCount
    } -c:a copy Output.mp4`
  }

  var ArrayofInstructions = FlipCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
}

const ResizeVideo = async () => {
  if (isTrimmed === 1 || isCut === 1) {
    const LastEditedFile = await ffmpeg.FS('readFile', 'Output.mp4')
    // console.log(sourceBuffer,[LastEditedFile.buffer]);
    ffmpeg.FS(
      'writeFile',
      'inputResize.mp4',
      new Uint8Array(LastEditedFile, 0, LastEditedFile.byteLength)
    )
  } else {
    ffmpeg.FS(
      'writeFile',
      'inputResize.mp4',
      new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    )
  }
  var ResizeCommand = `-i inputResize.mp4 -vf scale=480:${FeatureValues.Resolution} Output.mp4`
  var ArrayofInstructions = ResizeCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
}
const ChangeSpeed = async () => {
  if (FeatureValues.Speed != 'Original' || FeatureValues.Speed != 1) {
    console.stdlog('Changing speed')
    if (
      isTrimmed === 1 ||
      isCut === 1 ||
      isFlipped === 1 ||
      isRotated === 1 ||
      isCropped === 1 ||
      isResized === 1
    ) {
      const LastEditedFile = await ffmpeg.FS('readFile', 'Output.mp4')
      // console.log(sourceBuffer,[LastEditedFile.buffer]);
      ffmpeg.FS(
        'writeFile',
        'inputSpeed.mp4',
        new Uint8Array(LastEditedFile, 0, LastEditedFile.byteLength)
      )
    } else {
      ffmpeg.FS(
        'writeFile',
        'inputSpeed.mp4',
        new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
      )
    }
    var playbackSpeed = parseFloat(FeatureValues.Speed).toFixed(2)
    FeatureValues.Speed = parseFloat(1 / FeatureValues.Speed).toFixed(2)

    // console.stdlog(FeatureValues.Speed)
    var SpeedCommand = `-itsscale ${FeatureValues.Speed} -i inputSpeed.mp4 -filter:a atempo=${playbackSpeed}  Output.mp4`
    var ArrayofInstructions = SpeedCommand.split(' ')
    await ffmpeg.run(...ArrayofInstructions)
  }
}

const FinalSettings = async () => {
  // if(isCropped)
  //   await Confirm_crop_dimensions_and_crop()
  if (
    isFlipped === 1 ||
    isRotated === 1 ||
    isTrimmed === 1 ||
    isCropped === 1 ||
    isResized === 1 ||
    isSpeedChanged === 1
  ) {
    // console.log({isFlipped,isCompressed,isCropped,isTrimmed,isRotated});
    const LastEditedFile = await ffmpeg.FS('readFile', 'Output.mp4')
    ffmpeg.FS(
      'writeFile',
      'inputCompress.mp4',
      new Uint8Array(LastEditedFile, 0, LastEditedFile.byteLength)
    )
  } else {
    ffmpeg.FS(
      'writeFile',
      'inputCompress.mp4',
      new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    )
  }

  var ish264 = true
  //-itsscale ${FeatureValues.Speed}
  var all_in_one_Command = `-i inputCompress.mp4${
    FeatureValues.Compression_data.size !== 0
      ? ` -fs ${FeatureValues.Compression_data.size}M`
      : ''
  } -c:v libx264 -crf ${FeatureValues.Compression_data.crf} ${
    ThreadsCount >= 16
      ? `${ish264 ? '-threads 10' : '-threads 16'}`
      : `${
          ThreadsCount > 10 && ish264
            ? `-threads 10`
            : `-threads ${ThreadsCount}`
        }`
  }  -preset ${
    FeatureValues.Compression_data.speed
      ? FeatureValues.Compression_data.speed
      : 'ultrafast'
  } -c:a copy ${
    FeatureValues.Resolution !== 'Original'
      ? ` -vf scale=-2:${FeatureValues.Resolution},format=yuv420p`
      : ''
  } Output.${FeatureValues.Oformat}`
  var ArrayofInstructions = all_in_one_Command.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
}

var CancelProcess = document.getElementById('CancelProcess')

const DownloadFile = async () => {
  Workspace.style.display = 'none'
  LandingPage.style.display = 'inherit'
  ProgressBar.style.width = '0%'
  LoadingText.style.display = 'inherit'
  LandingText.innerText = ''
  CancelProcess.style.display = 'inherit'
  if (isTrimmed === 1) {
    LoadingText.innerText = `Please Wait...Trimming video`
    await TrimVideo()
  }
  if (isCut === 1) {
    LoadingText.innerText = `Please Wait...Cutting video`
    await CutVideo()
  }
  if (isResized === 1) {
    if (FeatureValues.Resolution != 'Original') {
      LoadingText.innerText = `Please Wait...Resizing and re-encoding video`
      await ResizeVideo()
    }
  }
  if (isFlipped !== 0) {
    LoadingText.innerText = 'Please Wait...Flipping and re-encoding video'
    await FlipVideo()
  }
  if (RotationAngle !== 0) {
    LoadingText.innerText = 'Please Wait...Rotating Video'
    await RotateVideo()
  }
  if (isCropped === 1) {
    LoadingText.innerText = 'Please Wait...Cropping and re-encoding video'
    await CropVideo()
  }
  if (isSpeedChanged === 1) {
    if (FeatureValues.Speed != 1) {
      await ChangeSpeed()
    }
  }
  if (isCompressed === 1) {
    await FinalSettings()
  }
  CancelProcess.style.display = 'none'
  var link = document.querySelector('.DownloadLink')
  let downloadHREF = ''
  if (
    isCropped === 0 &&
    isTrimmed === 0 &&
    isFlipped === 0 &&
    isRotated === 0 &&
    isCompressed === 0 &&
    isCut === 0 &&
    isResized === 0 &&
    isSpeedChanged === 0
  ) {
    LoadingText.innerText = 'Please Wait...preparing your video'
    downloadHREF = videoSource.src
  } else {
    LoadingText.innerText = 'Please Wait...preparing your video'
    await Render_edited_video()
    downloadHREF = FinalVideosrc
  }
  LandingText.innerHTML = ''
  LoadingText.innerText = 'Thanks for your patience'
  link.addEventListener('click', () => handleDownload(downloadHREF))
  document.querySelector('.DownloadBox').style.display = 'inherit'
}

//add event listener for resize
function dragElementCrop(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  if (document.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    if (
      !(e.target.classList.contains('bottom-right') || e.target.id == 'video')
    ) {
      e = e || window.event
      e.preventDefault()
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX
      pos2 = pos4 - e.clientY
      pos3 = e.clientX
      pos4 = e.clientY
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}
Resizable.addEventListener('mouseup', Set_crop_dimensions)

/*Make resizable div by Hung Nguyen*/
function makeResizableDiv(div) {
  const element = document.querySelector(div)
  TopError = element.offsetTop
  const resizers = document.querySelectorAll(div + ' .resizer')
  const minimum_size = 20
  let original_width = 0
  let original_height = 0
  let original_x = 0
  let original_y = 0
  let original_mouse_x = 0
  let original_mouse_y = 0
  for (let i = 0; i < resizers.length; i++) {
    const currentResizer = resizers[i]
    currentResizer.addEventListener('mousedown', function (e) {
      e.preventDefault()
      original_width = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue('width')
          .replace('px', '')
      )
      original_height = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue('height')
          .replace('px', '')
      )
      original_x = element.getBoundingClientRect().left
      original_y = element.getBoundingClientRect().top
      original_mouse_x = e.pageX
      original_mouse_y = e.pageY
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })

    function resize(e) {
      if (currentResizer.classList.contains('bottom-right')) {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height + (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
      } else if (currentResizer.classList.contains('bottom-left')) {
        const height = original_height + (e.pageY - original_mouse_y)
        const width = original_width - (e.pageX - original_mouse_x)
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
      } else if (currentResizer.classList.contains('top-right')) {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      } else {
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
dragElementCrop(Resizable)
var customResetFunctionsObject = {
  ResetCropSettings: () => {
    Resizable.style.width = ''
    Resizable.style.height = ''
    Resizable.style.top = ''
    Resizable.style.left = ''
    isCropped = 0
    OriginalFeatures.Ratio.click()
    //have to reset then
  },
  ResetRotateSettings: () => {
    RotationAngle = 0
    isRotated = 0
    RotatePreview(480, 318, 1)
  },
  ResetTrimSettings: async () => {
    isTrimmed = 0
    Trimmers[0].style.left = InitialStartTrimPosition + 'px'
    Trimmers[1].style.left = InitialEndTrimPosition + 'px'
    await Handle_Trimmer_Change(Trimmers[0], 0)
    await Handle_Trimmer_Change(Trimmers[1], 1)
    TrimInfo.innerText = 'The video is not edited yet'
  },
  ResetFlipSettings: () => {
    isFlipped = 0
    Flip_preview()
  },
  ResetResolutionSettings: () => {
    OriginalFeatures.Resolution.click()
  },
  ResetSpeedSettings: () => {
    OriginalFeatures.Speed.click()
  },
}

var ResetFeature = () => {
  // console.log(CurrentFeature.attributes[1].nodeValue)
  var CurrentFeatureID = CurrentFeature.attributes[1].nodeValue
  customResetFunctionsObject[`Reset${CurrentFeatureID}Settings`]()
}

CompressionSettingsButton.addEventListener('click', AnimateCompression_Settings)

const Compress_data_Handler = (target) => {
  var targetId = target.id
  var targetValue = target.value
  FeatureValues.Compression_data[targetId] = targetValue
  isCompressed = 1
  targetId === 'crf' ? (crfText.innerText = targetValue) : null
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

// Compress video css and functionality
//Speed funtionality
//resolution functionality
//crop functionality

//ffmpeg -i input.mp4 -vcodec libx264 -crf 20 output.mp4

//add .SliderContainerBefore on help icon click in slider

//cut feature yet to be implemnented
