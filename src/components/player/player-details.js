import { PolymerElement, html } from '@polymer/polymer-element.js';

import '@granite-elements/granite-bootstrap/granite-bootstrap';

export class PlayerDetail extends PolymerElement {

  static get template() {
    return html`
      <style include="granite-bootstrap"></style>
      <style>
        .player {
          margin: 10px;
          padding: 10px;
          border: solid 1px black;
          border-radius: 10px;
          min-height: 150px;
        }
        .back {
          width: 50px;
          height: 50px;
        }
        .img {
          float: left;
          border: 1px solid black;
          margin-right: 3em;
          margin-bottom: 2em;
          background-color: white;
          padding: 2em;
          height: 400px;
          width: 400px;
        }
        .ratio {
          clear:both;
        }

        ul.player-thumbs {
          margin: 0;
          list-style: none;
        }

        ul.player-thumbs li {
          border: 1px solid black;
          display: inline-block;
          margin: 1em;
          background-color: white;
        }

        ul.player-thumbs img {
          height: 100px;
          width: 100px;
          padding: 1em;
        }

        ul.specs {
          clear: both;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        ul.specs > li{
          display: inline-block;
          width: 200px;
          vertical-align: top;
        }

        ul.specs > li > span{
          font-weight: bold;
          font-size: 1.2em;
        }

        ul.specs dt {
          font-weight: bold;
        }

        h1 {
          border-bottom: 1px solid gray;
        }
      </style>

      <div id="[[player.id]]" class="player clearfix">
        <a href="#/players"><img class="pull-right back" src="/img/back.png"></a>
        <h1 class="name">[[player.name]]</h1>
        <img class="pull-right img" src="/data/[[player.img]]">
        <p class="description">[[player.description]]</p>

        <ul class="player-thumbs">
          <li>
            <img src="/data/[[player.img]]" player="[[player.img]]" on-click="setImage">
          </li>
          <li>
            <img src="/data/[[player.label]]" player="[[player.label]]" on-click="setImage">
          </li>
        </ul>
        <ul class="specs">
          <li>
            <dl>
              <dt>Win ratio</dt>
              <dd>[[player.ratio]]%</dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>Team</dt>
              <dd>[[player.team]]</dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>Contact</dt>
              <dd>[[player.availability]]</dd>
            </dl>
          </li>
        </ul>
      </div>
    `;
  }


  static get properties() {
    return {
      id: {
        type: String,
        observer: '_onIdChange',
      },
      player: {
        type: Object,
      },
    };
  }

  async _onIdChange() {
    const url = `/data/players/details/${this.id}.json`;
    try {
      const response = await fetch(url);
      this.player = await response.json();
    }
    catch (err) {
      console.log('fetch failed', err);
    }
  }
}


customElements.define('player-detail',PlayerDetail);