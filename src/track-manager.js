import 'whatwg-fetch';

const TRACKS_PATH = './tracks/';

export class TrackManager {
  static getTrack(key, game) {
    if (this.tracks[key] && this.tracks[key].sound) {
      return Promise.resolve(this.tracks[key]);
    } else if (this.tracks[key]) {
      return this._loadTrackAudio(key, this.tracks[key]);
    }

    return this._loadTrackData(key)
      .then(data => this._loadTrackAudio(data))
      .then(track => this._cacheBlob(track, game));
  }

  static _loadTrackData(key) {
    return fetch(`${TRACKS_PATH}${key}.json`)
      .then(resp => resp.json())
      .then(data => Object.assign(data, {
        key: key,
      }));
  }

  static _loadTrackAudio(data) {
    return fetch(`${TRACKS_PATH}${data.audioUrl}`)
      .then(resp => resp.arrayBuffer())
      .then(blob => Object.assign(data, {
        blob: blob,
      }));
  }

  static _cacheBlob(data, game) {
    game.cache.addSound(data.key, null, data.blob);
    return new Promise((resolve, reject) => {
      game.sound.setDecodedCallback(data.key, () => {
        console.log('decoded');
        return resolve(Object.assign(data, {
          sound: game.cache.getSound(data.key),
        }));
      });
      game.sound.decode(data.key);
    });
  }
}

TrackManager.tracks = {};
