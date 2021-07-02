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
var FileName = document.querySelector('.VideoFile h4')
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
var settings = {
  outputFormat: 'mp3',
  audioQuality: 'default',
}
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
    LandingText.innerHTML = `Please wait ,we are extracting audio in the most secure way<br><span>${
      percentage > 0 ? percentage.toFixed(0) : 0
    }%</span>`
  }
}
const get_video_source_from_input = async (input) => {
  LandingText.innerText = 'Please wait,processing your video'
  Spinner.style.display = 'inherit'
  UploadButton.style.display = 'none'
  VideoSourceFile = input.files[0]
  FileName.innerText = VideoSourceFile.name
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
var PreviousSelectedValues = {
  outputFormat: document.querySelector('#outputFormat #default'),
  audioQuality: document.querySelector('#audioQuality #default'),
}

var handle_value_click = (e) => {
  var CurrentID = e.target.parentElement.parentElement.id
  settings[CurrentID] = e.target.innerText.toLowerCase()
  PreviousSelectedValues[CurrentID].classList.remove('ActiveValue')
  PreviousSelectedValues[CurrentID] = e.target
  PreviousSelectedValues[CurrentID].classList.add('ActiveValue')
}
values.forEach((value) =>
  value.addEventListener('click', (e) => handle_value_click(e))
)

const Number_of_Cores = () => {
  var logicalProcessors = window.navigator.hardwareConcurrency
  return logicalProcessors
}

var ThreadsCount = Number_of_Cores() * 4
var ExtractAudio = async () => {
  Spinner.style.display = 'none'
  Workspace.style.display = 'none'
  Landing.style.display = 'inherit'
  CancelProcess.style.display = 'inherit'
  var FFMPEGCommand = `-i input.mp4 ${
    ThreadsCount > 16 ? `-threads 16` : `-threads ${ThreadsCount}`
  } -vn${
    settings.audioQuality && settings.audioQuality !== 'default'
      ? ` -b:a ${settings.audioQuality}`
      : ''
  } output.${settings.outputFormat}`
  var ArrayofInstructions = FFMPEGCommand.split(' ')
  await ffmpeg.run(...ArrayofInstructions)
  CancelProcess.style.display = 'none'
  LandingText.style.display = 'none'
  initateDownload()
}

const initateDownload = async () => {
  const output = ffmpeg.FS('readFile', `output.${settings.outputFormat}`)
  link.href = URL.createObjectURL(
    new Blob([output.buffer], { type: `audio/${settings.outputFormat}` })
  )
  link.download = `Output.${settings.outputFormat}`

  LoadingText.style.display = 'inherit'
  LoadingText.innerText = 'Thanks for your patience'
  DownloadBox.style.display = 'inherit'
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
