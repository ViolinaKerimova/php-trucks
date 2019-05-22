// All these function render piece of HTML to plug into the DOM tree.
// The HTML can be plugged using $('#id').html(new_html);

function render_trucks(trucks) {
	var html = "<tr>"+
			"<th>ID</th>"+
			"<th>Register nomer</th>"+
			"<th>Description</th>"+
			"<th></th>"+
		"</tr>";

	for(var i=0; i<trucks.length; i++) {
		var p = trucks[i];
		html += "<tr>" +
			"<td>" + p.id + "</td>" +
			"<td><a href='#' data-truck-id='" + p.id + "' class='truck-transports'>" +
				p.reg_no +
			"</a></td>"+
			"<td>" + p.description + "</td>" +
			"<td>" +
				"<a href='#' data-truck-id='" + p.id + "' class='edit_icon truck-edit'>Edit</a> " +
				"<a href='#' data-truck-id='" + p.id + "' class='delete_icon truck-delete'>Delete</a>" +
			"</td>" +
		"</tr>";
	}

	html = "<table class='grid'>"+html+"</table>";
	return html;
}

function render_truck_form(truck) {
	if(!truck) return 'Empty truck.';
	
	var html = '';
	var title = (truck.id) ? 'Edit truck' : 'Add truck';
	
	html += "<h1>" + title + "</h1>";
	html += "<form action='#' method='post'>";
	html += "<p><label>ID</label><input name='id' value='" + html_escape(truck.id) + "' readonly='readonly' /></p>";
	html += "<p><label>Regester Nomer: </label><input name='reg_no' value='" + html_escape(truck.reg_no) + "'/></p>";
	html += "<p><label>Description</label><input name='description' value='" + html_escape(truck.description) + "'/></p>";
	html += "<p><button>Save</button></p>";
	html += "</form>";
	
	return html;
}

// transportS
function render_transports(truck, transports) {	
	var html = '';
	
	html += "<p class='user_icon'>"+
			"<b>" + truck.reg_no + "</b>, "+ 
			transports.length + 
		"</p>";
	
	html += "<table class='grid'>";
	html += "<tr>"+
		"<th>ID</td>"+
		"<th>Truck_ID</td>"+
		"<th>Material</td>"+
		"<th>Data</th>"+
		"<th>Quantity</th>"+
		"<th><th>"+
	"</tr>";
	for(var i=0; i<transports.length; i++) {
		var material = transports[i];
		var materialtype = get_materialtype(material.material_id);
		html += "<tr>"+
			"<td>" + material.id + "</td>" +
			"<td>" + material.truck_id + "</td>" +
			"<td>" + html_escape(material.name) + "</td>" +
			"<td>" + html_escape(material.data) + "</td>" +
			"<td>" + material.quantity + "</td>" +
			"<td>" +
				"<a href='#' data-truck-id='" + truck.id + "' data-transport-id='" + material.id + "' class='edit_icon transport-edit'>Edit</a> " +
				"<a href='#' data-truck-id='" + truck.id + "' data-transport-id='" + material.id + "' class='delete_icon transport-delete'>Delete</a>" +
			"</td>"+
		"</tr>";
	}
	html += "</table>";
	
	html += "<p>" +
		"<a href='#' data-truck-id='" + truck.id + "' class='add_icon transport-add'>Add New transport</a> " +
		"<a href='#' data-truck-id='" + truck.id + "' class='refresh_icon transports-refresh'>Refresh</a>" +
		"</p>";

	return html;
}

function render_transport_form(transport) {
	if(!transport) return 'Empty transport.';
	
	var html = '';
	var title = (transport.id) ? 'Edit transport' : 'Add transport';
	
	html += "<h1>" + title + "</h1>";
	html += "<form action='#' method='post'>";
	
	html += "<p><label>ID</label><input name='id' value='" + html_escape(transport.id) + "' readonly='readonly' /></p>";
	html += "<p><label>truck_ID</label><input name='truck_id' value='" + html_escape(transport.truck_id) + "' readonly='readonly' /></p>";
	html += "<p><label>Data</label><input name='data' value='" + html_escape(transport.data) + "'/></p>";
	html += "<p><label>Quantity</label><input name='quantity' value='" + html_escape(transport.quantity) + "'/></p>";
	html += "<p><label>Materials</label>";
	html += "<select name='materialtype_id' class='txt medium'>";
	html += "<option value=''> </option>";
	for(var i = 0; i < materialTYPES.length; i++) {
		var materialtype = materialTYPES[i];
		var selected = (transport.materialtype_id === materialtype.id) ? 'selected' : '';
		html += "<option value='" + materialtype.id + "' " + selected + ">" + materialtype.name + "</option>";
	}
	html += "</select>";
	html += "</p>";

	html += "<p><button>Save</button></p>";
	html += "</form>";
	
	return html;
}

function render_messages(messages) {
	var html = '';
	if(messages) {	
		for(var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var css = (m.type === 'error') ? 'error_icon' : 'info_icon';
			html += "<p class='" + css + "'>" + m.text + "</p>";
		}
	}
	return html;
}

function get_materialtype(materialtype_id) {
	// materialTYPES is global variable preloaded on client start.
	for(var i=0; i < materialTYPES.length; i++) {
		if(materialTYPES[i].id == materialtype_id) {
			return materialTYPES[i];
		}
	}
	return null;
}
	
function html_escape(val) {
	return (val+'')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&apos;');
}

