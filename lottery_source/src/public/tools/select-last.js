export  default {
  selectLast(arr) {
    if(Array.isArray(arr)){
      let length = arr.length;
      if (length > 0) {
        return arr[length-1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}