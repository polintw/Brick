function drag(ev) {
    //target the <a> tag which wrapping the "brick"<div>
	ev.dataTransfer.setData("a_brick", ev.target.parentElement.id);
}

function dragleave_handler(ev) {
    ev.preventDefault();
	if (ev.target.classList.contains("dragover")){
    ev.target.classList.remove("dragover");
	}
}

function allowDrop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("placeholder")){
        ev.target.classList.add("dragover");
    }
	else if (ev.target.classList.contains("cell") && ev.target.getElementsByClassName('brickOriginal')[0] === undefined){
        ev.target.classList.add("dragover");
	}
}

function drop(ev) {
    ev.preventDefault();ev.stopPropagation();
	var brick = document.getElementById(ev.dataTransfer.getData("a_brick"));
	var source_cell = brick.parentElement;
	var source_row = source_cell.parentElement;
	var row = ev.target.parentElement;
	if (! row.classList.contains("row")){return false};
	//drop a brickOriginal into a new position
    if (ev.target.classList.contains("cell") && ev.target.getElementsByClassName('brickOriginal')[0] === undefined){
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
	if (3 < source_row.getElementsByClassName("cell").length &&
		source_cell.getElementsByClassName("brickOriginal")[0] === undefined){
		var blank = document.createElement("div");
		source_cell.appendChild(blank);
		blank.classList.add("brickOriginal-Blank");
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


function add_brickOriginal (){
    var text = document.getElementById('main_text').value
    text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
	var ref = document.getElementById('ref').innerHTML;
    if (text.length < 1){return 0;}
    var cells = document.getElementsByClassName('cell');
    for(let i = cells.length - 1; i >= 0; i--){
		if (cells[i].getElementsByClassName('brickOriginal')[0]){
            continue;
		}else{
			cells[i].innerHTML += (
			//wrap the "brick" with a anchor tag, for linking colorbox
			//keep id for "drag()" recognize
			'<a id="anchor_brickOriginal' + document.getElementsByClassName('brickOriginal').length + '" href="#brickOriginal' + document.getElementsByClassName('brickOriginal').length +  '">' 
			//then create the brick style`
			+ '<div id="brickOriginal' + document.getElementsByClassName('brickOriginal').length + '" class="brickOriginal" draggable="true" ondragstart="drag(event);" ondragend="dragend(event);">'
			//then pull in the main_text and reference
            + '<p class="brick-content">' + text + '</p>'
			+ '<p class="brick-ref">' + ref + '</p>'
            + '</div>' 
			+ '</a>');
			/*create a replication in the .hiddenZone
			document.getElementsByClassName('hiddenZone').innerHTML += (
			'<div id="hidden_brickOriginal' + document.getElementsByClassName('brickOriginal').length + '" class="brickOrigianl-hidden">'
			+ '<p class="brick-content">' + text + '</p>'
			+ '<p class="brick-ref">' + ref + '</p>'
            + '</div>');*/
			//link the anchor tag to the colorbox effect
			var newAnchor = cells[i].getElementsByTagName('a')[0];
			$(newAnchor).colorbox({inline: true, width:"50%", height:"50%"});
			break;
        }
    }
    document.getElementById('main_text').value = null;
    document.getElementById('ref').innerHTML = null;
}

function add_Title(event){
	var html = event.clipboardData.getData('text/html');
	document.getElementById('pasteHtml').innerHTML = html;
	var string = document.getElementById('pasteHtml').value;
	var stringUppercase = string.toUpperCase();
	var positionStart = stringUppercase.search(/<title>/i);
	var positionEnd = stringUppercase.search('</TITLE>');
	var title = string.slice(positionStart+7,positionEnd);
	document.getElementById('ref').innerHTML = title;
}

function initialize(){
    document.addEventListener('drop', drop);
    document.addEventListener('dragover', allowDrop);
    document.addEventListener('dragleave', dragleave_handler);
	document.getElementById('main_text').addEventListener('paste', add_Title);
    // document.addEventListener('dragend', dragend);
}

window.onload = initialize;
