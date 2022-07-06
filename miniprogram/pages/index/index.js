// index.js
const { getRecords, removeOneRecord } = require("../../apis/record");

const MAP_TYPE = {
  wear: "穿戴",
  eat: "饮食",
  sleep: "住宿",
  traffic: "交通",
  play: "娱乐",
  other: "其它",
};

function groupByDate(list) {
  if (!Array.isArray(list)) return;

  const map = new Map();
  for (const item of list) {
    const { date } = item;
    let arr = map.get(date);
    if (!arr) {
      map.set(date, (arr = []));
    }
    item.type = MAP_TYPE[item.type || "other"];
    arr.push(item);
  }

  const res = [];
  for (const [key, value] of map) {
    res.push({
      date: key,
      list: value,
      total: value.reduce((m, n) => m + n.cost, 0),
    });
  }

  return res;
}

Page({
  data: {
    total: 0,
    groupedRecords: [],
  },
  records: [],
  // 记录点击的条目的ID
  checkedId: "",

  bindTap(e) {
    this.toggleDelBtn(this.checkedId);

    const { id } = e.currentTarget.dataset;
    if (this.checkedId === id) {
      this.checkedId = "";
      return;
    }

    this.toggleDelBtn(id);
    this.checkedId = id;
  },

  toggleDelBtn(id) {
    if (!id) return;

    const records = this.records;
    const item = records.find((item) => id === item._id);
    console.log(id, item);
    if (!item) return;

    item.delStyle = !!item.delStyle ? undefined : "width: 100px";
    this.setData({
      groupedRecords: this.data.groupedRecords,
    });
  },

  delOneRecord(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) return;

    this.toggleDelBtn(id);
    this.checkedId = "";

    const callRemove = () => {
      removeOneRecord(id).then((result) => {
        if (result.success) this.loadData();
      });
    };

    wx.showModal({
      content: "确认删除该记录？",
      cancelText: "取消",
      cancelColor: "#999",
      confirmText: "删除",
      confirmColor: "#f00",
      success: function (res) {
        res.confirm && callRemove();
      },
    });
  },

  loadData() {
    wx.showLoading({
      title: "",
    });
    getRecords()
      .then((result) => {
        wx.hideLoading();
        if (!result) return;
        const { success, data } = result;

        if (success) {
          const total = data.reduce((sum, next) => sum + (next.cost || 0), 0);

          this.records = data;
          this.setData({
            total,
            groupedRecords: groupByDate(data),
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
