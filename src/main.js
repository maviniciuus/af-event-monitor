const { SuperConsole } = require('af-super-console');

let start = null;
const EventMonitor = function (emitter, type) {
  var emit = emitter && emitter.emit;
  if (typeof emit !== 'function') return;

  emitter.emit = function (event, ...args) {
    var end = Date.now();
    var diff = start === null ? 0 : end - start;
    start = end;

    if (args.length > 0) {
      if (Array.isArray(args)) args = args.join(', ');
      if (typeof args === 'object') args = JSON.stringify(args);
      SuperConsole.groupLog({
        groupColor: 'yellow',
        reasonColor: 'grey',
        messageColor: 'cyan',
        group: type || emitter.constructor.name,
        message: event,
        reason: `Duração: ${diff}ms - Argumentos: (${args})`,
      });
    } else {
      SuperConsole.groupLog({
        groupColor: 'yellow',
        reasonColor: 'magenta',
        messageColor: 'cyan',
        group: type || emitter.constructor.name,
        message: event,
        reason: `Duração: ${diff}ms`,
      })
    }

    return emit.apply(this, arguments);
  };
};

module.exports = EventMonitor;
