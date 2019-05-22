

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
			const lieux = $(`<p>Lieux : ${concert['lieu']}</p>`);
	  		const pays = $(`<p>pays : ${concert['pays'] }</p>`);
	  		const ville = $(`<p>ville : ${concert['ville'] }</p>`);


			container.append([dateConcert, festival, lieux, pays, ville]);
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

function addconcert() {
	const concertsRef = firebase.database().ref('concerts');

	const newConcertRef = concertsRef.push();
	newConcertRef.set({
		date: '04/06/19',
		lieu: 'Huntington Bank Pavillon at Northerly Island',
		pays: 'Illinois, Etats-Unis',
		ville: 'Chicago',
		festival: 'Anderson Paak'
	})
}

addconcert();

