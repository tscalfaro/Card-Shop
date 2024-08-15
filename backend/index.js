const { db } = require("./db");
const PORT = process.env.PORT || 5500;
const app = require("./server");

const init = async () => {
    // add await for SEED when seed file is ready
    try {
        await db.sync();
        app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
    } catch (ex) {
        console.log(ex);
    }
};

init();