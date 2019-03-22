export class SelectInit {
  constructor(areaId, areaCode = '0') {
    this.areaCode = areaCode;
    this.areaId = areaId;
    this.count = 0;
    this.areaIndex = [];
    this.data = [];
    this.value = '';
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

  startCount(areaArr,rules= [0,4,6,9]) {
    let tempArr = areaArr;
    let tempIdex = -1;
    let id;
    switch (this.count) {
      case 0:
        id = this.areaId;
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
      this.value += tempItem.value+' ';
      tempArr = tempArr[tempIdex].childs;
      this.count++;
      this.startCount(tempArr, rules);
    } else {
      return;
    };
  }
}
