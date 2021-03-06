const request = require('request');

const API_URL = 'https://api.pinboard.in/v1/';

function pinboardMethod(endpoint, singleOption) {
  return (options, callback) => {
    var opts = options;
    var cb = callback;
    const url = API_URL + endpoint;

    if (singleOption) {
      opts = { [singleOption]: opts };
    } else if (!cb && (typeof opts === 'function')) {
      cb = opts;
    } else if (opts.tags) {
      opts.tag = opts.tags;
    }

    const qs = Object.assign({}, { auth_token: this.token, format: 'json' }, opts);
    const params = {
      uri: url,
      json: true,
      qs,
    };

    request.get(params, (err, res, body) => {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    });
  };
}

function Pinboard(token) {
  this.token = token;
}

// API docs: "Returns the most recent time a bookmark was added, updated or deleted."
Pinboard.prototype.update = pinboardMethod('posts/update');

// options: url (req), description (title)(req), extended
// tags, dt (datetime), replace (yes/no), shared (yes/no), toread (yes/no)
// API docs: "Add a bookmark."
Pinboard.prototype.add = pinboardMethod('posts/add');

// API docs: "Delete a bookmark."
Pinboard.prototype.delete = pinboardMethod('posts/delete', 'url');

// options: url (req), description (title)(req), extended
// tags, dt (datetime), replace (yes/no), shared (yes/no), toread (yes/no)
// API docs: "Returns one or more posts on a single day matching the arguments.
// If no date or url is given, date of most recent bookmark will be used."
Pinboard.prototype.get = pinboardMethod('posts/get');

// Filter by up to three tags.
// API docs: "Returns a list of dates with the number of posts at each date."
Pinboard.prototype.dates = pinboardMethod('posts/dates');

// Up to three tags.
// API docs: "Returns a list of the user's most recent posts, filtered by tag."
Pinboard.prototype.recent = pinboardMethod('posts/recent');

// options: tag, start, results, fromdt, todt, meta
// API docs: "Returns all bookmarks in the user's account."
Pinboard.prototype.all = pinboardMethod('posts/all');

// API docs: "Returns a list of popular tags and recommended tags for a given URL.
// Popular tags are tags used site-wide for the url;
// recommended tags are drawn from the user's own tags."
Pinboard.prototype.suggest = pinboardMethod('posts/suggest', 'url');

// "Returns a full list of the user's tags along with the number of times they were used."
Pinboard.prototype.getTags = pinboardMethod('tags/get');

// API docs: "Delete an existing tag."
Pinboard.prototype.delTag = pinboardMethod('tags/delete', 'tag');

// options: old (req), new (req)
// API docs: "Rename an tag, or fold it in to an existing tag"
Pinboard.prototype.renameTag = pinboardMethod('tags/rename');

// API docs: "Returns the user's secret RSS key (for viewing private feeds)"
Pinboard.prototype.userSecret = pinboardMethod('user/secret');

// API docs: "Returns the user's API token (for making API calls without a password)"
Pinboard.prototype.api_token = pinboardMethod('user/api_token');

// API docs: "Returns a list of the user's notes"
Pinboard.prototype.listNotes = pinboardMethod('notes/list');

// API docs: "Returns an individual user note.
// The hash property is a 20 character long sha1 hash of the note text."
Pinboard.prototype.getNote = (id, cb) => {
  const url = `notes/${id}`;

  pinboardMethod(url).call(this, cb);
};

module.exports = Pinboard;
