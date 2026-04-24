let cachedSdk;

const loadSdk = async () => {
  if (!cachedSdk) {
    cachedSdk = import('@google/stitch-sdk');
  }

  return cachedSdk;
};

export const DEFAULT_STITCH_DEVICE_TYPE = 'MOBILE';

export const createStitchClient = async ({ apiKey = process.env.STITCH_API_KEY, sdkModule } = {}) => {
  if (!apiKey) {
    throw new Error('STITCH_API_KEY is required to create the Stitch client.');
  }

  const sdk = sdkModule ?? (await loadSdk());
  const toolClient = new sdk.StitchToolClient({ apiKey });
  const stitch = new sdk.Stitch(toolClient);

  return {
    async projects() {
      if (typeof stitch.projects !== 'function') {
        throw new Error('Stitch project listing is not available in this SDK.');
      }

      return stitch.projects();
    },
    async createProject(title) {
      const project = await stitch.createProject(title);
      return project?.projectId ?? project?.id;
    },
    project(projectId) {
      const project = stitch.project(projectId);

      return {
        async generate(prompt, deviceType = DEFAULT_STITCH_DEVICE_TYPE) {
          return project.generate(prompt, deviceType);
        },
        async variants(screen, prompt, options) {
          return screen.variants(prompt, options, DEFAULT_STITCH_DEVICE_TYPE);
        },
      };
    },
    async getHtml(screen) {
      return screen.getHtml();
    },
    async getImage(screen) {
      return screen.getImage();
    },
    async close() {
      await toolClient.close();
    },
  };
};
