import { join } from "path";

export const Consts = {
    GRAPHQL_API_NAME: `${process.env.APP_NAME}_api_${process.env.ENVIRONMENT}`,
    COGNITO_POOL_NAME: `${process.env.APP_NAME}_UserPool_${process.env.ENVIRONMENT}`,
    TABLE_NAMES: {
        thoughts: `${process.env.APP_NAME}_thoughts_${process.env.ENVIRONMENT}`,
    },
    DOMAIN_PREFIX: `${process.env.APP_NAME?.toLowerCase()}${
        process.env.ENVIRONMENT !== 'PROD'
            ? '-' + process.env.ENVIRONMENT?.toLowerCase()
            : ''
    }`,
    LAMBDAS_BUCKET_NAME: `${process.env.APP_NAME?.toLowerCase()}-lambdas-${process.env.ENVIRONMENT?.toLowerCase()}`,
    RESOURCE_PATH: join(__dirname, '../resources'),
    LAMBDAS_NAMES: {
        UTILS: {
            PRESIGN_URLS: `${process.env.APP_NAME}_presign_urls_${process.env.ENVIRONMENT}`
        }
    }
};
