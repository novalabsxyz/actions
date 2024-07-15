import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { actionsSpecOpenApiGetResponse } from '../openapi';

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: 'get',
    path: '/indoorHotspot',
    tags: ['Helium Mobile'],
    responses: actionsSpecOpenApiGetResponse,
  }),
  async (c) => {
    const response = {
      icon: 'https://shdw-drive.genesysgo.net/FADBZsWFgaRj47StTMDfQ1pXuw1SZLZVH5aTShyVVBWv/hotspot-indoor.jpg',
      label: `Buy Indoor Hotspot`,
      title: `Helium Mobile Hotspot`,
      description: `Deploy indoor coverage for the Helium Network, and earn MOBILE.`,
      links: {
        actions: [
          {
            label: 'Buy Hotspot',
            href: '/api/hotspot-blink?name={name}&email={email}&address={address}',
            parameters: [
              {
                name: 'name',
                label: 'Enter your name',
              },
              {
                name: 'email',
                label: 'Enter your email',
              },
              {
                name: 'address',
                label: 'Enter your address',
              },
            ],
          },
        ],
      },
    };

    return c.json(response);
  },
);

export default app;
