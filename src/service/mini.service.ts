import dayjs from 'dayjs';
import _ from 'lodash';

import { BaseService } from '@octo-bot/core';
import { Priv } from '@octo-bot/core/lib/types/IUser';

import groupConfig from './mini-kancolle/assets/build-group';
import dropConfig from './mini-kancolle/assets/drop';
import nykConfigs from './mini-kancolle/assets/nyk';
import rewardConfig, { RewardType } from './mini-kancolle/assets/reward';
import shipsConfig from './mini-kancolle/assets/ships';
import {
  ACTIONS,
  BUILD_RESOURCE_MAX,
  helpText,
  LEAST_RESOURCE,
  MAX_HOME_LEVEL,
  NYK_INDEX,
  PREFIX,
  RESOURCE_NAMES,
  ResourceType,
} from './mini-kancolle/constants';
import store from './mini-kancolle/store';
import Order, { OrderStatus } from './mini-kancolle/store/order';
import User from './mini-kancolle/store/user';
import {
  computeExtraWeight,
  findConfigShipById,
  pickRandom,
  showResource,
  showShip,
  strip,
  weightBalance,
} from './mini-kancolle/utils';

export default class MiniService extends BaseService {
  public get params(): string[] {
    if (!this.event.message.content) {
      return [];
    }
    return this.event.remain.slice(1);
  }

  public get user() {
    const { id } = this.event.sender;
    return store.getUserById(id);
  }

  public async addResource() {
    if (this.event.sender.privilege < Priv.White) {
      this.event.reply({ content: '抱歉，暂无权限' });
      return;
    }

    const [id, ...toAddResource] = this.params.map((r: string) => +r);
    if (id === 1551) {
      _(store.users).forIn((v) => v.addResource(toAddResource));
      this.event.reply({ content: '资源已全部添加' });
      return;
    }
    const user = store.getUserById(id.toString());
    if (!user) {
      this.event.reply({ content: `没有这个用户: ${id}` });
      return;
    }
    user.addResource(toAddResource);
  }

  public async addShip() {
    const [id, toAddShipId] = this.params.map((r: string) => +r);
    const targetUser = store.getUserById(id.toString());
    if (!targetUser) {
      this.event.reply({ content: `没有这个用户: ${id}` });
      return;
    }
    targetUser.addShip(toAddShipId);
    this.event.reply({ content: '舰船添加成功' });
  }

  public async start() {
    if (this.user) {
      this.event.reply({ content: '角色已存在' });
      return;
    }
    store.addNewUser(this.event.sender.id);
    this.event.reply({ content: '已经建立角色, 开始建造吧~' });
  }

  public async build(resource: string[] = [], user: User, isNyk: boolean) {
    try {
      if (resource.length !== 4) {
        return '投入资源输入错误, 请按照油, 弹, 钢, 铝的顺序输入并用空格分开';
      }
      const inputResource = _.map(resource, (r) => parseInt(r, 10));
      if (inputResource.some((r, index) => r < LEAST_RESOURCE[index])) {
        return '投入资源最少要 [1500, 1500, 2000, 1000]';
      }
      if (inputResource.some((r) => r > BUILD_RESOURCE_MAX)) {
        return '投入资源最多不能超过7000';
      }
      if (user.resource.some((r, i) => r < inputResource[i])) {
        return `资源不足, 目前资源为:\n${showResource(user.resource)}`;
      }

      const nyk = pickRandom(nykConfigs)!;
      const balancedGroupConfig = weightBalance(
        _(groupConfig)
          .filter((conf) => !conf.outOfDate || new Date().getTime() <= conf.outOfDate)
          .value(),
        -(user.level - 1) * 10 + (isNyk ? nyk.value : 0),
      );
      const group = pickRandom(balancedGroupConfig)!;
      const filteredByGroup = _(shipsConfig).filter((ship) => group.ships.includes(ship.id));
      const filteredByResource = filteredByGroup.filter((item) =>
        _.every(item.resource, (r, i) => r <= inputResource[i]),
      );
      const filteredBySeceretary = filteredByResource.filter(
        (item) => item.seceretary === null || _.indexOf(item.seceretary, user.secretary) > -1,
      );
      const weightMapped = filteredBySeceretary
        .map((item) => {
          return {
            ...item,
            weight: item.weight + computeExtraWeight(item.resource, inputResource),
          };
        })
        .value();
      const selectedShip = pickRandom(weightMapped) || findConfigShipById(1000)!;
      const isNewShip = !user.getShipById(selectedShip.id);
      user.addShip(selectedShip.id);
      user.addResource(_.map(inputResource, (r) => (isNyk ? Math.round(-r * NYK_INDEX) : -r)));
      this.bot.logger.info(
        `建造结果 - ${user.id} [${inputResource.join(', ')}] ${selectedShip.name} ${isNyk} ${
          nyk.value
        }`,
      );
      const nykText = isNyk ? `奶一口${nyk.text}\n` : '';
      const newText = isNewShip ? '[NEW] ' : '';
      return `${nykText}${newText}舰娘${showShip(selectedShip.id)}加入了舰队~`;
    } catch (e) {
      return e.message as string;
    }
  }

