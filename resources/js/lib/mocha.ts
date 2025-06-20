import Echo from 'laravel-echo';
import { io } from 'socket.io-client';

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'local',
  wsHost: window.location.hostname,
  wsPort: 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  transports: ['websocket'],
  client: io,
});

export default echo;
