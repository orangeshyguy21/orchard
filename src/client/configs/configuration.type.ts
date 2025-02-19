export type Config = {
  mode : {
    production: boolean;
  },
  api : {
    proxy: string;
    path: string;
  }
};