  public async drop(shipIds: number[]) {
    const user = this.user!;
    if (shipIds.length === 0) {
      return '参数需要舰娘ID';
    }
    const replyMsgArr = _.map(shipIds, (id) => {
      const dropShip = user.getShipById(id);
      if (!dropShip) {
        return `舰队中没有ID为[${id}]的舰娘哦~`;
      }
      if (id === user.secretary && dropShip.amount === 1) {
        return `不能解体秘书舰, 请先更换秘书舰`;
      }

      try {
        user.dropShip(id);
        const dropShipConfig = findConfigShipById(id)!;
        const balancedConfigs = weightBalance(
          dropConfig,
          Math.round(_.sum(dropShipConfig.resource) / 20),
        );
        const dropGroup = pickRandom(balancedConfigs)!;
        const reward = pickRandom(
          _.map(
            dropGroup.reward,
            (rewardId) => _(rewardConfig).find((reward) => reward.id === rewardId)!,
          ),
        )!;

        if (reward.type === RewardType.resource) {
          this.bot.logger.info(`解体结果 - ${user.id} ${id} ${reward.type} ${reward.reward}`);
          user.addResource(reward.reward as number[]);
          return `解体${showShip(id)}成功!\n获得资源:\n${showResource(reward.reward as number[])}`;
        } else if (reward.type === RewardType.ship) {
          if (typeof reward.reward === 'number') {
            const rewardShip =
              pickRandom(
                _(groupConfig)
                  .find((g) => g.group === reward.reward)!
                  .ships.map((shipId) => _(shipsConfig).find((s) => s.id === shipId)!)
                  .filter((s) => _.every(s.resource, (r, i) => r <= dropShipConfig.resource[i]))
                  .filter((s) => s.seceretary === null || s.seceretary.includes(user.secretary!)),
              ) || findConfigShipById(1013)!;
            user.addShip(rewardShip.id);

            this.bot.logger.info(`解体结果 - ${user.id} ${id} ${reward.type} ${rewardShip.name}`);

            return `解体${showShip(id)}成功!\n妖精们利用拆卸下来的零件重新建造成了${showShip(
              rewardShip.id,
            )}~`;
          } else {
            _.each(reward.reward, (r) => {
              user.addShip(r);
            });
            const shipNames = _(reward.reward)
              .map((id) => findConfigShipById(id)!.name)
              .join('、');

            this.bot.logger.info(`解体结果 - ${user.id} ${id} ${reward.type} ${shipNames}`);
            return `解体${showShip(id)}成功!\n妖精们利用拆卸下来的零件重新建造成了${shipNames}~`;
          }
        }
      } catch (e) {
        this.bot.logger.warn(e);
        return e?.message;
      }
    });

    return replyMsgArr.join('\n\n');
  }

