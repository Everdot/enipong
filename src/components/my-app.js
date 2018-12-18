/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';

class MyApp extends LitElement {
  render() {
    // Anything that's related to rendering should be done in here.
    return html`
    <style>
      :host {
        --app-drawer-width: 256px;
        display: block;

        --app-primary-color: #D3D3D3;
        --app-secondary-color: #D3D3D3;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #D3D3D3;
        --app-section-odd-color:#D3D3D3 ;

        --app-header-background-color: #293237;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: #293237;
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #78909C;
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }

      .toolbar-top {
        background-color: var(--app-header-background-color);
      }

      [main-title] {
        font-family: 'Pacifico';
        font-size: 30px;
        /* In the narrow layout, the toolbar is offset by the width of the
        drawer button, and the text looks not centered. Add a padding to
        match that button */
        padding-right: 44px;
      }

      .toolbar-list {
        display: none;
      }

      .toolbar-list > a {
        display: inline-block;
        color: var(--app-header-text-color);
        text-decoration: none;
        line-height: 30px;
        padding: 4px 24px;
      }

      .toolbar-list > a[selected] {
        color: var(--app-header-selected-color);
        border-bottom: 4px solid var(--app-header-selected-color);
      }

      .menu-btn {
        background: none;
        border: none;
        fill: var(--app-header-text-color);
        cursor: pointer;
        height: 44px;
        width: 44px;
      }

      .drawer-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 24px;
        background: var(--app-drawer-background-color);
        position: relative;
      }

      .drawer-list > a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list > a[selected] {
        color: var(--app-drawer-selected-color);
      }

      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
      }

      .main-content {
        padding-top: 64px;
        min-height: 100vh;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        padding: 24px;
        background: var(--app-drawer-background-color);
        color: var(--app-drawer-text-color);
        text-align: center;
      }

      /* Wide layout: when the viewport width is bigger than 460px, layout
      changes to a wide layout. */
      @media (min-width: 460px) {
        .toolbar-list {
          display: block;
        }

        .menu-btn {
          display: none;
        }

        .main-content {
          padding-top: 107px;
        }

        /* The drawer button isn't shown in the wide layout, so we don't
        need to offset the title */
        [main-title] {
          padding-right: 0px;
        }
      }
    </style>

    <!-- Header -->
    <app-header>
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
        <div main-title>${this.appTitle}</div>
      </app-toolbar>

      <!-- This gets hidden on a small screen-->
      <nav class="toolbar-list">
        <a ?selected="${this._page === 'players'}" href="/players">Players</a>
        <a ?selected="${this._page === 'teams'}" href="/teams">Teams</a>
        <a ?selected="${this._page === 'calendar'}" href="/calendar">Calendar</a>
      </nav>
    </app-header>

    <!-- Drawer content -->
    <app-drawer .opened="${this._drawerOpened}"
        @opened-changed="${this._drawerOpenedChanged}">
      <nav class="drawer-list">
        <a ?selected="${this._page === 'players'}" href="/players">Players</a>
        <a ?selected="${this._page === 'teams'}" href="/teams">Teams</a>
        <a ?selected="${this._page === 'calendar'}" href="/calendar">Calendar</a>
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main role="main" class="main-content">
      <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      <players-view class="page" ?active="${this._page === 'players'}"></players-view>
      <player-detail-view class="page" playerId=${this._playerId} ?active="${this._page === 'player/'+this._playerId}"></player-detail-view>
      <teams-view class="page" ?active="${this._page === 'teams'}"></teams-view>
      <team-detail-view class="page" teamId=${this._teamId} ?active="${this._page === 'team/'+this._teamId}"></team-detail-view>
      <my-calendar class="page" ?active="${this._page === 'calendar'}"></my-calendar>
      <event-detail-view class="page" eventId=${this._eventId} ?active="${this._page === 'event/'+this._eventId}"></event-detail-view>
    </main>


    <footer>
      <p>WIP</p>
      <p>CAI ENIB 2018</p>
    </footer>

    <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _playerId : { type: String },
      _teamId : { type: String },
      _eventId : { type: String }
    }
  }

  constructor() {
    super();
    this._drawerOpened = false;
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  firstUpdated() {
    installRouter((location) => this._locationChanged(location));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`,
        (matches) => this._layoutChanged(matches));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false);
  }

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
  }

  _locationChanged() {
    const path = window.decodeURIComponent(window.location.pathname);
    const parts = path.slice(1).split('/');
    // const page = path === '/' ? 'view1' : path.slice(1);
    var page = {};
    if (parts[0] == 'player'){
      this._playerId = parts[1];
      page = parts[0] + '/' + parts[1];
    } else if (parts[0] == 'team'){
      this._teamId = parts[1];
      page = parts[0] + '/' + parts[1];
    } else if (parts[0] == 'event'){
      this._eventId = parts[1];
      page = parts[0] + '/' + parts[1];
    } else {
      page = parts[0] || 'players';
    }
    this._loadPage(page);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._updateDrawerState(false);
  }

  _updateDrawerState(opened) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  _loadPage(page) {
    switch(page) {
      // case 'view1':
      //   import('../components/my-view1.js');
      //   break;
      // case 'view2':
      //   import('../components/my-view2.js');
      //   break;
      // case 'view3':
      //   import('../components/my-view3.js');
      //   break;
      case 'players':
        import('../components/players-view.js');
        break;
      case 'player/'+this._playerId:
        console.log("case :",page);
        import('../components/player-detail-view.js');
        break;
        case 'teams':
        import('../components/teams-view.js');
        break;
      case 'team/'+this._teamId:
        console.log("case :",page);
        import('../components/team-detail-view.js');
        break;
      case 'calendar':
        console.log("case :",page);
        import('../components/Calendar/my-calendar.js');
        break;
      case 'event/'+this._eventId:
        import('../components/event-detail-view.js');
        break;
      default:
        page = 'view404';
        import('../components/my-view404.js');
    }
    this._page = page;
  }

  _menuButtonClicked() {
    this._updateDrawerState(true);
  }

  _drawerOpenedChanged(e) {
    this._updateDrawerState(e.target.opened);
  }
}

window.customElements.define('my-app', MyApp);
