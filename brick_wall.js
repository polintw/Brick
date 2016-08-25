function allowDrop(ev) {
    ev.preventDefault();
    if (ev.target.tagName === "TD"){
        ev.target.classList.add("dragover");
        ev.target.classList.remove("not_dragover");
    }
}

function dragleave_handler(ev) {
    ev.preventDefault();
    if (ev.target.tagName === "TD"){
        ev.target.classList.remove("dragover");
        ev.target.classList.add("not_dragover");
    }

}

function drag(ev) {
    ev.dataTransfer.setData("a_brick", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("a_brick");
    if (ev.target.tagName === "TD" && ev.target.getElementsByClassName('brick')[0] === undefined){
        ev.target.appendChild(document.getElementById(data));
        ev.target.classList.remove("dragover");
    }
}

function dragend(ev) {
    var tds = document.getElementsByTagName('td');
    for(let i = 0; i < tds.length; i++){
        if (tds[i].classList.contains("dragover")){
            tds[i].classList.remove("dragover");
        }
    }
}

function initialize(){
    document.addEventListener('drop', drop);
    document.addEventListener('dragover', allowDrop);
    document.addEventListener('dragleave', dragleave_handler);
    document.addEventListener('dragend', drop);
}

function add_brick (){
    var text = document.getElementById('main_text').value
    text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
    var ref = document.getElementById('ref').value
    if (text.length < 1){return 0;}
    var tds = document.getElementsByTagName('td');
    for(let i = tds.length - 1; i >= 0; i--){
        if (tds[i].getElementsByClassName('brick')[0]){
            continue;
        }else{
            tds[i].innerHTML += ('<div id="' + document.getElementsByClassName('brick').length + '" class="brick" draggable="true" ondragstart="drag(event);" ondragend="dragend(event);" >'
            + '<p>' + text + '</p>'
            + '<p>' + ref + '</p>'
            + '</div>')
            break;
        }
    }
    document.getElementById('main_text').value = null;
    document.getElementById('ref').value = null;
}

window.onload = initialize;