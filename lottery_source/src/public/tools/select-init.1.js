export class SelectInit {
  constructor(areaCode = '0',extraId) {
    this.areaCode = areaCode;
    this.extraId = extraId;
    this.count = 0;
    this.areaIndex = [];
    this.data = [];
    this.value = [];
  }

  findCodeIndex(id, arrar) {
    var index = -1;
    if (arrar) {
      index = arrar.findIndex(function (item) {
        return item.id === id;
      })
    }
    return index;
  }

  startCount(areaArr,rules= [2,4,6,9]) {
    let tempArr = areaArr;
    let tempIdex = -1;
    let id;
    switch (this.count) {
      case 0:
        if (this.extraId) {
          id = this.extraId
        } else {
          id = this.areaCode.substr(0, rules[0]);
        }
        break;
      case 1:
        id = this.areaCode.substr(0, rules[1]);
        break;
      case 2:
        id = this.areaCode.substr(0, rules[2]);
        break;
      case 3:
        id = this.areaCode.substr(0, rules[3]);
        break;
    }
    tempIdex = this.findCodeIndex(id, tempArr);
    if (tempIdex > -1) {
      let item = tempArr[tempIdex];
      let tempItem = {};
      for (let key in item) {
        if (key !== "childs") {
          tempItem[key] = item[key];
        }
      }
      this.data.push(tempItem);
      this.areaIndex.push(tempIdex);
      this.value.push(tempItem.value);
      tempArr = tempArr[tempIdex].childs;
      this.count++;
      this.startCount(tempArr, rules);
    } else {
      return;
    };
  }
}
