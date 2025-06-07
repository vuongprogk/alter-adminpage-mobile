const HOST = "http://localhost:8080";

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    devServerUrl: string;
  };
  hosts: {
    apiHost: string;
    external: {
      fonts: {
        google: string;
        googleStatic: string;
        googleCss: string;
      };
      placeholder: string;
    };
  };
}

// Default configuration values
const appConfig: AppConfig = {
  api: {
    baseUrl: `${HOST}/api`,
    timeout: 5000,
  },
  app: {
    devServerUrl: 'http://localhost:5173',
  },
  hosts: {
    apiHost: HOST,
    external: {
      fonts: {
        google: 'https://fonts.googleapis.com',
        googleStatic: 'https://fonts.gstatic.com',
        googleCss: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
      },
      placeholder: 'https://via.placeholder.com/600x400?text=No+Image',
    },
  },
};

export default appConfig;