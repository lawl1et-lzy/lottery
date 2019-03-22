const configMap = {
  '7' : {
    lottery: ['F'],
    radio: true,
    bank: false,
    agreements: true
  },
  '14' : {
    lottery: ['T'],
    radio: true,
    bank: false,
    agreements: true
  },
  '25' : {
    lottery: ['T', 'F'],
    radio: true,
    bank: true,
    agreements: true
  }
}

export default {
  config (id) {
    if(configMap[id]) {
      return configMap[id]
    } else {
      return {
        lottery: [],
        radio: false,
        bank: false,
        agreements: false
      }
    }
  }
}

