let editor;
const outputTerminal = document.querySelector('.output')

window.onload = function(e){
    editor = ace.edit('editor')
    editor.setTheme('ace/theme/monokai')
    editor.session.setMode("ace/mode/python");
    e.preventDefault()
}


function changeLanguage(){
    let language = document.getElementById('languages').value;

    if (language == 'c' || language == 'cpp')editor.session.setMode('ace/mode/c_cpp');
    else if (language == 'javascript' )editor.session.setMode('ace/mode/javascript');
    else if (language == 'python' )editor.session.setMode('ace/mode/python');

}

function executecode(event){
 

  event.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/ajax_endpoint');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = async function(){
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response =xhr.responseText;
        responseWithBreak = response.replace(/\\r\\n/g, "<br />");
        console.log(responseWithBreak) 
        outputTerminal.innerHTML = responseWithBreak
      }
      else {
              console.error('Error:', xhr.statusText);
            }
          }
        };
        const data = { language: document.getElementById('languages').value,
        code: editor.getSession().getValue()
    };
    xhr.send(JSON.stringify(data)); 

    }
