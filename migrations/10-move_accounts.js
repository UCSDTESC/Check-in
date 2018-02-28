'use strict';

module.exports.id = 'move_accounts';

module.exports.up = function (done) {
  var users = this.db.collection('users');
  var accounts = this.db.collection('accounts');

  users.find({},
    {email: 1, password: 1, confirmed: 1}, (err, allUsers) => {
      if (err) {
        done(err);
      }

      allUsers.toArray()
        .then((allUsers) => {
          let remaining = allUsers.length;

          allUsers.forEach((user) => {
            accounts.insertOne({
              email: user.email,
              password: user.password,
              confirmed: user.confirmed
            })
              .then((newAccount) => {
                return users.updateOne({_id: user._id}, {
                  $set: {
                    account: newAccount.insertedId
                  },
                  $unset: {
                    email: 1,
                    password: 1,
                    confirmed: 1
                  }
                });
              })
              .then(() => {
                remaining--;

                if (remaining === 0) {
                  done();
                }
              })
              .catch(done);
          });
        })
        .catch(done);
    });
};

module.exports.down = function (done) {
  var users = this.db.collection('users');
  var accounts = this.db.collection('accounts');

  accounts.find({}, (err, allAccounts) => {
    if (err) {
      done(err);
    }

    allAccounts.forEach((account) => {
      users.findOne({account: account._id}, (err, user) => {
        if (err) {
          done(err);
        }

        user.email = account.email;
        user.password = account.password;
        user.confirmed = account.confirmed;
        users.update({_id: user._id}, user);
      });
    });
  });

  accounts.deleteMany({}, done);
};