  public async me() {
    const user = this.user!;
    const ships = _.isEmpty(user.ships)
      ? '[暂无舰娘]'
      : _(user.ships)
          .sortBy('id')
          .map((s) => `${showShip(s.id)} × ${s.amount}`)
          .join('\n');
    const userSeceretaryStr = user.secretary ? showShip(user.secretary) : '空';

    const { userLevelInfo } = user;

    const infoMap = {
      镇守府等级: `${new Array(user.level)
        .fill('')
        .map(() => '★')
        .join('')}`,
      资源详情: showResource(user.resource),
      秘书舰: userSeceretaryStr,
      资源上限: userLevelInfo.limit,
      资源增长速度: `[${userLevelInfo.accumulateVelocity.join(', ')}]`,
      升级所需まるゆ数量:
        userLevelInfo.upgradeRequirement === null
          ? '已满级'
          : `${userLevelInfo.upgradeRequirement}个`,
      资源兑换手续费率: `${userLevelInfo.tradeTaxRate * 100}%`,
      舰队详情: ships,
    };
    this.event.reply({ content: _.map(infoMap, (v, k) => `${k}:\n${v}`).join('\n\n') });
  }

  public async setSecretary() {
    const [inputSecretary] = this.params;
    const user = this.user!;

    if (!inputSecretary) {
      if (!user.secretary) {
        return this.event.reply({ content: '你现在还没有设置秘书舰' });
      }
      return this.event.reply({ content: `你现在的秘书舰为: ${showShip(user.secretary)}` });
    }
    if (inputSecretary === 'null') {
      user.setSecretary(null);
      return this.event.reply({ content: '秘书舰已置空' });
    }
    try {
      user.setSecretary(+inputSecretary);
      return this.event.reply({
        content: `设置成功, 你现在的秘书舰为${showShip(+inputSecretary)}`,
      });
    } catch (e) {
      return this.event.reply({ content: e.message });
    }
  }

  public async upgrade() {
    const user = this.user!;
    const { userLevelInfo } = user;
    if (!userLevelInfo) {
      this.event.reply({ content: `啊哦你的镇守府出问题了, 请联系空山` });
      return;
    }
    const userMaruyu = user.getShipById(1000);
    if (!userLevelInfo.upgradeRequirement) {
      this.event.reply({ content: `镇守府已到达最高等级啦` });
      return;
    }
    if (!userMaruyu || userMaruyu.amount < userLevelInfo.upgradeRequirement) {
      this.event.reply({
        content: `马路油数量不足哦 (${userMaruyu?.amount || 0}/${
          userLevelInfo.upgradeRequirement
        })`,
      });
      return;
    }
    if (userMaruyu.amount === userLevelInfo.upgradeRequirement && user.secretary === 1000) {
      this.event.reply({ content: `不能拆除作为秘书舰的まるゆ哦~ 请先将秘书舰换成别人` });
      return;
    }
    if (user.level >= MAX_HOME_LEVEL) {
      this.event.reply({ content: `镇守府已到达最高等级啦` });
      return;
    }
    try {
      user.dropShip(1000, userLevelInfo.upgradeRequirement);
      user.upgrade();
    } catch (e) {
      this.event.reply({ content: e.message });
      return;
    }
    this.event.reply({ content: `镇守府升级啦, 当前等级为 ${user.level}级` });
  }

