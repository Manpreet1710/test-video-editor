let input_editor, output_editor, data;
output_editor = ace.edit("output_editor");
output_editor.setReadOnly(true)
output_editor.session.setMode("ace/mode/json");
input_editor = ace.edit("input_editor");
input_editor.session.setMode("ace/mode/json");
let upload_div_inner = document.getElementById("upload_div_inner")
let file_upload = document.getElementById("file_upload")
let format_btn = document.getElementById("format_btn")
let inputcopyButton = document.querySelector("#inputcopy");
let outputcopyButton = document.querySelector("#outputcopy");
let deleteEditorInputTxt = document.querySelector(".input_editor_bar .cross_icon");
let deleteEditorOuputTxt = document.querySelector(".output_editor_bar .cross_icon");
const siteName = file_upload.dataset.sitename
let selectedFile

upload_div_inner.onclick = function () {
    document.querySelector("#file_upload").click();
};
file_upload.onchange = function (e) {
    var input = e.target.files[0];
    selectedFile = input
    input_editor = ace.edit("input_editor");
    input_editor.session.setMode("ace/mode/json");
    var reader = new FileReader();
    reader.onload = function () {
        input_editor.setValue(reader.result);
    }
    reader.readAsText(input);
};
document.querySelector("#input_editor_bar .save_icon").onclick = function () {
    file_saving_decision(1);
};
editorActions();
function editorActions() {
    deleteEditorInputTxt.onclick = function () {
        input_editor.setValue("");
    }
    deleteEditorOuputTxt.onclick = function () {
        output_editor.setValue("");
    }
    inputcopyButton.addEventListener("click", (e) => {
        const el = document.createElement("textarea");
        el.value = input_editor.getValue();
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        e.target.setAttribute('data-original-title', 'Copied !')
    })
    outputcopyButton.addEventListener("click", (e) => {
        const el = document.createElement("textarea");
        el.value = output_editor.getValue();
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        e.target.setAttribute('data-original-title', 'Copied !')
    })
}
function file_saving_decision(flag) {
    if (flag == 1) {
        if (input_editor.getValue == "" || input_editor.getValue == undefined) {
            return false;
        } else {
            file_download(input_editor.getValue(), "application/json", "json");
        }
    } else if (flag == 0) {
        if (output_editor.getValue == "" || output_editor.getValue == undefined) {
            return false;
        } else {
            file_download(output_editor.getValue(), "text/plain", "txt");
        }
    }
}
function file_download(code, mimetype, extension) {
    var a = document.createElement("a");
    var data = new Blob([code], {
        type: mimetype,
    });
    a.href = window.URL.createObjectURL(data);
    a.download = `${siteName}.` + extension;
    a.click();
}