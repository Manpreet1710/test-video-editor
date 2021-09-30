const fs = require("fs")

let home = {
	path: "/index.markdown"
}

let features = {
	dir: "/features/",
}


let fl = fs.readdirSync(features.dir+"en")


if(!fs.existsSync("home")){
	fs.mkdirSync("home")
}


let languages = {
  id: 'Bahasa Indonesia',
  da: 'Dansk',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
  sv: 'Svenska',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  ru: 'Русский',
  uk: 'Українська',
  ar: 'العربية',
  hi: 'हिन्दी',
  th: 'ภาษาไทย',
  ko: '한국어',
  ja: '日本語',
  zh: '简体中文',
  'zh-TW': '繁體中文'
}



let txt = `
---
layout: feature
folderName: feature
fileName: crop-mp4
permalink: crop-mp4
lang: it
tool: crop-mp4
companyName: safevideokit
domain : com
---

{% include VideoEditorIndex/index.html %}

`


function replace(data,code){
	let d = data.replace(/lang.*en/,"lang: "+ code)
	

	return d
}


let home_data = fs.readFileSync(home.path,"utf8")


for(let [code,text] of Object.entries(languages)){

	if(!fs.existsSync(features.dir+code)){
		fs.mkdirSync(features.dir+code)
	}
	if(!fs.existsSync("home/"+code)){
		fs.mkdirSync("home/"+code)
	}


	let nh = replace(home_data,code)
	nh = nh.replace(/permalink.*/,"permalink: /"+ code)

	//console.log(nh)

	fs.writeFileSync(code+"-index.md",nh)


	for(file of fl){
		let fd = fs.readFileSync(features.dir+"en/"+file,"utf8")
		console.log(file)
		let nf = replace(fd,code)

		nf = nf.replace(/permalink.*/,"permalink: /"+ code+"/"+file.split(".")[0])
		
		console.log(nf)
		fs.writeFileSync(features.dir+code+"/"+file,nf)
	}

}




