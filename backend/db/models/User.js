const Sequelize = require("sequelize");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const User = db.define("user", {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    type: {
        type: Sequelize.ENUM("guest", "customer", "admin"),
        defaultValue: "customer",
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    image: {
        type: Sequelize.STRING,
        defaultValue:
            "https://th.bing.com/th/id/OIP.zsaaVp0tIiSnOK-1rYpBnwAAAA?w=194&h=194&c=7&r=0&o=5&dpr=2&pid=1.7",
        validate: {
            isUrl: true,
        },
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
});

module.exports = User;

/**
 * instance methods
 */

User.prototype.correctPassword = function (candidatePwd) {
    //compare plain password to encrypted version
    return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT);
};

/**
 * class methods
 */

User.authenticate = async function ({ username, password }) {
    const user = await this.findOne({ where: { username }});
    if (!user || !(await user.correctPassword(password))){
        const error = Error("Incorrect username/password");
        error.status = 401;
        throw error;
    }
    return user.generateToken();
};

User.findByToken = async function (token) {
    try {
        const { id } = await jwt.verify(token, process.env.JWT);
        const user = await User.findByPk(id);
        if (!user) {
            throw "No User"
        }
        return user;
    } catch (ex) {
        const error = Error("Bad Token");
        error.status = 401;
        throw error;
    }
};

/**
 * hooks
 */

const hashPassword = async user => {
    //ensure a changed password also gets encrypted
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate(user => Promise.all(users.map(hashPassword)));