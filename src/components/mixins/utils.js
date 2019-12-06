export default {
  methods: {
    floatPlus(...numbers) {
      let count = 0;
      const num = 100000000;
      numbers.forEach(n => count += n * num);
      return parseFloat((count/num).toFixed(8));
    },
    convertStringToNumber(string) {
      return parseFloat(parseFloat(string).toFixed(8));
    }
  }
}
