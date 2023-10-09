//read from .env file
export const API_URL = import.meta.env.PUBLIC_ENVIRONMENT!='dev'?'http://0.0.0.0:2468':'http://localhost:2468';