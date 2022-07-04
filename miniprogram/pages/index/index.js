// index.js

const { envList } = require("../../envList.js");

Page({
  data: {
    records: [],
    total: 0,
  },

  loadData() {
    const { CLOUD_FUNCTION_NAME } = getApp().globalData;

    wx.showLoading({
      title: "",
    });
    wx.cloud
      .callFunction({
        name: CLOUD_FUNCTION_NAME,
        data: {
          type: "getRecords",
        },
      })
      .then(({ result }) => {
        wx.hideLoading();
        if (!result) return;
        const { success, data } = result;
        if (success) {
          const total = data.reduce((sum, next) => sum + (next.cost || 0), 0);
          this.setData({
            total,
            records: data,
          });
        }
      })
      .catch((e) => {
        wx.hideLoading();
      });
  },

  onShow() {
    this.loadData();
  },

  jumpPage() {
    wx.navigateTo({
      url: "/pages/createRecord/index",
    });
  },
});
