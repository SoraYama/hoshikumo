import { observable, action, computed, reaction, IReactionDisposer } from 'mobx';
import _ from 'lodash';

import Ship from './ship';
import shipsConfig from '../assets/ships';
import { MiniKancolleStore } from '.';
import levelConfig from '../assets/level';
import { MAX_HOME_LEVEL } from '../constants';
import { showResource } from '../utils';

const INITIAL_RESOURCE = [20000, 20000, 20000, 20000];

interface UserConfig {
  dropExceptIds: number[];
}

interface InputUser {
  level?: number;
  id: string;
  resource?: number[];
  ships?: Ship[];
  secretary?: number | null;
  configs?: UserConfig;
}

const INIT_USER_CONFIG: UserConfig = {
  dropExceptIds: [],
};

class User {
  public id = '0';

  public store: MiniKancolleStore;

  @observable
  public level: number;

  @observable
  public resource: number[];

  @observable
  public secretary: null | number = null;

  @observable
  public ships: Ship[] = [];

  @observable
  public config: UserConfig;

  public disposeReaction: IReactionDisposer;

  constructor(user: InputUser, store: MiniKancolleStore) {
    this.store = store;
    this.level = user.level || 1;
    this.id = user.id;
    this.resource = user.resource || INITIAL_RESOURCE;
    this.ships = _(user.ships || [])
      .map((s) => new Ship({ amount: s.amount, id: s.id }, this))
      .value();
    this.secretary = user.secretary || null;
    this.config = user.configs || INIT_USER_CONFIG;

    this.disposeReaction = reaction(
      () => this.asJson,
      () => {
        this.store.syncData();
      },
      {
        delay: 10,
      },
    );
  }

  @computed
  public get asJson() {
    return {
      id: this.id,
      level: this.level,
      resource: this.resource,
      secretary: this.secretary,
      ships: this.ships.map((s) => s.asJson),
      config: this.config,
    };
  }

  @computed
  public get seceretaryShip() {
    if (!this.secretary) {
      return null;
    }
    return _(shipsConfig).find((s) => s.id === this.secretary)!;
  }

  @computed
  public get userLevelInfo() {
    return _.find(levelConfig, (info) => info.level === this.level)!;
  }

  @action
  public addResource(resource: number[]) {
    if (_(resource).some((r) => !_.isNumber(r) || _.isNaN(r))) {
      throw new Error(`???????????????????????????`);
    }
    this.resource = _(this.resource)
      .map((r, i) => {
        const targetResource = r + resource[i] || 0;
        if (targetResource < 0) {
          throw new Error(`????????????, ???????????????:\n${showResource(this.resource)}`);
        }
        return targetResource;
      })
      .value();
  }

  @action
  public dropShip(shipId: number, amount = 1) {
    const targetShip = this.getShipById(shipId);
    if (!targetShip) {
      throw new Error(`?????????????????????${shipId}`);
    }
    if (targetShip.amount - amount < 0) {
      throw new Error(`?????????????????????${shipId}, ${amount}`);
    }
    if (targetShip.amount === amount) {
      if (this.secretary === shipId) {
        throw new Error(`????????????????????????/?????????, ?????????????????????`);
      }
      targetShip.dispose();
      this.ships = _(this.ships).without(targetShip).value();
    } else {
      targetShip.addAmount(-amount);
    }
    this.store.syncData();
  }

  @action
  public addShip(shipId: number) {
    const userShip = this.getShipById(shipId);
    if (userShip) {
      userShip.addAmount(1);
    } else {
      const ship = new Ship({ id: shipId }, this);
      this.ships = [...this.ships, ship];
    }
    this.store.syncData();
  }

  @action
  public setSecretary(shipId: number | null) {
    if (!_.isInteger(shipId)) {
      throw new Error(`????????????, ?????????????????????ID`);
    }
    if (!shipId) {
      this.secretary = null;
      return;
    }
    const ship = this.getShipById(shipId);
    if (!ship) {
      throw new Error(`??????????????????[${shipId}]???????????????`);
    }
    this.secretary = shipId;
  }

  @action
  public upgrade() {
    if (this.level >= MAX_HOME_LEVEL) {
      throw new Error('??????????????????????????????');
    }
    this.level++;
  }

  @action
  public setLevel(level: number) {
    if (!_.isInteger(level)) {
      throw new Error('??????????????????');
    }
    this.level = level;
  }

  @action
  public setResource(resource: number[]) {
    if (resource.some((r) => !_.isInteger(r))) {
      throw new Error('??????????????????');
    }
    this.resource = resource;
  }

  @action
  public setShipAmount(shipId: number, amount: number) {
    const ship = this.getShipById(shipId);
    if (!ship) {
      const ship = new Ship({ id: shipId, amount }, this);
      this.ships.push(ship);
      return ship;
    }
    ship.setAmount(amount);
  }

  @action
  public setDropShipIds(shipIds: number[]) {
    if (_(shipIds).some((id) => !_.isInteger(id))) {
      throw new Error('??????ID????????????');
    }
    this.config = {
      ...this.config,
      dropExceptIds: shipIds,
    };
  }

  public getShipById(shipId: number) {
    return _(this.ships).find((s) => s.id === shipId);
  }

  public dispose() {
    this.disposeReaction();
  }
}

export default User;
