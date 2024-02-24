const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors du hachage du mot de passe');
    }
};

module.exports = {hashPassword}