const fs = require('fs');
const path = require('path');
const fm = require('front-matter')
const postsPath = path.join(__dirname, '_posts');
// Define authors data
const authors = [
    {
        label: 'Ankita',
        name: 'Ankita',
    },
    {
        label: 'Keshav',
        name: 'Keshav Agarwal',
    },
    {
        label: 'Anushka',
        name: 'Anushka Guha',
    },
    {
        label: 'Paavan',
        name: 'Thandra Paavan Kumar',
    },
    {
        label: 'Arjyahi',
        name: 'Arjyahi Bhattacharya',
    },
    {
        label: 'Nikita',
        name: 'Nikita Gupta',
    },
    {
        label: 'Alka',
        name: 'Alka Bisht',
    },
    {
        label: 'Siddhika',
        name: 'Siddhika Prajapati',
    },
    {
        label: 'Krutika',
        name: 'Krutika',
    },

    {
        label: 'Shubhangi',
        name: 'Shubhangi Singh',
    },
    {
        label: 'Balark',
        name: 'Balark Singhal',
    },
    {
        label: 'Udit',
        name: 'Udit Agarwal',
    },
    {
        label: 'Pallavi',
        name: 'Pallavi Thakur',
    }
];
fs.mkdir('authors', { recursive: true }, (err) => { });
fs.readdir(postsPath, (err, files) => {
    if (err) {
        console.log(err);
    } else {
        const mdFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');
        mdFiles.forEach(file => {
            const filePath = path.join(postsPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            const content = fm(data)

            authors.forEach(author => {
                console.log(content.attributes.author);
                if (author.name.toLowerCase().includes(content.attributes.author.toLowerCase())) {
                    const filename = `./authors/${author.name.toLowerCase().replaceAll(' ', '-')}.md`;
                    const htmldata = `---
layout: author
label: ${author.label}
authorName: ${author.name}
permalink: /authors/${author.name.toLowerCase().replaceAll(' ', '-')}
---
            `
            fs.writeFile(filename, htmldata, (err) => {
                if (err) throw err;
            });
                }
               
            });
        });

    }
});
let allauthors = `---
layout: allAuthors
permalink: /authors
title: Our Authors
---
`
fs.writeFile("./authors/authors.md", allauthors, (err) => {
    if (err) throw err;
});