  public async trade() {
    const user = this.user!;

    if (user.secretary !== 1034) {
      this.event.reply({ content: `需要${showShip(1034)}作为旗舰哦` });
      return;
    }
    if (this.params.length < 3) {
      this.event.reply({
        content: `参数输入错误, 应该为 "${PREFIX} ${ACTIONS.trade} <要交换的资源类型> <目标资源类型> <要交换的数量>"`,
      });
      return;
    }
    const [sourceType, targetType, sourceAmount] = this.params.map((p: string) => +p);
    if (
      _.some(
        [sourceType, targetType],
        (t) => !_.inRange(t, ResourceType.oil - 1, ResourceType.al + 1),
      )
    ) {
      this.event.reply({ content: `资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝` });
      return;
    }
    if (!_.isInteger(sourceAmount)) {
      this.event.reply({ content: `请输入整数作为要交换的资源量` });
      return;
    }
    const userSourceAmount = user.resource[sourceType - 1];
    if (sourceAmount > userSourceAmount) {
      this.event.reply({
        content: `抱歉你没有那么多的${RESOURCE_NAMES[sourceType - 1]}(${userSourceAmount})`,
      });
      return;
    }

    const tradeRate = store.getTradeRate(sourceType);
    const { userLevelInfo } = user;
    const targetAmount = Math.round(
      strip(sourceAmount * tradeRate[targetType - 1] * (1 - userLevelInfo.tradeTaxRate), 2),
    );
    const toCalcResource = [0, 0, 0, 0];
    toCalcResource[targetType - 1] = targetAmount;
    toCalcResource[sourceType - 1] = -sourceAmount;
    user.addResource(toCalcResource);
    this.bot.logger.info(
      `交易结果 - ${user.id} ${sourceType} ${targetType} [${tradeRate.join(
        ', ',
      )}] ${sourceAmount} ${targetAmount}`,
    );
    this.event.reply({
      content: `明老板很开心, 收下了你的${sourceAmount}${
        RESOURCE_NAMES[sourceType - 1]
      } 并给你了 ${targetAmount}${RESOURCE_NAMES[targetType - 1]}${
        userLevelInfo.tradeTaxRate === 0
          ? ''
          : `\n(顺便一提明老板收取了${sourceAmount * userLevelInfo.tradeTaxRate}${
              RESOURCE_NAMES[sourceType - 1]
            } 作为手续费~)`
      }`,
    });
  }

  public async tradeRate() {
    const [sourceType] = this.params.map((r: string) => +r);
    if (!_.inRange(sourceType, 0, 5)) {
      this.event.reply({ content: `资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝` });
      return;
    }
    const rate = store.getTradeRate(sourceType);
    this.event.reply({
      content: `目前${RESOURCE_NAMES[sourceType - 1]}对其他资源的交换比率为[${rate.join(', ')}]`,
    });
    return;
  }

