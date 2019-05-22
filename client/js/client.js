// This is a global variable with all rows of the "materialS" table.
var materialTYPES = [];

function reload_trucks() {
	$.get('trucks').done(function(data) {
		$('#trucks').html(render_trucks(data.trucks));
		$('#trucks-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#trucks-messages').html(render_messages(data.messages));
	});
}

function reload_transports(truck_id) {
	$.get('trucks/' + truck_id + '/transports').done(function(data) {
		$('#transports').html(render_transports(data.truck, data.transports));
		$('#transports-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#transports-messages').html(render_messages(data.messages));
	});
}

function reload_materialS() {
	$.get('materials').done(function(data) {
		materialTYPES = data.materials;
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#trucks-messages').html(render_messages(data.messages));
	});
}

$(document).ready(function() {
	
	reload_materialS();
	reload_trucks();

	$(document).on('click', 'a.trucks-refresh', function() {
		reload_trucks();
		return false; // disables default browser behavior when a hyper-link is clicked.
	});

	$(document).on('click', 'a.truck-add', function() {
		var new_truck = { id: '', reg_no: '', description: '' };
		$('#truck-edit').html(render_truck_form(new_truck));
		$('#truck-messages').html('');
		return false;
	});

	$(document).on('click', 'a.truck-edit', function() {
		var truck_id = $(this).attr('data-truck-id');
		$.get('trucks/'+truck_id).done(function(data) {
			$('#truck-edit').html(render_truck_form(data.truck));	
			$('#truck-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#truck-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('submit', '#truck-edit > form', function() {
		var edited_truck = $(this).serializeObject();
		$.postJSON('trucks/' + edited_truck.id, edited_truck).done(function(data) {
			$('#truck-edit').html('');
			$('#truck-messages').html(render_messages(data.messages));
			reload_trucks();
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#truck-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.truck-delete', function() {
		var truck_id = $(this).attr('data-truck-id');
		$.delete('trucks/' + truck_id).done(function(data) {
			reload_trucks();
			$('#truck-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#truck-messages').html(render_messages(data.messages));
		});
		return false;
	});


	// transportS
	$(document).on('click', 'a.truck-transports, a.transports-refresh', function() {
		var truck_id = $(this).attr('data-truck-id');
		reload_transports(truck_id);
		$('#transport-edit').html('');
		$('#transport-messages').html('');
		return false;
	});

	$(document).on('click', 'a.transport-delete', function() {
		var transport_id = $(this).attr('data-transport-id');
		var truck_id = $(this).attr('data-truck-id');
		$.delete('transports/' + transport_id).done(function(data) {
			reload_transports(truck_id);
		});
		return false;
	});

	$(document).on('click', 'a.transport-edit', function() {
		var transport_id = $(this).attr('data-transport-id');
		$.get('transports/'+transport_id).done(function(data){
			$('#transport-edit').html(render_transport_form(data.transport));
			$('#transport-messages').html(render_messages(data.messages));					
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#transport-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.transport-add', function() {
		var truck_id = $(this).attr('data-truck-id');
		var new_transport = { id: '', truck_id: truck_id, number: '', material_id: '' };
		$('#transport-edit').html(render_transport_form(new_transport));
		$('#transport-messages').html('');
		return false;
	});

	$(document).on('submit', '#transport-edit > form', function() {
		var transport = $(this).serializeObject();
		$.postJSON('transports/' + transport.id, transport).done(function(data) {
			$('#transport-edit').html('');
			$('#transport-messages').html(render_messages(data.messages));
			reload_transports(transport.truck_id);
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#transport-messages').html(render_messages(data.messages));
		});
		return false;
	});
});
