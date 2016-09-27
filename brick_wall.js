function drag(ev) {
    //target the <a> tag which wrapping the "brick"<div>
	ev.dataTransfer.setData("a_brick", ev.target.parentElement.id);
}

function dragleave_handler(ev) {
    ev.preventDefault();
	if (ev.target.classList.contains("dragover")){
    ev.target.classList.remove("dragover");
	};
	if(ev.target.classList.contains('cell_Temp')){
		var row = ev.target.parentElement;
		row.removeChild(ev.target);
		rearrange(row);
	}
}

function dragover_handler(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("placeholder")){
		var row = ev.target.parentElement;
		var cell = document.createElement("div");
		cell.classList.add("cell_Temp");
		row.insertBefore(cell,ev.target);
		rearrange(row);
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
	//drop a brickOriginal into a new position
    if (ev.target.classList.contains("cell") && ev.target.getElementsByClassName('brickOriginal')[0] === undefined){
        ev.target.appendChild(brick);
        ev.target.classList.remove("dragover");
    }
	else if (ev.target.classList.contains("cell_Temp")){
		var cell = document.createElement("div");
		cell.classList.add("cell");
		cell.appendChild(brick);
		row.insertBefore(cell,ev.target);
		row.removeChild(ev.target);
	}
	rearrange(row);
	// different move for different source
	if(source_cell.classList.contains('cell')){
		// rearrange the original row
		if (3 < source_row.getElementsByClassName("cell").length &&
		source_cell.getElementsByClassName("brickOriginal")[0] === undefined){
		var blank = document.createElement("div");
		source_cell.appendChild(blank);
		blank.classList.add("brickOriginal-Blank");
		}
		rearrange(source_row);
	}else if (source_cell.classList.contains('row_Temp_ListItem')){
		//no rearrange, but modified style	 
		brick.getElementsByClassName('brickOriginal')[0].style.width = '100%';
	 	brick.getElementsByClassName('brickOriginal')[0].style.height = '100%';
	}
}

function drop_toTemp(ev){
	 ev.preventDefault();ev.stopPropagation();
	 var brick = document.getElementById(ev.dataTransfer.getData("a_brick"));
	 var source_cell = brick.parentElement;
	 var source_row = source_cell.parentElement;
	 var tipOn = ev.target;
	 if(source_cell.classList.contains('row_Temp_ListItem')){
		 return false;
	 }else{
		 brick.getElementsByClassName('brickOriginal')[0].style.width = '280px';
		 brick.getElementsByClassName('brickOriginal')[0].style.height = '128px';
		 var li = document.createElement('li');
		 li.classList.add('row_Temp_ListItem');
		 li.appendChild(brick);
		 if(tipOn.classList.contains('row_Temp_List')){
			 tipOn.insertBefore(li, tipOn.childNodes[0]);
			 }/*else if(tipOn.classList.contains('row_Temp_ListItem')){
				 document.getElementsByClassName('row_Temp_List').insertBefore(li,document.getElementsByClassName('row_Temp_List').childNodes[0]);
	 };*/
	 	if (3 < source_row.getElementsByClassName("cell").length &&
			source_cell.getElementsByClassName("brickOriginal")[0] === undefined){
			var blank = document.createElement("div");
			source_cell.appendChild(blank);
			blank.classList.add("brickOriginal-Blank");
	 	}
	 	rearrange(source_row);
	 }
}

function rearrange(row_){
	while (row_.getElementsByClassName("placeholder")[0]){
		row_.removeChild(row_.getElementsByClassName("placeholder")[0]);
	}
	for (let i = 0; i < row_.getElementsByClassName("cell").length + 1; i++){
		var placeholder = document.createElement("div");
		placeholder.classList.add("placeholder");
		row_.insertBefore(placeholder,row_.getElementsByClassName("cell")[i]);
	}
	var placeholder = document.createElement("div");
	placeholder.classList.add("placeholder");
	row_.insertBefore(placeholder, row_.getElementsByClassName('cell_Temp')[0]);
}


function add_brickOriginal (ev){
    /*var text = document.getElementById('main_text').value
    text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
	var ref = document.getElementById('ref').innerHTML;
    if (text.length < 1){return 0;}
    var cells = document.getElementsByClassName('cell');
    for(let i = cells.length - 1; i >= 0; i--){
		if (cells[i].getElementsByClassName('brickOriginal')[0]){
            continue;
		}else{
			cells[i].innerHTML += (*/
			//wrap the "brick" with a anchor tag, for linking colorbox
			//And wrap the anchor tag with a block
			//keep id for "drag()" recognize
			/*ev.target.innerHTML += ('<a id="anchor_brickOriginal' + document.getElementsByClassName('brickOriginal').length + '" href="#brickOriginal' + document.getElementsByClassName('brickOriginal').length +  '">' 
			//then create the brick style`
			+ '<div id="brickOriginal' + document.getElementsByClassName('brickOriginal').length + '" class="brickOriginal" draggable="true" ondragstart="drag(event);">'
			//then pull in the main_text and reference
            + '<textarea class="brick-content">' + '</textarea>'
			+ '<p class="brick-ref">' + '</p>'
            + '</div>' 
			+ '</a>');
			//link the anchor tag to the colorbox effect
			var newAnchor = ev.target.getElementsByTagName('a')[0];
			$(newAnchor).colorbox({inline: true, width:"50%", height:"50%"});*/
			$.colobox.close();
			/*break;
        }
    }
    document.getElementById('main_text').value = null;
    document.getElementById('ref').innerHTML = null;*/
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
    document.addEventListener('drop', function(ev){
		if(ev.target.parentElement.classList.contains('row')){
			drop(ev);
		}else if(ev.target.classList.contains('row_Temp_List')){
			drop_toTemp(ev);
		}
	});
    document.addEventListener('dragover', dragover_handler);
    document.addEventListener('dragleave', dragleave_handler);
	document.getElementById('main_text').addEventListener('paste', add_Title);
    // document.addEventListener('dragend', dragend);
}

window.onload = initialize;

$(document).ready(function() {
    $('.conclusion_Entry').colorbox({
		inline: true, width:"50%", height:"50%",
		onLoad: function(){
			$('#conclusionBox').show();
		},
		onCleanup: function(){
			$('#conclusionBox').hide();
		}
	});
	$('.cell-default').colorbox({
		html:'<textarea class="input-new" id="main_text"></textarea><br><p id="ref"></p><br><input type="submit" value="新增磚頭" onclick="add_brickOriginal();">', width:"30%", height:"50%", closeButton: false, 
	});
});
