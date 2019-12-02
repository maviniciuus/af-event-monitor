const { SuperConsole } = require('af-super-console');

const EventMonitor = {
  _start: null,
  silent: false,
  debug(emitter, type) {
    const emit = emitter && emitter.emit;
    if (typeof emit !== 'function') return;

    // eslint-disable-next-line no-param-reassign
    emitter.emit = (event, ...args) => {
      const end = Date.now();
      const diff = EventMonitor._start === null ? 0 : end - EventMonitor._start;
      EventMonitor._start = end;

      if (args.length > 0) {
        // eslint-disable-next-line no-param-reassign
        if (Array.isArray(args)) args = args.join(', ');
        // eslint-disable-next-line no-param-reassign
        if (typeof args === 'object') args = JSON.stringify(args);

        if (!EventMonitor.silent) {
          SuperConsole.groupLog({
            groupColor: 'yellow',
            reasonColor: 'grey',
            messageColor: 'cyan',
            group: type || emitter.constructor.name,
            message: event,
            reason: `Duração: ${diff}ms - Argumentos: (${args})`,
          });
        }
      } else {
        if (EventMonitor.silent) {
          SuperConsole.groupLog({
            groupColor: 'yellow',
            reasonColor: 'magenta',
            messageColor: 'cyan',
            group: type || emitter.constructor.name,
            message: event,
            reason: `Duração: ${diff}ms`,
          });
        }
      }

      // eslint-disable-next-line prefer-rest-params
      return emit.apply(this, arguments);
    };
  },
};

module.exports = EventMonitor;
