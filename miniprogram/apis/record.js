const { QUICK_START_FUNCTIONS } = require("../config/cloudFnNames");

/**
 * 初始化数据库表
 */
function initCollections() {
  return wx.cloud
    .callFunction({
      name: QUICK_START_FUNCTIONS,
      data: {
        type: "initCollections",
      },
    })
    .then(({ result }) => {
      const { success } = result || {};
      console.log("init database: " + success);
    });
}
exports.initCollections = initCollections;

/**
 * 获取记录
 */
function getRecords() {
  return wx.cloud
    .callFunction({
      name: QUICK_START_FUNCTIONS,
      data: { type: "getRecords" },
    })
    .then(({ result }) => {
      return result;
    });
}
exports.getRecords = getRecords;

/**
 * 删除单挑记录
 *
 * @param {String} id 记录的ID
 */
function removeOneRecord(id) {
  return wx.cloud
    .callFunction({
      name: QUICK_START_FUNCTIONS,
      data: {
        type: "removeOneRecord",
        param: { id },
      },
    })
    .then(({ result }) => {
      return result;
    });
}
exports.removeOneRecord = removeOneRecord;

/**
 * 添加一条记录
 * @param {Object} param {date: string; cost: number; comment: string}
 */
function insertOneRecord(param) {
  return wx.cloud
    .callFunction({
      name: QUICK_START_FUNCTIONS,
      data: {
        type: "insertOneRecord",
        param,
      },
    })
    .then(({ result }) => {
      return result;
    });
}
exports.insertOneRecord = insertOneRecord;
