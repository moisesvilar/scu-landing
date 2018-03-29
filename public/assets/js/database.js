function DatabaseService() {
    firebase.initializeApp(DatabaseService.FIREBASE_CONFIG);
    this.database = firebase.database();
}

DatabaseService.FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDc2cVi7YSZcD6RMGMuW2hHJ42ITvqf4z0',
    authDomain: 'bardo-b9003.firebaseapp.com',
    databaseURL: 'https://bardo-b9003.firebaseio.com',
    projectId: 'bardo-b9003',
    storageBucket: 'bardo-b9003.appspot.com',
    messagingSenderId: '1052343586713'
};

DatabaseService.prototype.writeEmail = function(email) {
    const emailsRef = this.database.ref('emails');
    const newEmailRef = emailsRef.push();
    return newEmailRef.set({
        email: email
    });
};