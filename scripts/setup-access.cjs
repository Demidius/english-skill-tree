/* Run only as the Firebase project owner, after deploying firestore.rules. No service key in Git. */
const {initializeApp,applicationDefault}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all)=>{if(v.startsWith('--'))a.push([v.slice(2),all[i+1]]);return a;},[]));
function nickEmail(nick){const n=nick.trim().toLowerCase();return /^[a-z0-9._-]+$/.test(n)?n+'@users.skilltree.app':'x-'+Buffer.from(n).toString('hex')+'@users.skilltree.app';}
(async()=>{
  if(!args.project||!args.nick||!args['confirm-email'])throw Error('Usage: node scripts/setup-access.cjs --project PROJECT --nick EXACT_LOGIN --confirm-email EXACT_EMAIL');
  const email=nickEmail(args.nick);
  if(email!==args['confirm-email'])throw Error('Confirmation email does not match the login. No changes made.');
  initializeApp({credential:applicationDefault(),projectId:args.project});
  const user=await getAuth().getUserByEmail(email); // Existing Auth account, never a display-name lookup or new account.
  if(user.disabled)throw Error('Account is disabled. No changes made.');
  const db=getFirestore(),p=await db.doc('profiles/'+user.uid).get();
  if(!p.exists)throw Error('Account has no application profile. Sign in to the site first.');
  const batch=db.batch();
  batch.set(db.doc('accessAdmins/'+user.uid),{name:args.nick,grantedAt:FieldValue.serverTimestamp()});
  batch.set(db.doc('system/access'),{version:1,updatedAt:FieldValue.serverTimestamp()});
  await batch.commit();console.log('Access enabled. Admin UID: '+user.uid+' ('+email+')');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
