module.exports = {
    name: 'err',
    execute(err) {
        console.log(`An error occured with the database connection:\n${err}`);
    },
};