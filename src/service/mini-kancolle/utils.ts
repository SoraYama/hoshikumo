import _ from 'lodash';
import shipsConfig from './assets/ships';
import { BUILD_RESOURCE_MAX } from './constants';

const resourceStr = ['油', '弹', '钢', '铝'];

export interface RandomItem {
  weight: number;
}

export const pickRandom = <T extends RandomItem>(list: T[]) => {
  if (_.isEmpty(list)) {
    return null;
  }
  if (_(list).some((item) => item.weight === undefined)) {
    throw new Error('Missing weight key in item of list');
  }
  const len = list.length;
  const total = _(list)
    .map((item) => item.weight)
    .reduce((a, b) => a + b, 0);
  const randomIndex = _.random(total);
  const sorted = _(list).sortBy('weight').value();
  const sortedWeight = _(sorted)
    .map((item) => item.weight)
    .value();
  let curTotal = 0;
  for (let i = 0; i < len; i++) {
    curTotal += sortedWeight[i];
    if (randomIndex <= curTotal) {
      return sorted[i];
    }
  }
  return sorted[0];
};

export const showResource = (resource: number[] = []) => {
  return _(resource)
    .map((r, i) => `${resourceStr[i]}: ${r}`)
    .join(' ');
};

export const weightBalance = <T extends RandomItem>(list: T[], figure: number) => {
  const d = (-2 * figure) / (list.length - 1);
  const res = _(list)
    .sortBy('weight')
    .map((item, index) => ({
      ...item,
      weight: Math.max(item.weight + Math.round(figure + index * d), 1),
    }))
    .value();
  return res;
};

export const findConfigShipById = _.memoize((shipId: number) => {
  return _.find(shipsConfig, (s) => s.id === shipId);
});

export const computeExtraWeight = (requiredResource: number[], inputResource: number[]) => {
  let extraWeight = 0;
  for (let i = 0; i < 4; i++) {
    extraWeight +=
      Math.round((BUILD_RESOURCE_MAX - (inputResource[i] - requiredResource[i])) / 1000) *
      Math.round(((inputResource[i] / 1000) * (i === 3 ? 10 : 1)) / 10);
  }
  return extraWeight;
};

export const showShip = (shipId: number) => {
  const ship = findConfigShipById(shipId);
  return `[${ship?.id || NaN}]「${ship?.name || null}」`;
};

export const strip = (num: number, precision = 12) => {
  return +parseFloat(num.toPrecision(precision));
};
