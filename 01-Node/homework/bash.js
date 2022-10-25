
const commands = require ('./commands');

const print = (output) =>{
    process.stdout.write(output);
    process.stdout.write('\nprompt > ');
}


process.stdout.write('prompt > ')
process.stdin.on('data', function (data) {
    let arr = data.toString().trim().split(" ")
    let cmd = arr.shift()
    let info = arr.join(" ")
    if(commands[cmd]) {commands[cmd](info, print)}else{ console.log(`No existe el comando: ${cmd}`)}
    process.stdout.write('\nprompt > ');
  });