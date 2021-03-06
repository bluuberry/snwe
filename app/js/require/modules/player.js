/* jshint node: true */
'use strict';

/* global
$, utils, require, exports, __dirname */

const path = require('path');
const ExternalModule = require( path.resolve(__dirname, '../ExternalModule.js')).ExternalModule;


class playerModule extends ExternalModule {
  constructor(filePath,document,option=false) {
    super(filePath,document);
    this.container = 'left';
    this.refreshRate = 10000;
    this.initInterface();
  }

  initInterface() {
    const MPI = require(utils.store.get('player'));
    this.mpi = new MPI.musicPlayerInterface(this);
  }

  get isPlaying() {
    return this.mpi.isPlaying;
  }

  get trackInfo() {
    return this.mpi.trackInfo;
  }

  playpause() {
    this.mpi.playpause();
    this.update();
  }

  next() {
    this.mpi.next();
    this.update();
  }

  get icon() {
    // Get correct icon based on playing status
    var fa;
    if (this.isPlaying) {
      fa = "fas fa-pause";
    } else {
      fa = "fas fa-play";
    }
    return `<i class="${ fa }"></i>`;
  }

  update() {
    this.mpi.update();

    this.updateContent($("#player-output"), this.trackInfo);
    this.updateContent($("#player-play-icon"), this.icon);
  }

  get HTMLContent() {
    var moduleName = this.fileName;

    return  `
    <div class="widg" id="${moduleName}">
      <div class="button" id="${moduleName}-play-button">
        <i id="${moduleName}-play-icon"></i>
      </div>
      <div class="button" id="${moduleName}-next-button">
        <i  class="fas fa-step-forward" id="${moduleName}-next-icon"></i>
      </div>
      <span class="output" id="${moduleName}-output"> ... </span>
    </div>`

  }

  start () {
    this.update()
    var _this = this;

    $("#player-play-button").on("click", this.playpause.bind(this))
    $("#player-next-button").on("click", this.next.bind(this))

    setInterval(() => { _this.update()}, this.refreshRate)
  }

}

exports.module = playerModule;
