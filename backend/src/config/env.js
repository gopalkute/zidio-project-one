import dotenv from 'dotenv';
dotenv.config();

const env = {
    port: process.env.PORT || 5000,

    mongodbLocalURI: process.env.MONGODB_LOCAL_URI || '',
    mongodbCloudURI: process.env.MONGODB_CLOUD_URI || '',

    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'honeysingh',
    accessTokenValidity: process.env.ACCESS_TOKEN_VALIDITY || '1h',
    accessTokenMaxAge: process.env.ACCESS_TOKEN_MAX_AGE || 86400000,

    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'badshah',
    refreshTokenValidity: process.env.REFRESH_TOKEN_VALIDITY || '1d',
    refreshTokenMaxAge: process.env.REFRESH_TOKEN_MAX_AGE || 604800000,

};

export default env;