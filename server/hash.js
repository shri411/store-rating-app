const bcrypt = require('bcryptjs');
bcrypt.hash('Owner123!', 10, (err, hash) => {
    console.log("New Hash:", hash);
});