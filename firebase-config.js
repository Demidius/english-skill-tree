/* Public Firebase client configuration. Authorization is enforced in firestore.rules. */
window.SkillFirebase = {
  config: {
    apiKey: 'AIzaSyDMLtjjGnFBLPF_nhVk_gz7RfHtRUY8ECI',
    authDomain: 'english-skill-tree-01.firebaseapp.com',
    projectId: 'english-skill-tree-01',
    storageBucket: 'english-skill-tree-01.firebasestorage.app',
    messagingSenderId: '727269577290',
    appId: '1:727269577290:web:789bd8a809897af3128cb3'
  },
  nickToEmail(nick) {
    const n = nick.trim().toLowerCase();
    if (/^[a-z0-9._-]+$/.test(n)) return n + '@users.skilltree.app';
    return 'x-' + Array.from(new TextEncoder().encode(n)).map(b => b.toString(16).padStart(2, '0')).join('') + '@users.skilltree.app';
  },
  init() {
    const emulator = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('emulator');
    if (!firebase.apps.length) firebase.initializeApp(emulator ? {...this.config,projectId:'demo-skill-tree',apiKey:'demo-api-key',authDomain:'localhost'} : this.config);
    const auth = firebase.auth(), db = firebase.firestore();
    // Emulator mode is accepted only on loopback and never changes the production project.
    if (emulator) {
      auth.useEmulator('http://127.0.0.1:9099', {disableWarnings: true});
      db.useEmulator('127.0.0.1', 8080);
    }
    return {auth, db};
  }
};
