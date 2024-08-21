const Sequelize = require("sequelize");
const db = require("../db");
const Category = require("./Categories");

const defaultImageURL = "https://cdn.bannerbuzz.com/media/catalog/product/resize/650/b/b/bbclc01_1.jpg"

const Card = db.define("card", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },

    description: {
        type: Sequelize.STRING,
    },

    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true,
            isNumeric: true,
        },
    },

    imgUrl: {
        type: Sequelize.TEXT,
        defaultValue: defaultImageURL,
        validate: {
            isUrl: true,
        },
    },

    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isEmpty: true,
            isNumeric: true,
            min: 0,
        },
    },

    itemNumber: {
        type: Sequelize.INTEGER,
        validate: {
            isNumeric: true,
        },
    },
});

Card.getAllCards = async () => {
    const cards = await Card.findAll();
    cards.sort((a, b) => (a.id > b.id ? 1 : -1));
    return cards;
};

Card.getByCategory = async category => {
    const cards = await Card.findAll({
        include: {
            model: Category,
            where: {
                name: category
            },
        },
    });
    cards.sort((a, b) => (a.id > b.id ? 1 : -1));
    return cards;
};

Card.getCard = async id => {
    const card = await Card.findByPk(id);
    return card;
};

Card.removeCard = async id => {
    const card = await Card.findByPk(id);
    await card.destroy();
    return card;
};

Card.addCard = async data => {
    const newCard = await Card.create(data);
    return newCard;
};

Card.updateCard = async data => {
    const card = await Card.findByPk(data.id);
    const update = await card.update(data);
    return update;
};

module.exports = Card;