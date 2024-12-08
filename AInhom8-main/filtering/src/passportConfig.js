const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql2');

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'auth_db'
});

passport.use(new GoogleStrategy({
        clientID: 'GOOGLE_CLIENT_ID',
        clientSecret: 'GOOGLE_CLIENT_SECRET',
        callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const fullname = profile.displayName;

        // Kiểm tra xem người dùng đã tồn tại chưa
        db.query('SELECT * FROM users WHERE google_id = ?', [googleId], (err, users) => {
            if (err) return done(err);
            if (users.length > 0) {
                return done(null, users[0]);
            } else {
                // Tạo mới người dùng
                db.query(
                    'INSERT INTO users (fullname, email, google_id, user_type) VALUES (?, ?, ?, "applicant")',
                    [fullname, email, googleId],
                    (err, result) => {
                        if (err) return done(err);
                        db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (err, newUser) => {
                            if (err) return done(err);
                            return done(null, newUser[0]);
                        });
                    }
                );
            }
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, users) => {
        done(err, users[0]);
    });
});
