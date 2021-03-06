import levelConfig from './assets/level';

export const AL_RISING_STEP = 10;
export const OTHER_RISING_STEP = 30;
export const INIT_STORE_DATA = {
  users: {},
  orders: [],
};
export const RESOURCE_MAX_LIMIT = 300000;
export const PREFIX = '/fleet';
export const BUILD_RESOURCE_MAX = 7000;
export const NYK_INDEX = 1.1;
export const MAX_HOME_LEVEL = levelConfig.length;
export const LEAST_RESOURCE = [1500, 1500, 2000, 1000];
export const ACTIONS = {
  build: 'build',
  me: 'me',
  help: 'help',
  start: 'start',
  drop: 'drop',
  sec: 'sec',
  upgrade: 'upgrade',
  trade: 'trade',
  tradeRate: 'trade-rate',
  order: 'order',
};
export const enum ResourceType {
  oil = 1,
  armor,
  steel,
  al,
}
export const RESOURCE_NAMES = ['油', '弹', '钢', '铝'];

export const helpText = {
  help: '显示某个帮助信息, 参数为指令',
  start: '初始化角色, 入坑的起点',
  build: `模拟大建, 后面需要加的参数为: 油 弹 钢 铝 次数(不加就只建造一次) nyk(可选), 用空格分开即可 (资源最低为 [1500, 1500, 2000, 1000], 最高为 [7000, 7000, 7000, 7000])
例如: "${PREFIX} ${ACTIONS.build} 4000 6000 6000 2000 3"
如果后面加 nyk 的话则多收取10%的建造资源来提升or降低稀有船出货率 (还是看脸, 不建议低保使用这个功能)`,
  sec: '置换秘书舰, 后面参数为舰娘ID',
  drop:
    '解体舰娘来换取报酬, 后面参数为舰娘们的ID, 可以一次解体多个\n一键拆除除了まるゆ和想要保留的多号机id们的命令为 "/fleet drop all <想保留的id们, 用空格分开>" (不用重复设置哦)',
  me: '查询你当前的信息',
  upgrade: `拆解まるゆ来升级镇守府, 高等级镇守府资源回复速度更快, 资源交换手续费也更高, 同时影响仓库资源最大上限 [注: 镇守府等级最高为${MAX_HOME_LEVEL}级]`,
  trade: `向明老板交换资源, 后面参数有三个, 分别为 <要交换的资源类型> <目标资源类型> <要交换的资源量(整数)>, 资源类型可选值为1~4, 对应 油 弹 钢 铝\n例如 "${PREFIX} ${ACTIONS.trade} 1 3 20000"`,
  'trade-rate': '查看当前的资源交换汇率, 参数为你想查看的资源类型',
  order: `向其他提督交换资源和舰娘, 可在 "${PREFIX} ${ACTIONS.order}" 后面追加的指令有:
s2r | r2s | r2r | s2s: s=ship, 2=to, r=resource, 即指定交易类型, 后面参数为交易的数额, 例如: "${PREFIX} ${ACTIONS.order} s2r 1001,1000-20000,20000,20000,20000 1551" 代表交出ID为1001和1000的舰娘换取用户ID为1551的20000各项资源 (注意: 逗号分隔不能有空格, 用户ID不指定则谁都可以交易)
list: 查看现在在交易中的ID
me: 可以查询自己发布和接受的订单ID
info: 后面接参数订单ID, 可查看该订单详情
apply: 后面接参数订单ID, 可以履行该订单
pub: 后面接参数订单ID来发布该订单, 才能让其他人看到
cancel: 后面接参数订单ID来取消订单`,
};
