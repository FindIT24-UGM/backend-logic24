exports.generateKeys = (number) => {
  let arr = [];
  do {
    let num = Math.floor(Math.random() * number + 1);
    arr.push(num);
    arr = arr.filter((item, index) => {
      return arr.indexOf(item) === index;
    });
  } while (arr.length < number);

  return arr;
};
