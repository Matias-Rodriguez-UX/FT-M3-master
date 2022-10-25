const fs = require ('fs')
let request = require('request');

const date=(info, print)=>{
     print(Date())
}
const pwd = (info, print) =>{    
    print(process.cwd())
}

const ls = (info, print) => {
        fs.readdir('.', function(err, files) {
        if (err) throw err;
        print(files.join("\n"));
      });
    }

const echo = (info, print) =>{
    print(info);
}

const cat = (info, print) => {
    fs.readFile(info, 'utf8', function(err, data){
        if (err) throw err;
        print(data.toString().trim() + "\n")
    });
}

const head = (info, print) => {
    fs.readFile(info, 'utf8', function(err, data){
        if (err) throw err;
       print(data.split('\n').splice(0,8).join('\n'))
    })
}

const tail = (info, print) => {
    fs.readFile(info, 'utf8', function(err, data){
        if (err) throw err;
        print(data.split('\n').splice(-8).join('\n'))
    }
    )
}

const curl = (info, print) => {
    request(info, function(err, data){
        if (err) throw err;
        print(data.body)
    })
}

module.exports = {
date: date,
pwd: pwd,
ls: ls,
echo: echo,
cat: cat,
head: head,
tail: tail,
curl: curl,
}