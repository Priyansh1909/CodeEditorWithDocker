const express = require('express');
const bodyparser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const {exec} = require('child_process');
const Docker = require('dockerode')






const app = express();

app.use(cors())

app.use(bodyparser.json());

app.post('/ajax_endpoint', async(req,res)=>{
    const data = req.body;
    let fileName = Math.floor(Math.random()*1000000000)+ '.'+data.language;
    let fileCode = data.code;
 
    let directorypath = __dirname+'/temp/';
    const filepath = (directorypath+fileName)

    fs.writeFile(filepath, fileCode, (err)=>{
        if (err) console.log(err);
        console.log('The file has been saved!');
    })

    if(data.language == 'c' || data.language == 'cpp'){
        await Executing_C_CPP(directorypath,fileName,data.language)
        .then((output)=>{console.log('output', output)
        return output
        })
        .then((response)=>{
            res.send(response )})
        .catch((e)=>{console.log('from catch', e)
        res.json(e)
    })
        
    }else
    {  
        await Executingpython(directorypath,fileName, res, data.language)
    }   
})


app.listen(3000, ()=>{
    console.log('server is running')
})
    

async function Executingpython(directorypath,fileName,res,language){
    const docker = new Docker();

    containerfile = `/temp/${fileName}`
    let container;

    if (language == 'py'){
     container = await docker.createContainer( {
        Image: "executing_python",
        Cmd:['python', containerfile],
        HostConfig:{
            Binds:[`${directorypath}:/temp`],
            
        },
        Tty:false
    });
    }
    else if (language == 'js'){
         container = await docker.createContainer({
            Image:'executing_nodejs',
            Cmd:['node', containerfile],
            HostConfig:{
                Binds:[`${directorypath}:/temp`],
            },
            Tty:false
        })

    }

    return new Promise((resolve,reject)=>{
        ( container.start(async ()=>{
            const logOpts = {
                stream:true,
                follow: true,
                stdout:true,
                stderr: true,
                timestamps:false
              };


              container.attach(logOpts, async(err, stream) => {
                if (err) {
                  console.error(err);
                  reject(err);
                }else{

                    const demuxStream = container.modem.demuxStream(stream, res, res);
                    stream.on("end", () => { res.end();});
                    resolve(res)

                   
                    console.log('container has stopped')
                
                }                 
                })                
              })
        )
        
    })}


async function Executing_C_CPP(directorypath,fileName,langauge){
        const docker = new Docker();
        let container;
        containerfile = `/temp/${fileName}`
        randomnumber = Math.floor(Math.random()*100000)
    if (langauge == 'c'){

    
        container  = await docker.createContainer({
        Image:'executing_c',
        Cmd:[`/Cfile.sh`, `${randomnumber}`,`${fileName}`],
        HostConfig:{
            Binds:[`${directorypath}:/temp`],
        },
        Tty:true
        })}
    else if(langauge == "cpp"){
 
    
        container  = await docker.createContainer({
        Image:'executing_cpp',
        Cmd:[`/cppfile.sh`, `${randomnumber}`,`${fileName}`],
        HostConfig:{
            Binds:[`${directorypath}:/temp`],
        },
        Tty:true
        })

    }

        return new Promise((resolve,reject)=>{
            (container.start(async ()=>{
            const logsStream = await container.logs({ follow: true, stdout: true, stderr: true,});
            let output = '' ;            
            logsStream.on('data', async (chunk) => {
                output +=chunk.toString('utf-8')
            })
            logsStream.on('end',()=>{
                resolve(output)
                })
              }));          
        })    
    }






