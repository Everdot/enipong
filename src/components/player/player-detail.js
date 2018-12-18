import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

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
          font-family: 'Pacifico';
          color: #0056B3;
        }
        h3{
          color:red;
          font-size:1.5em;
        }
      </style>

      <div id="[[player.id]]" class="player clearfix">
        <h1 class="name">[[player.name]]</h1>
        <img class="pull-right img" src="{{mainImg}}">
        <p class="description">[[player.description]]</p>

        
        <ul class="specs">
          <li>
            <dl>
              <dt>Win ratio</dt>
              <h3>[[player.ratio]]%</h3>
            </dl>
          </li>
          <li>
            <dl>
              <dt>Team</dt>
              <a href=/team/[[player.team]]><dd>[[player.team]]</dd></a>
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
      mainImg: {
        type: String,
        value: "",
      },
    };
  }

  setImage(e){
    this.mainImg = e.path[0].src;
  }

  async _onIdChange() {
    console.log(this.id);
    // const url = `/data/players/details/${this.id}.json`;
    const url = `http://localhost:3000/player/${this.id}`;
    try {
      const response = await fetch(url);
      this.player = await response.json();
      this.mainImg = "/data/"+this.player.img;
    }
    catch (err) {
      console.log('fetch failed', err);
    }
  }
}


window.customElements.define('player-detail',PlayerDetail);
