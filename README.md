iNameCard
=========

每個人都可以透過包裝與創作來令人印象深刻

## Key feature

```
Host mumu
     Hostname=211.78.254.238
     User=root
     IdentityFile=~/.ssh/mumufuture_dsa
     PasswordAuthentication=no
     PubkeyAuthentication=yes
```

## Installation
------------

 1. Clone the repository (or download/unzip) into a directory.
 2. Run `$ npm install`
 3. Rename `/config.example.js` to `/config.js` and set mongodb and email credentials.
 4. Run app via `$ ./run.js` or `$ node run`

## Setup
------------

You need a few records in the database to start using the user system.

Run these commands on mongo. __Obviously you should use your email address.__

```js
use drywall;
db.admingroups.insert({ _id: 'root', name: 'Root' });
db.admins.insert({ name: {first: 'Root', last: 'Admin', full: 'Root Admin'}, groups: ['root'] });
var rootAdmin = db.admins.findOne();
db.users.save({ username: 'root', isActive: 'yes', email: 'your@email.addy', roles: {admin: rootAdmin._id} });
var rootUser = db.users.findOne();
rootAdmin.user = { id: rootUser._id, name: rootUser.username };
db.admins.save(rootAdmin);
```

Now just use the reset password feature to set a password.

 - `http://localhost:3000/login/forgot/`
 - Submit your email address and wait a second.
 - Go check your email and get the reset link.
 - `http://localhost:3000/login/reset/:token/`
 - Set a new password.

Login. Customize. Enjoy.