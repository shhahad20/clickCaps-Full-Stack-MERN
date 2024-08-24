import 'dotenv/config';
export const dev = {
    app: { port: Number(process.env.PORT) || 3002 },
    db: {
        url: process.env.MOGODB_URL
    },
    jwt: {
        key: process.env.ACCESS_KEY || 'dkj55/?@df5FCXAf986__kjfd##8ifdlksad',
        activate_k: process.env.ACTIVATION_KEY || 'shdoiFGHe$$32309[]@09_==Xc',
        reset_k: process.env.RESET_PASSWORD_KEY || 'Pomeuw@34&&%ttZV?+sjeQ'
    },
};
