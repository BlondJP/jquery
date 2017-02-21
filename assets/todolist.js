function getXMLHttpRequest() {
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	
	return xhr;
}

function	showAllTaches(){

	var xhr = getXMLHttpRequest();

	//templating du haut de page
	var form = document.getElementById('tachePartForViews');

	if(form){
		while (form.firstChild) form.removeChild(form.firstChild);

		var elemForm = document.createElement('div');
		var textEntry = '<div class="form-group" id="contentTache"><p><label for="tache">Tache</label></p><textarea name="content" class="form-control" id="tache"></textarea></div><div id="buttonAjoutModif"><p><button type="button" onClick="addTache()" class="btn btn-success">Creer</button></p></div>';
		elemForm.innerHTML = textEntry;
		form.appendChild(elemForm);
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200)) {
			var tabTaches = JSON.parse(xhr.response);
			var allTaches = document.getElementById('Taches');
			while (allTaches.firstChild) allTaches.removeChild(allTaches.firstChild);

			tabTaches.forEach(function (tache){

				// templating de la tache 
				var elem = document.createElement('tr');
	  			var todo = '<td>'+tache.content+'</td><td><button type="button" class="btn btn-primary" onClick="updateTache('+tache.id+')">Modifier</button></td><td><button type="button" onClick="suppTache('+tache.id+', this.parentNode.parentNode.rowIndex)" class="btn btn-danger">Supprimer</button></td>';
	  			elem.innerHTML = todo;
	  			allTaches.appendChild(elem);

			});
		}
	};

	xhr.open("GET", "getAllTache.php", true);
	xhr.send(null);
}

function	addTache(){
	
	var tache = document.getElementById('tache').value;

	/* Envoi en AJAX*/

	var xhr = getXMLHttpRequest();

	xhr.onreadystatechange = function() {


		if (xhr.readyState == 4 && xhr.status == 200 ) {
			var status = JSON.parse(xhr.response);
			if(status.ajout == "ok"){
				var entryTache = document.getElementById('tache');
 
				//on supprime l'ancien contenu si il y avait
				while (entryTache.firstChild) entryTache.removeChild(entryTache.firstChild);

				showAllTaches();
			}
		} 
	};

	xhr.open("POST", "addTache.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("tache="+tache);
}



function	suppTache(idTache, tabRow){

	var xhr = getXMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200 ) {
			var response = JSON.parse(xhr.response);
			if(response.supp == "ok"){
				document.getElementById("tabTaches").deleteRow(tabRow);
				showAllTaches();
			}
		}
	};

	xhr.open("GET", "suppTache.php?tacheId="+idTache, true);
	xhr.send(null);
}

function updateTache(tacheId){
	var xhr = getXMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200 ) {
			var response = JSON.parse(xhr.response);
			var entryTache = document.getElementById('tache');
 
			//on supprime l'ancien contenu si il y avait
			while (entryTache.firstChild) entryTache.removeChild(entryTache.firstChild);

			var newContent = document.createTextNode(response.content);
			var buttonModif = document.getElementById('buttonAjoutModif');

			//on supprime l'ancien bouton
			while (buttonModif.firstChild) buttonModif.removeChild(buttonModif.firstChild);

			var elem = document.createElement('p');
	  		var button = '<button type="button" onClick="updateBddTache('+tacheId+')" class="btn btn-success">Modifier</button>';
	  		elem.innerHTML = button;

			buttonModif.appendChild(elem);
		    entryTache.appendChild(newContent);
		}
	};

    xhr.open("GET", "getTacheById.php?id="+tacheId, true);
	xhr.send(null);
}

function	updateBddTache(tacheId){
	var tache = document.getElementById('tache').value;

	/* Envoi en AJAX*/

	var xhr = getXMLHttpRequest();

	xhr.onreadystatechange = function() {


		if (xhr.readyState == 4 && xhr.status == 200 ) {
			var status = JSON.parse(xhr.response);
			if(status.modif == "ok"){
				showAllTaches();
			}
		} 
	};

	xhr.open("POST", "upTache.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("tacheId="+tacheId+"&tache="+tache);
}

$(function(){

	$.ajax({
			       	url : 'getAllTache.php',
			       	type : 'GET',
			       	dataType : 'json', // On désire recevoir du JSON
			       	success : function(tasks, statut){ // code_json contient le JSON renvoyé
		           		console.log(tasks);
		           		$("#contentTache").children().remove();
		           		$("#contentTache").append('<p><label for="tache">Tache</label></p><textarea name="content" class="form-control" id="tache"></textarea>');
		           		$("#Taches").children().remove();
		           		tasks.forEach(function (task){

							// templating de la tache 
				  			$("#Taches").append('<tr><td>'+task.content+'</td><td><button id="buttonModif" hidden="'+task.id+'" type="button" class="btn btn-primary">Modifier</button></td><td><button id="buttonSupp" hidden="'+task.id+'" type="button" class="btn btn-danger">Supprimer</button></td></tr>');

						});
		       		}
	});

	$("#boutonJquery").click(function(){

		$.ajax({
	       	url : 'addTache.php',
	       	type : 'POST',
	       	data : 'tache=' + $('#tache').val(),

	       	dataType : 'json', // On désire recevoir du JSON

	       	success : function(code_json, statut){ // code_json contient le JSON renvoyé

			    $.ajax({
			       	url : 'getAllTache.php',
			       	type : 'GET',
			       	dataType : 'json', // On désire recevoir du JSON
			       	success : function(code_json, statut){ // code_json contient le JSON renvoyé
		           		console.log(code_json);
		           		$("#contentTache").children().remove();
		           		$("#contentTache").append('<p><label for="tache">Tache</label></p><textarea name="content" class="form-control" id="tache"></textarea>');
		           		$("#Taches").children().remove();
		           		code_json.forEach(function (tache){

							// templating de la tache 
				  			$("#Taches").append('<tr><td>'+tache.content+'</td><td><button id="buttonModif" hidden="'+tache.id+'" type="button" class="btn btn-primary">Modifier</button></td><td><button id="buttonSupp" hidden="'+tache.id+'" type="button" class="btn btn-danger">Supprimer</button></td></tr>');
						});
		       		}
		    	});
       		}
    	});
	});


});
