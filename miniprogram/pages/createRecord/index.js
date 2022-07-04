// index.js

function padStart(v) {
  return ("" + v).length === 1 ? "0" + v : v;
}

function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year + "-" + padStart(month) + "-" + padStart(day);
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: currentDate(),
    cost: 0,
    comment: "",
  },

  bindValueChange: function (e) {
    const ds = e.currentTarget.dataset;
    const { name } = ds;

    const { value } = e.detail;
    switch (name) {
      case "cost":
        this.setCost(value);
        break;
      case "date":
        this.setDate(value);
        break;
      case "comment":
        this.setComment(value);
        break;
    }
  },

  setDate(value) {
    this.setData({
      date: value,
    });
  },
  setCost: function (value) {
    let v = parseFloat(value);
    v = isNaN(v) ? 0 : v;

    this.setData({
      cost: v,
    });
  },
  setComment(value) {
    this.setData({
      comment: value,
    });
  },

  doAddOneRecord() {
    wx.showLoading({
      title: "",
    });

    const { CLOUD_FUNCTION_NAME } = getApp().globalData;
    wx.cloud
      .callFunction({
        name: CLOUD_FUNCTION_NAME,
        data: {
          type: "insertOneRecord",
          param: this.data,
        },
      })
      .then(({ result }) => {
        wx.hideLoading();
        if (result.success) wx.navigateBack();
      })
      .catch((e) => {
        wx.hideLoading();
      });
  },

  submit() {
    wx.showActionSheet({
      itemList: ["确认提交"],
      success: () => {
        this.doAddOneRecord();
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },
});
