const Sequelize = require("sequelize");
const db = require("../db");

const Category = db.define("category", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
});

// Class methods for APIs

Category.getAll = async function () {
    const categories - await Category.findAll();
    return categories;
};

Category.addCategory = async function (str) {
    const newCategory = await Category.create({ name: str});
    return newCategory;
};

Category.removeCategory = async function (str) {
    const category = await Category.findOne({ where: { name: str }});
    await category.destroy();
};

// Hooks

const makeNameLowerCase = async category => {
    category.name = category.name.toLowerCase();
};

Category.beforeCreate(makeNameLowerCase);

module.exports = Category;