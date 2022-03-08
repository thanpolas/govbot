/**
 * @fileoverview Matches snapshot protocols with twitter handles.
 */

exports.Protocols = {
  'gitcoindao.eth': 'gitcoin',
  'aave.eth': 'AaveAave',
  'sushigov.eth': 'SushiSwap',
  uniswap: 'Uniswap',
  'banklessvault.eth': 'BanklessHQ',
  'ens.eth': 'ensdomains',
  'cvx.eth': 'ConvexFinance',
  'olympusdao.eth': 'OlympusDAO',
  'balancer.eth': 'BalancerLabs',
  pancake: 'PancakeSwap',
  'badgerdao.eth': 'BadgerDAO',
  'dydxgov.eth': 'dydxprotocol',
  'loot-dao.eth': 'lootcrate',
  'graphprotocol.eth': 'graphprotocol',
  'bitdao.eth': 'BitDAO_Official',
  'rarible.eth': 'rarible',
  'qidao.eth': 'QiDaoProtocol',
  '1inch.eth': '1inch',
  'curve.eth': 'CurveFinance',
  'ilvgov.eth': 'illuviumio',
  'ybaby.eth': 'iearnfinance',
  'shapeshiftdao.eth': 'ShapeShift_io',
  'fei.eth': 'feiprotocol',
  'comp-vote.eth': 'compoundfinance',
  'paraswap-dao.eth': 'paraswap',
};

exports.ProtocolsAr = Object.keys(exports.Protocols).map((k) => k);
