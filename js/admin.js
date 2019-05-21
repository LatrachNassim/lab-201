

// Initialisation de Firebase
firebase.initializeApp;

// --------------------------------------------
// Initialisation des gestionnaires d'événement
// --------------------------------------------


$('#loginForm').on('submit', emailPasswordLogin);

// ----------------------------------------
// Définition des gestionnaires d'événement
// ----------------------------------------

function emailPasswordLogin(event) {
    event.preventDefault();

    const email = $('#emailField').val();
    const password = $('#passwordField').val();

    // Votre code ici ...
    // Utilisez les variables 'email' et 'password' pour les transmettre à Firebase via le provider "Email/Password"
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (result) {
            console.log('Succès de l\'authentification', result);

            $('section#results').html(`
            <h3>Vous êtes bien connecté ${email} !</h3>
        `);
        })
        .catch(function (error) {
            console.log("Une erreur s'est produite", error.message);

            $('section#results').html(`
            <div class="alert alert-danger">${error.message}</div>
        `);
        });
}


// Initialisation de Firebase
firebase.initializeApp;

// Initialisation des gestionnaires d'événement
$('#addMessageForm').on('submit', onAddMessage);
$('#addUserForm').on('submit', onAddUser);

// ----------------------------------------
// 1) [À FAIRE] Complétez les gestionnaires d'événement onAddMessage() et onAddUser()
// ----------------------------------------

function onAddMessage(event) {
    event.preventDefault();

    const pseudo = $('#pseudo').val();
    const message = $('#message').val();

    // Votre code ici ...
    // Ajouter le pseudo et le message dans la database ...
    firebase.database().ref(`/messages`).push({
        pseudo: pseudo,
        message: message
    });
}

function onAddUser(event) {
    event.preventDefault();

    const nom = $('#nom').val();
    

    // Votre code ici ...
    // Ajouter le nom et l'age dans la database ...
    firebase.database().ref(`/Utilisateur`).push({
        nom: nom,
        age: age
    });
}



// ----------------------------------------
// 2) [À FAIRE] Écrivez le code qui permet de récupérer les messages ET les utilisateurs de la base
// ----------------------------------------

// Récupération des messages...
firebase.database().ref(`/messages`).on('value', function (snapshot) {
    let template = '';
    snapshot.forEach(function (item) {
        const { pseudo, message } = item.val();

        template += `<li>${pseudo} dit : "${message}"</li>`
    });
    $(`messages`).html(template);
});

// Récupération des utilisateurs...
firebase.database().ref(`/Utilisateur`).on('value', function (snapshot) {
    let template = '';
    snapshot.forEach(function (item) {
        const usersObj = item.val();

        template += `<li>${usersObj.nom} dit : "${usersObj.age}"</li>`
    });
    $(`Utilisateur`).html(template);
});

firebase.initializeApp;

// 2. [À FAIRE] Récupérez la liste des consoles de jeu et affichez-les dans le HTML ...
// Le HTML à utiliser por chaque console est le suivant :
/*
    <div class="card d-flex flex-column justify-content-end">
        <img class="card-img-top" src="images/consoles/<IMAGE>" alt="<NOM>">
        <div class="card-body" style="flex: initial">
            <h5 class="card-title"><NOM></h5>
            <p class="card-text"><CONSTRUCTEUR> / <PRIX>} €</p>
        </div>
    </div>
*/

const consolesRef = firebase.firestore().collection(`concerts`);

concertRef.get().then(function (querySnapshot) {
    let template = '';
    querySnapshot.forEach(function (doc) {
        const consoleJeu = doc.data();

        console.log(consoleJeu);

        template += `<div class="card d-flex flex-column justify-content-end">
                            <img class="card-img-top" src="images/consoles/${consoleJeu.image}" alt="${consoleJeu.nom}">
                            <div class="card-body" style="flex: initial">
                                <h5 class="card-title">${consoleJeu.nom}</h5>
                                <p class="card-text">${consoleJeu.constructeur} / ${consoleJeu.prix} €</p>
                            </div>
                        </div>`;
    });
    $(`#concerts`).html(template);
});



