// Runs the built site with accounts and notices kept in the server's memory,
// to try the server side on a machine with no database: npm run start:memory
// Everything posted is gone when the server stops.
process.env.YUVA_DB = 'memory';
delete process.env.MONGODB_URI;

const asked = process.argv.indexOf('--port');
const port = asked > -1 ? process.argv[asked + 1] : '5392';
process.argv = [process.argv[0], 'next', 'start', '--port', port];

await import('next/dist/bin/next');
