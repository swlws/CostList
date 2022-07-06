// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

function appInfo(event, context) {
  const wxContext = cloud.getWXContext();

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(`call cloud funcitons, ${event.type}`);
  console.log(event);

  switch (event.type) {
    case "appInfo":
      return appInfo();
  }
};
