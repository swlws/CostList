const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const COLLECTION_RECORD = "record";
const db = cloud.database();

let initEnd = false;

/**
 * 初始化数据库集合
 */
async function initCollections() {
  if (initEnd === true) return { success: true };

  try {
    await db.createCollection(COLLECTION_RECORD);

    initEnd = true;
    return {
      success: true,
    };
  } catch (e) {
    initEnd = true;
    return {
      success: true,
      data: "create collection success",
    };
  }
}

/**
 * 添加一条记录
 *
 * @param {*} event
 * @param {*} context
 */
async function insertOneRecord(event, context) {
  const { OPENID: _openid } = cloud.getWXContext();
  const { param } = event;

  if (!param) return { success: false };

  try {
    await db.collection(COLLECTION_RECORD).add({ data: { ...param, _openid } });

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
}

/**
 * 移除一条记录
 *
 * @param {*} event
 * @param {*} context
 */
async function removeOneRecord(event, context) {
  const { param } = event;
  if (!param) return { success: false };

  const { id } = param;
  if (!id) return;

  try {
    await db.collection(COLLECTION_RECORD).doc(id).remove();
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
}

/**
 * 获取所有记录
 *
 * @param {*} event
 * @param {*} context
 */
async function getRecords(event, context) {
  const { OPENID: _openid } = cloud.getWXContext();

  try {
    const clustor = await db
      .collection(COLLECTION_RECORD)
      .where({
        _openid,
      })
      .orderBy("date", "desc")
      .get();

    return {
      success: true,
      data: clustor.data,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e,
    };
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(`call cloud funcitons, ${event.type}`);
  console.log(event);

  switch (event.type) {
    case "initCollections":
      return await initCollections();
    case "insertOneRecord":
      return await insertOneRecord(event, context);
    case "removeOneRecord":
      return await removeOneRecord(event, context);
    case "getRecords":
      return await getRecords(event, context);
  }
};
