function allowDrop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("placeholder")){
        ev.target.classList.add("dragover");
    }
	else if (ev.target.classList.contains("cell") && ev.target.getElementsByClassName('brickOriginal')[0] === undefined && ev.target.getElementsByClassName('brickTopic')[0] === undefined){
        ev.target.classList.add("dragover");
	}
}

function dragleave_handler(ev) {
    ev.preventDefault();
	if (ev.target.classList.contains("dragover")){
    ev.target.classList.remove("dragover");
	}
}

function drag(ev) {
    ev.dataTransfer.setData("a_brick", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();ev.stopPropagation();
	var brick = document.getElementById(ev.dataTransfer.getData("a_brick"));
	var source_cell = brick.parentElement;
	var source_row = source_cell.parentElement;
	var row = ev.target.parentElement;
	if (! row.classList.contains("row")){return false};
	//drop a brick into a new position
    if (ev.target.classList.contains("cell") && ev.target.getElementsByClassName('brickOriginal')[0] === undefined && ev.target.getElementsByClassName('brickTopic')[0] === undefined){
        ev.target.appendChild(brick);
        ev.target.classList.remove("dragover");
    }
	else if (ev.target.classList.contains("placeholder")){
		var cell = document.createElement("div");
		cell.classList.add("cell");
		cell.appendChild(brick);
		row.insertBefore(cell,ev.target);
	}
	// rearrange the original row
	rearrange(row);
	if (3 < source_row.getElementsByClassName("cell").length){
		var blank = document.createElement("div");
		if(brick.classList.contains("brickOriginal")){
			source_cell.appendChild(blank);
			blank.classList.add("brickOriginal-Blank");
		}else if(brick.classList.contains("brickTopic")){
			source_cell.appendChild(blank);
			blank.classList.add("brickTopic-Blank");
		}
	}
	rearrange(source_row);
	
}

function rearrange(row_){
	while (row_.getElementsByClassName("placeholder")[0]){
		row_.removeChild(row_.getElementsByClassName("placeholder")[0]);
	}
	for (let i = 0; i < row_.getElementsByClassName("cell").length; i++){
		var placeholder = document.createElement("div");
		placeholder.classList.add("placeholder");
		row_.insertBefore(placeholder,row_.getElementsByClassName("cell")[i]);
	}
	var placeholder = document.createElement("div");
	placeholder.classList.add("placeholder");
	row_.appendChild(placeholder);
}

/* function dragend(ev) {
    var tds = document.getElementsByTagName('td');
    for(let i = 0; i < tds.length; i++){
        if (tds[i].classList.contains("dragover")){
            tds[i].classList.remove("dragover");
        }
    }
} */

function initialize(){
    document.addEventListener('drop', drop);
    document.addEventListener('dragover', allowDrop);
    document.addEventListener('dragleave', dragleave_handler);
    // document.addEventListener('dragend', dragend);
}

function add_brickOriginal (){
    var text = document.getElementById('main_text').value
    text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
    /*var ref = document.getElementById('ref').value*/
    if (text.length < 1){return 0;}
    var cells = document.getElementsByClassName('cell');
    for(let i = cells.length - 1; i >= 0; i--){
        if (cells[i].getElementsByClassName('brickOriginal')[0]){
            continue;
        }else if(cells[i].getElementsByClassName('brickTopic')[0]){
            continue;
		}else{
            cells[i].innerHTML += ('<div id="brickOriginal' + document.getElementsByClassName('brickOriginal').length + '" class="brickOriginal" draggable="true" ondragstart="drag(event);" ondragend="dragend(event);" >'
            + '<p class="brick-content">' + text + '</p>'
            /*+ '<p class="brick-ref">' + ref + '</p>'*/
            + '</div>')
            break;
        }
    }
    document.getElementById('main_text').value = null;
    /*document.getElementById('ref').value = null;*/
}

function add_brickTopic (){
    var topic = document.getElementById('main_text').value
    topic = topic.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
    /*var ref = document.getElementById('ref').value*/
    if (topic.length < 1){return 0;}
    var cells = document.getElementsByClassName('cell');
    for(let i = cells.length - 1; i >= 0; i--){
        if (cells[i].getElementsByClassName('brickOriginal')[0]){
            continue;
        }else if(cells[i].getElementsByClassName('brickTopic')[0]){
            continue;
		}else{
            cells[i].innerHTML += ('<div id="brickTopic' + document.getElementsByClassName('brickTopic').length + '" class="brickTopic" draggable="true" ondragstart="drag(event);" ondragend="dragend(event);" >'
            + '<p class="brick-content">' + topic + '</p>'
            /*+ '<p class="brick-ref">' + ref + '</p>'*/
            + '</div>')
            break;
        }
    }
    document.getElementById('main_text').value = null;
    /*document.getElementById('ref').value = null;*/
}


window.onload = initialize;