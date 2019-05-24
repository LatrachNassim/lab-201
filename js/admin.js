

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// --------------------------------------------
// Initialisation des gestionnaires d'événement
// --------------------------------------------


$('#loginForm').on('submit', emailPasswordLogin);

// ----------------------------------------
// Définition des gestionnaires d'événement
// ----------------------------------------

function emailPasswordLogin(event) {
	event.preventDefault();

	const email = $('#inputEmail').val();
	const password = $('#inputPassword').val();

	// Votre code ici ...
	// Utilisez les variables 'email' et 'password' pour les transmettre à Firebase via le provider "Email/Password"
	
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function (result) {
		console.log('Succès de l\'authentification', result);

		$('section#concerts-list').html(`
		<h3>Vous êtes bien connecté ${email} !</h3>
		`);
		displayConcerts();
	})
	.catch(function (error) {
		console.log("Une erreur s'est produite", error.message);

		$('section#results').html(`
		<div class="alert alert-danger">${error.message}</div>
		`);
	});
}

$('#login-form').submit(emailPasswordLogin);

function displayConcerts() {
	firebase.database().ref('/concerts').once('value').then(function (concertsObj) {
		concertsObj = concertsObj.val();



		for (let key in concertsObj) {
			const concert = concertsObj[key];


			const container = $('<div class=\'concert-elt\'></div>');
			const dateConcert = $(`<p>Date : ${concert['date']}</p>`);
			const festival = $(`<p>Festival : ${concert['festival']}</p>`);
			const lieu = $(`<p>Lieu : ${concert['lieu']}</p>`);
			const pays = $(`<p>pays : ${concert['pays']}</p>`);
			const ville = $(`<p>ville : ${concert['ville']}</p>`);
			const updateBtn = $('<input type= "button" value="edit" class="update-btn"/>');
			const deleteBtn = $('<input type= "button" value="delete" class="delete-btn"/>');
			updateBtn.click(function () {
				concertToUpdate.date = concert["date"];
				concertToUpdate.festival = concert["festival"];
				concertToUpdate.lieu = concert["lieu"];
				concertToUpdate.pays = concert["pays"];
				concertToUpdate.ville = concert["ville"];
				concertToUpdate.id = key;
				displayUpdateForm();
			});
			deleteBtn.click(function () {
				firebase.database().ref().child('concerts/' + key).remove();
				refreshList();
			});


			container.append([dateConcert, festival, lieu, pays, ville, updateBtn, deleteBtn]);
			$('section#concerts-list').append(container);

		}



	});
}

function writeNewPost(date, lieu, pays, ville, festival) {
	// A post entry.
	let concerts = {
		author: date,
		uid: lieu,
		body: pays,
		title: ville,
		starCount: festival

	};

	const newPostKey = firebase.database().ref().child('posts').push().key;

	let updates = {};
	updates['/posts/' + newPostKey] = postData;
	updates['/user-posts/' + uid + '/' + newPostKey] = postData;

	return firebase.database().ref().update(updates);
}

function addconcert(event) {
	event.preventDefault();
	const concertsRef = firebase.database().ref('concerts');

	const newConcertRef = concertsRef.push();
	newConcertRef.set({
		date: $('#inputDate').val(),
		lieu: $('#inputLieu').val(),
		pays: $('#inputPays').val(),
		ville: $('#inputVille').val(),
		festival: $('#inputFestival').val(),
	})
}

$('#addconcert-form').submit(addconcert);

function inscription(event) {
	event.preventDefault();
	const email = $('#inputEmail').val();
	const password = $('#inputPassword').val();
	if (password != $('#inputConfirm_password').val()) {
		alert('Les deux mots de passe doivent être indentique !');
		return;
	}

	firebase.auth().createUserWithEmailAndPassword(email, password)
		.catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorMessage);
		}).then(function (success) {
			const inscriptionsRef = firebase.database().ref('users');


			inscriptionsRef.child(success.user.uid).set({
				Nom: $('#inputNom').val(),
				Prénom: $('#inputPrenom').val(),
				Pseudo: $('#inputPseudo').val(),
				Ville: $('#inputVille').val(),
				Codepostal: $('#inputCodepostal').val(),
				Email: email

			});

		});

}

function updateConcert(event) {
	event.preventDefault();
	$('#update-form').addClass('display-none');
	const concertUpdated = {
		date: $('#inputDate').val(),
		lieu: $('#inputLieu').val(),
		pays: $('#inputPays').val(),
		ville: $('#inputVille').val(),
		festival: $('#inputFestival').val()
	};
	const updates = {};
	updates['concerts/' + concertToUpdate.id] = concertUpdated;


	firebase.database().ref().update(updates);
	refreshList();
}

function refreshList() {
	$('section#concerts-list').empty();
	displayConcerts();
}

$('#update-form').submit(updateConcert);
$('#inscription-form').submit(inscription);





const concertToUpdate = {
	date: '',
	lieu: '',
	pays: '',
	ville: '',
	festival: ''
};

function displayUpdateForm() {
	$('#update-form').removeClass('display-none');
	$('#inputDate').val(concertToUpdate.date);
	$('#inputLieu').val(concertToUpdate.lieu);
	$('#inputPays').val(concertToUpdate.pays);
	$('#inputVille').val(concertToUpdate.ville);
	$('#inputFestival').val(concertToUpdate.festival);
}