  public async order() {
    const user = this.user!;
    const tradeTypes = ['s2r', 'r2s', 'r2r', 's2s'];
    const typesText = [
      ['舰娘', '资源'],
      ['资源', '舰娘'],
      ['资源', '资源'],
      ['舰娘', '舰娘'],
    ];

    const formatOrder = (order: Order) => `ID: ${order.id}
发起用户: ${order.sellerId}
接收用户: ${order.buyerId || '暂无'}
订单状态: ${order.statusText}
交易类型: ${typesText[order.orderType].join(' → ')}
他将给出: [${order.toTrade.join(', ')}]
他将收到: [${order.wanted.join(', ')}]
创建时间: ${dayjs(order.createdAt).format('YYYY-MM-DD HH-mm-ss')}`;

    try {
      const [action, ...extra] = this.params;
      const orderType = tradeTypes.indexOf(action);
      if (orderType >= 0) {
        const [tradingStr, targetUserId = null] = extra;
        if (/^\d+([,，]\d+)*-\d+([,，]\d+)*$/.test(tradingStr) === false) {
          this.event.reply({
            content:
              '交易信息输入错误, 请输入类似于 "1000,1001-10000,10000,10000,10000"【短杠前后分别为交易出和入的资源/舰娘ID（根据你的交易类型）, 数字间逗号分隔不能有空格】',
          });
          return;
        }
        const [outcoming, incoming] = tradingStr
          .split('-')
          .map((str) => str.split(/,|，/))
          .map((item) => item.map((s) => +s));
        const checkInputAccordingToOrderType = [[incoming], [outcoming], [incoming, outcoming], []][
          orderType
        ];
        if (
          !_.isEmpty(checkInputAccordingToOrderType) &&
          _.some(checkInputAccordingToOrderType, (arr) => arr.length !== 4)
        ) {
          this.event.reply({ content: '交换资源时需要4种资源数量写全' });
          return;
        }
        if (_([outcoming, incoming]).every((arr) => _(arr).some((n) => !_.isInteger(n) || n < 0))) {
          this.event.reply({ content: '资源或舰娘ID输入错误' });
          return;
        }
        const newOrder = store.addNewOrder({
          toTrade: outcoming,
          wanted: incoming,
          sellerId: user.id,
          buyerId: targetUserId || null,
          orderType,
        });
        this.event.reply({
          content: `交易订单已创建, ID为 ${newOrder.id}
确认订单内容可以执行 "${PREFIX} ${ACTIONS.order} info ${newOrder.id}"
发布订单可以执行 "${PREFIX} ${ACTIONS.order} pub ${newOrder.id}"`,
        });
        return;
      }
      switch (action) {
        case 'list': {
          const orderList = _(store.orders)
            .filter((order) => order.status === OrderStatus.ACTIVE)
            .map((order) => order.id)
            .value();
          if (_.isEmpty(orderList)) {
            this.event.reply({ content: `当前没有在交易中的订单` });
            return;
          }
          this.event.reply({ content: `目前在交易中的订单为:\n${orderList.join('\n')}` });
          return;
        }
        case 'me': {
          const mySelled = _(store.orders).filter((order) => order.sellerId === user.id);
          const myStandbyIds = mySelled
            .filter((order) => order.status === OrderStatus.CREATED)
            .map((order) => order.id)
            .value();
          const myPublishedIds = mySelled
            .filter((order) => order.status === OrderStatus.ACTIVE)
            .map((order) => order.id)
            .value();
          const myFinishedIds = mySelled
            .filter((order) => order.status === OrderStatus.FINISHED)
            .map((order) => order.id)
            .value();
          const myCanceledIds = mySelled
            .filter((order) => order.status === OrderStatus.CANCELD)
            .map((order) => order.id)
            .value();
          const myReceived = _(store.orders)
            .filter((order) => order.buyerId === user.id)
            .map((order) => order.id)
            .value();
          const getText = (ids: number[]) => (_.isEmpty(ids) ? '暂无' : ids.join('\n'));
          this.event.reply({
            content: `待发布的订单ID:
${getText(myStandbyIds)}\n
你发布的订单ID:
${getText(myPublishedIds)}\n
已结束的订单ID:
${getText(myFinishedIds)}\n
你取消的订单ID:
${getText(myCanceledIds)}\n
你作为接收方的订单ID:
${getText(myReceived)}`,
          });
          return;
        }
        case 'info': {
          const orderId = +extra[0];
          const order = store.getOrderById(orderId);
          if (!order) {
            this.event.reply({ content: '没有查询到该ID的订单' });
            return;
          }
          this.event.reply({ content: formatOrder(order) });
          return;
        }
        case 'apply': {
          const orderId = +extra[0];
          const order = store.getOrderById(orderId);
          if (!order) {
            this.event.reply({ content: '没有查询到该ID的订单' });
            return;
          }
          if (order.sellerId === user.id) {
            this.event.reply({ content: '不能向自己做交易哦' });
            return;
          }
          if (order.buyerId && order.buyerId !== user.id) {
            this.event.reply({ content: '这笔订单是定向交易, 你不是被指定的买家哦' });
            return;
          }
          order.setBuyerId(user.id);
          order.excute();
          this.bot.logger.info(`交易结果 - ${user.id} - ${order.id}`);
          const texts = typesText[order.orderType];
          this.event.reply({
            content: `交易成功, 你用${texts[1]}[${order.wanted}]换得了${texts[0]}[${order.toTrade}]`,
          });
          return;
        }
        case 'pub': {
          const orderId = +extra[0];
          const order = store.getOrderById(orderId);
          if (!order) {
            this.event.reply({ content: '没有查询到该ID的订单' });
            return;
          }
          if (order.sellerId !== user.id) {
            this.event.reply({ content: '你不能发布别人的订单哦' });
            return;
          }
          order.publish();
          this.event.reply({ content: `订单发布成功` });
          return;
        }
        case 'cancel': {
          const orderId = +extra[0];
          const order = store.getOrderById(orderId);
          if (!order) {
            this.event.reply({ content: '没有查询到该ID的订单' });
            return;
          }
          if (order.sellerId !== user.id) {
            this.event.reply({ content: '你不能取消别人的订单哦' });
            return;
          }
          order.cancel();
          this.event.reply({ content: `订单取消成功` });
          return;
        }
        default: {
          this.event.reply({ content: helpText.order });
          return;
        }
      }
    } catch (e) {
      this.event.reply({ content: `交易失败\n${e.message}` });
      return;
    }
  }
}
