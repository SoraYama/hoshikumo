import _ from 'lodash';
import { BaseModule, Service, Trigger, TriggerMethod } from '@octo-bot/core';

import { ACTIONS, helpText, PREFIX } from '../service/mini-kancolle/constants';
import MiniService from '../service/mini.service';

@Trigger(PREFIX)
class MiniModule extends BaseModule {
  @Service('mini')
  private miniService!: MiniService;

  @Trigger({ match: 'add-r', methods: [TriggerMethod.Prefix], helpText: '' })
  public async addResource() {
    this.miniService.addResource();
  }

  @Trigger({ match: 'add-s', methods: [TriggerMethod.Prefix], helpText: '' })
  public async addShip() {
    this.miniService.addShip();
  }

  @Trigger({ match: ACTIONS.start, methods: [TriggerMethod.Prefix], helpText: helpText.start })
  public async start() {
    this.miniService.start();
  }

  @Trigger({ match: ACTIONS.build, methods: [TriggerMethod.Prefix], helpText: helpText.build })
  public async build() {
    const { params, user } = this.miniService;
    if (!this.auth()) {
      return;
    }
    if (params.length < 4) {
      this.event.reply({
        content: '投入资源输入错误, 请按照 "油, 弹, 钢, 铝, 次数" 的顺序输入并用空格分开',
      });
      return;
    }
    const resource = params.slice(0, 4);
    if (params[4] === 'nyk') {
      const msg = await this.miniService.build(resource, user!, true);
      this.event.reply({ content: msg });
      return;
    }
    const repeatTimes = +this.miniService.params[4] || 1;
    const nyk = params[5] === 'nyk';
    const msgs: string[] = [];
    for (let i = 0; i < repeatTimes; i++) {
      const msg = await this.miniService.build(resource, user!, nyk);
      msgs.push(msg);
      if (msg.startsWith('资源不足')) {
        break;
      }
    }
    this.event.reply({ content: msgs.join('\n') });
    return;
  }

  @Trigger({ match: ACTIONS.drop, methods: [TriggerMethod.Prefix], helpText: helpText.drop })
  public async drop() {
    if (!this.auth()) {
      return;
    }

    const { params: shipIds } = this.miniService;
    const user = this.miniService.user!;

    if (shipIds[0] === 'all') {
      const exceptIds = _(shipIds)
        .tail()
        .map((id) => +id)
        .concat(user.config.dropExceptIds)
        .push(1000);
      const ids = _(user.ships)
        .filter((s) => !exceptIds.includes(s.id) && s.amount > 1)
        .map((s) => new Array(s.amount - 1).fill('').map(() => s.id))
        .flatten()
        .value();
      user.setDropShipIds(_.tail(shipIds).map((id) => +id));
      if (_.isEmpty(ids)) {
        this.event.reply({ content: '没有可以拆除的舰娘了哦' });
        return;
      }
      const msg = await this.miniService.drop(ids);
      this.event.reply({ content: msg });
      return;
    }

    if (_(shipIds).some((id) => !_.isInteger(+id))) {
      this.event.reply({ content: '输入错误, 需要输入舰娘ID用空格分开哦' });
      return;
    }

    const msg = await this.miniService.drop(_.map(shipIds, (id) => +id));
    this.event.reply({ content: msg });
  }

  @Trigger({ match: ACTIONS.me, methods: [TriggerMethod.Prefix], helpText: helpText.me })
  public async me() {
    if (!this.auth()) {
      return;
    }

    this.miniService.me();
  }

  @Trigger({ match: ACTIONS.sec, methods: [TriggerMethod.Prefix], helpText: helpText.sec })
  public async sec() {
    if (!this.auth()) {
      return;
    }

    this.miniService.setSecretary();
  }

  @Trigger({ match: ACTIONS.upgrade, methods: [TriggerMethod.Prefix], helpText: helpText.upgrade })
  public async upgrade() {
    if (!this.auth()) {
      return;
    }

    this.miniService.upgrade();
  }

  @Trigger({ match: ACTIONS.trade, methods: [TriggerMethod.Prefix], helpText: helpText.trade })
  public async trade() {
    if (!this.auth()) {
      return;
    }

    this.miniService.trade();
  }

  @Trigger({
    match: ACTIONS.tradeRate,
    methods: [TriggerMethod.Prefix],
    helpText: helpText['trade-rate'],
  })
  public async tradeRate() {
    this.miniService.tradeRate();
  }

  @Trigger({
    match: ACTIONS.order,
    methods: [TriggerMethod.Prefix],
    helpText: helpText.order,
  })
  public async order() {
    if (!this.auth()) {
      return;
    }

    this.miniService.order();
  }

  private auth(): boolean {
    if (!this.miniService.user) {
      this.event.reply({
        content: `还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`,
      });
      return false;
    }
    return true;
  }
}

export default MiniModule;
