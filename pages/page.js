//require statements
const electron = require('electron');
const {ipcRenderer} = electron;

//notes we want to include;
let D, E, A, HiD, G, B, HiE;

//create our audio objects
D = new Audio("../sounds/low_D.wav");
D.name = "D";
E = new Audio("../sounds/low_E.wav");
E.name = "E";
A = new Audio("../sounds/A.wav");
A.name = "A";
HiD = new Audio("../sounds/high_D.wav");
HiD.name = "HiD";
G = new Audio("../sounds/G.wav");
G.name = "G";
B = new Audio("../sounds/B.wav");
B.name = "B";
HiE = new Audio("../sounds/high_E.wav");
HiE.name = "HiE";

const sounds = [D, E, A, HiD, G, B, HiE];

//helper functions==============================================================

//function takes an document id and disables that button
function toggle_disable(id){
  let ele = document.getElementById(id);
  ele.disabled == true? ele.disabled = false : ele.disabled = true;
}

//toggles disable on all buttons
function toggle_all(){
  toggle_disable('edit');
  toggle_disable('save');
  toggle_disable('load');
  toggle_disable('strum');
}

//simple function for locating an index in the sounds array
function find_index(x){
  for(let i = 0; i < sounds.length; i++){
    if(x == sounds[i].name){
      return i;
    }
  }
}

//function for loading a new tuning from txt data
function load_new_tuning(tuning){
  //set buttons
  let option, audio, string;
  for(let i = 6; i >= 1; i--){
    option = tuning[i];
    string = document.getElementById(i);
    let pos = find_index(option);
    string.onclick = function(){
      sounds[pos].play();
    };
    string.innerHTML = option;
  }
}

function add_cancel_button(formID){
  let button = document.createElement('button');
  button.className = 'w3-btn w3-indigo';
  button.innerHTML = "CANCEL";
  button.onclick = function(){
    toggle_all();
    this.parentNode.innerHTML = '';
  }
  document.getElementById(formID).appendChild(button);
}

//==============================================================================
//EDIT function=================================================================
//==============================================================================
function edit(){
  toggle_all();
  let form = document.getElementById('editform');
  let header = document.createElement('h4');
  header.innerHTML = "Select Tuning";
  header.className = 'aaron-header';
  form.appendChild(header);

  let selector, option;

  //for each string
  for(let i = 6; i >= 1; i--){
    selector = document.createElement('select');

    //for each option for each string
    for(let i = 0; i < sounds.length; i++){
      option = document.createElement('option');
      option.text = sounds[i].name;
      selector.add(option);
    }

    //adding select element to page
    selector.className = "w3-select w3-pale-purple";
    selector.id = "selector"+i;
    selector.required = true;
    form.appendChild(selector);
  }

  //add confirm button to form
  let button = document.createElement('button');
  button.innerHTML = "APPLY";
  button.className = "w3-btn w3-indigo"
  button.onclick = confirm_edits;
  form.appendChild(button);
  add_cancel_button('editform');
}

function confirm_edits(){
  toggle_all();

  //set buttons
  let option, audio, string;
  for(let i = 6; i >= 1; i--){
    option = document.getElementById('selector'+i).value;
    string = document.getElementById(i);
    let pos = find_index(option);
    string.onclick = function(){
      sounds[pos].play();
    };
    string.innerHTML = option;
  }

  //reset the form
  document.getElementById('editform').innerHTML = '';
}

//==============================================================================
//SAVE function=================================================================
//==============================================================================
function toggle_save_form(){
  toggle_all();
  var x = document.getElementById('saveform');
  if(x.style.display == "block"){
    x.style.display = "none";
  }
  else{
    x.style.display = "block";
  }
}
function save(){
  function saver(content, fileName, contentType){
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click()
  }
  let content = {
    6:document.getElementById('6').innerHTML,
    5:document.getElementById('5').innerHTML,
    4:document.getElementById('4').innerHTML,
    3:document.getElementById('3').innerHTML,
    2:document.getElementById('2').innerHTML,
    1:document.getElementById('1').innerHTML,
  };
  let fileName = document.getElementById('filename').value;
  saver(JSON.stringify(content), fileName, "application/JSON");
  toggle_save_form();
}

//==============================================================================
//LOAD function=================================================================
//==============================================================================
function load(){
  toggle_all();
  ipcRenderer.send('load');
  ipcRenderer.on('render_files', (event, message) => {
    let form = document.getElementById('loadform');
    form.innerHTML = '';
    let selector, option;
    let button;

    //create & style the selector
    selector = document.createElement('select');
    selector.className = 'w3-select w3-pale-purple';
    selector.id = 'loadselect';

    //add options
    for(let i = 0; i < message.length; i++){
      option = document.createElement('option');
      option.text = message[i].slice(0, (message[i].length) - 5);
      selector.add(option);
    }

    //make confirmation button
    button = document.createElement('button');
    button.innerHTML = 'CONFIRM';
    button.className = 'w3-btn w3-indigo'

    //confirm new tuning and load edits
    button.onclick = function(){
      toggle_all();
      const tuning = document.getElementById('loadselect').value;
      document.getElementById('tuningmode').innerHTML = tuning;
      ipcRenderer.send('get_tuning', tuning);

      //load tuning
      ipcRenderer.on('load_tuning', function(event, message){
        let data = JSON.parse(message);
        load_new_tuning(data);
      });

      //clear loading form
      document.getElementById('loadform').innerHTML = '';
    }
    form.appendChild(selector);
    form.appendChild(button);
    add_cancel_button('loadform');
  });
}

//==============================================================================
//STRUM function================================================================
//==============================================================================
function strum(){
  let button;
  for(let i = 6; i >= 1; i--){
    button = document.getElementById(i);
    button.click();
  }
}
