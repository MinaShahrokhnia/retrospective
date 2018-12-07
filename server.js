const express   = require('express'),
      signale   = require('signale'),
      fs        = require('fs'),
      _         = require('underscore'),
      uuidv1    = require('uuid/v1'),
      path      = require('path'),
      { dump }  = require('dumper.js'),
      Moniker   = require('moniker');

const app = express();

// main application port
const PORT = process.env.PORT || 3250;

app.get('/', function( req, res ) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static('public'));

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(PORT, () => {
  signale.success('Retro app successfully started at http://localhost:' + PORT);
});

let users = [];
let tags = [
  { label: 'demo', value: 'red' },
  { label: 'staging', value: 'blue' },
  { label: 'collaboration', value: 'yellow' },
  { label: 'communication', value: 'black' },
  { label: 'task', value: 'gray' },
  { label: 'product owner', value: 'green' },
  { label: 'other', value: 'darkblue' }
];

const columns = {
  ContinueChannel: [],
  StopChannel: [],
  StartChannel: []
};

io.sockets.on('connection', function ( socket ) {

  const user = {
    username: Moniker.choose(),
    id: uuidv1()
  };

  users.push(user);

  signale.debug('A new user is connected');
  console.log('---------------------------');
  dump(user);
  console.log('---------------------------');

  socket.emit('join:user', { user: user, tags: tags });
  socket.on('disconnect', function( userId ) {
    users = _.filter(users, function( user ) {
      return user.id != userId;
    });
  });

  socket.on('disable:timer', function() {
    io.sockets.emit('disable:timer');
  });

  socket.on('enable:timer', function() {
    io.sockets.emit('enable:timer');
  });

  socket.on('export:csv', function() {
    var cards = _.union(
      columns.ContinueChannel, 
      columns.StopChannel,
      columns.StartChannel
    );

    socket.emit('export:csv', cards);
  });

  socket.on('add:card', function( options ) {
    const card = options.card;

    let tag = { label: card.tag, value: card.color };
    const foundTag = _.findWhere(tags, { label: tag.label });
    if (!foundTag) {
      tag.value = '#'+Math.random().toString(16).substr(-6);
      card.color = tag.value;
      tags.push(tag);
    }

    columns[card.collectionName].push(card);
    io.sockets.emit('update:' + card.collectionName, columns[card.collectionName]);

    io.sockets.emit('update:tags', tags);
  });

  socket.on('remove:card', function( options ) {
    const card = options.card;
    columns[card.collectionName] = _.filter(columns[card.collectionName], function( model ) {
      return model.id != card.id;
    });
    io.sockets.emit('update:' + card.collectionName, columns[card.collectionName]);
  });

  socket.on('update:vote', function( options ) {
    const card = options.card;
    const model = _.findWhere(columns[card.collectionName], { id: card.id });

    let totalVoteOnThisCard = 0;
    columns[card.collectionName].forEach(function( model ) {
      const voter = _.findWhere(model.voters, { userId: card.userId });
      if (voter) {
        totalVoteOnThisCard += parseInt(voter.vote);
      }
    });

    if (totalVoteOnThisCard >= 5) {
      return;
    }

    const voter = _.findWhere(model.voters, { userId: card.userId });
    if (!voter) {
      model.voters.push({
        userId: card.userId,
        vote: 1
      });
    } else {
      voter.vote = parseInt(voter.vote) + 1;
    }

    model.vote = parseInt(model.vote) + 1;

    io.sockets.emit('update:' + card.collectionName, columns[card.collectionName]);
  });

  socket.on('change:timer', function( time ) {
    io.sockets.emit('update:timer', time.value);
  });

});
