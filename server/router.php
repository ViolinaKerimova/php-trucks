<?php

// Route URL paths
if($request->get('trucks')) {
	$response->trucks = $db->querybind_all('SELECT * FROM trucks ORDER BY id');
}
else if($request->get('trucks/[0-9]+')) {
	$truck_id = (int) $request->segment(1);
	$response->truck = $db->querybind_one('SELECT * FROM trucks WHERE id = ?', [ $truck_id ]);
	if(!$response->truck) {
		$response->code(404);
		$response->error('404: truck Not Found.');
	}
}
else if($request->post('trucks/[0-9]+') || $request->post('trucks')) {
	
	
	$truck_id = (int) $request->segment(1, 0);
	$truck = $request->data;
	if($truck) {	
		if(strlen($truck->reg_no) < 1) $response->error('Regester nomer is empty.');
		if(strlen($truck->description) < 3) $response->error('Description is shorter then 3 characters.');
	}
	else {
		$response->error('No JSON data sent.');
	}
	
	if($response->hasErrors()) {
		$response->code(400);
		$response->error('400: Invalid input.');
	}
	else {
		if($truck_id > 0) { // update existing
			$result = $db->querybind(
				'UPDATE trucks SET reg_no=?, description=? WHERE id=?', 
				[$truck->reg_no, $truck->description, $truck_id]
			);
		} else { // insert new
			$result = $db->querybind(
				'INSERT INTO trucks SET reg_no=?, description=?', 
				[$truck->reg_no, $truck->description]
			);
			$truck_id = $db->insert_id;
		}
		
		$response->truck = $db->querybind_one('SELECT * FROM trucks WHERE id = ?', [$truck_id]);
		$response->info('truck saved.');	
	}
}
else if($request->delete('trucks/[0-9]+')) {
	$truck_id = (int) $request->segment(1);
	$db->querybind('DELETE FROM transports WHERE truck_id = ?', [$truck_id] );
	$db->querybind('DELETE FROM trucks WHERE id = ?', [$truck_id] );
	$response->info("truck id=$truck_id and its transports deleted.");
}
else if($request->get('trucks/[0-9]+/transports')) {
	$truck_id = (int) $request->segment(1);
	$response->truck = $db->querybind_one('SELECT * FROM trucks WHERE id = ?', [$truck_id] );
	$response->transports = [];
	if($response->truck) {
		$response->transports = $db->querybind_all('SELECT * FROM transports WHERE truck_id = ?', [$truck_id] );
	}
	else {
		$response->code(404);
		$response->error("404: truck id=$truck_id not found.");
	}
}
else if($request->get('transports/[0-9]+')) {
	$transport_id = (int) $request->segment(1);
	$response->transport = $db->querybind_one('SELECT * FROM transports WHERE id = ?', [ $transport_id ]);
	if(!$response->transport) {
		$response->code(404);
		$response->error('404: transport Not Found.');
	}
}
else if($request->post('transports/[0-9]+') || $request->post('transports')) {
	$transport_id = (int) $request->segment(1);
	$transport = $request->data; // deserialized JSON object sent over the network.
	if($transport) {
		if(strtotime($transport->data) == false) $response->error('Data is not currect.');
		if($transport->quantity < 0) $response->error('Quantity is empty.');
//		$teltype = $db->querybind_one("SELECT * FROM teltypes WHERE id = ?", [$transport->teltype_id + 0]);
//		if(!$teltype) $response->error('Type is invalid.');
	}
	else {
		$response->error('No JSON data sent.');
	}
	
	if($response->hasErrors()) {
		$response->code(400);
		$response->error('400: Invalid input.');		
	}
	else {
		$args = [$transport->truck_id, $transport->data,$transport->quantity,$transport_id];
		
		if($transport_id > 0) { // update existing
			$result = $db->querybind('UPDATE transports SET truck_id=?, data=?, quantity=? WHERE id=?', $args);
		} else { // insert new
			$result = $db->querybind('INSERT INTO transports SET truck_id=?, data=?, quantity=?', $args);
			$transport_id = $db->insert_id;
		}

		$response->transport = $db->querybind_one('SELECT * FROM transports WHERE id = ?', [$transport_id]);
		$response->info('transport saved.');	
	}
}
else if($request->delete('transports/[0-9]+')) {
	$transport_id = (int) $request->segment(1);
	$db->querybind('DELETE FROM transports WHERE id = ?', [$transport_id] );
	$response->info("transport id=$transport_id deleted.");
}
else if($request->get('materials')) {
	$response->materials = $db->querybind_all('SELECT * FROM materials ORDER BY id');
}
else {
	$response->error('404: URL Not Found: /'.$request->path);
	$response->code(404);
}

// Outputs $response object as JSON to the client.
echo $response->render();