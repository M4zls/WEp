import { Novu } from '@novu/api';

const key = process.env.NOVU_SECRET_KEY;

export const novu = key
  ? new Novu({ secretKey: key })
  : ({
      trigger: async () => {
        console.log('[Novu mock] Notification skipped: NOVU_SECRET_KEY not set');
      },
    } as unknown as Novu);