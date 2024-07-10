/**
 * 生成听牌麻将
 * (返回一个包含13张处于【听牌状态】的麻将的数组)
 * 规则和要求：
 *  - 只考虑数字牌且只有一种牌型“万”的情况(1到9表示1万到9万)
 *  - 符合公式 mAAA+nABC+DD 其中 m、n为任意非负数且m + n = 4 或者符合公式 7DD
 *  - 同一个值的牌有4张，比如有4张1万，4张2万，4张3万，4张4万，4张5万，4张6万，4张7万，4张8万，4张9万
 */

/**
 * 判断14张牌是否符合 mAAA+nABC+DD
 * @param {Array<number>} tiles
 * @returns {boolean}
 */
function checkAAAmABCnDD1(tiles) {
  // 对牌进行排序
  tiles.sort((a, b) => a - b);

  // 检查是否存在刻子或顺子
  function checkTripletsAndSequences(arr, needPair) {
    if (arr.length === 0) return true;
    if (needPair && arr.length === 2 && arr[0] === arr[1]) return true;
    if (arr.length < 3) return false;

    // 检查刻子
    if (arr[0] === arr[1] && arr[1] === arr[2]) {
      if (checkTripletsAndSequences(arr.slice(3), needPair)) {
        return true;
      }
    }

    // 检查顺子
    const first = arr[0];
    const secondIndex = arr.indexOf(first + 1);
    const thirdIndex = arr.indexOf(first + 2);

    if (secondIndex !== -1 && thirdIndex !== -1) {
      let newArr = arr.slice();
      newArr.splice(thirdIndex, 1);
      newArr.splice(secondIndex, 1);
      newArr.splice(0, 1);

      if (checkTripletsAndSequences(newArr, needPair)) {
        return true;
      }
    }

    // 检查对子
    if (needPair && arr[1] === arr[0]) {
      if (checkTripletsAndSequences(arr.slice(2), false)) {
        return true;
      }
    }

    return false;
  }

  // 开始检查
  return checkTripletsAndSequences(tiles, true);
}

/**
 * 判断14张牌是否符合 7DD
 * @param {Array<number>} tiles
 * @returns {boolean}
 */
function checkDD7(tiles) {
  // 对牌进行排序
  tiles.sort((a, b) => a - b);
  // 检查是否有七个对子
  let pairCount = 0;
  for (let i = 0; i < tiles.length - 1; i += 2) {
    if (tiles[i] === tiles[i + 1]) {
      pairCount++;
    } else {
      return false;
    }
  }
  return pairCount === 7;
}

/**
 * 检查14张牌是否胡牌
 * 即：符合公式 mAAA+nABC+DD 其中 m、n为任意非负数且m + n = 4 或者符合公式 7DD
 * @param {Array<number>} tiles
 * @returns {boolean}
 */
function checkWinningTiles(tiles) {
  if (tiles.length !== 14) {
    throw new Error("牌数不正确");
  }
  return checkAAAmABCnDD1(tiles) || checkDD7(tiles);
}

/**
 * 生成一副牌
 * 4张1万，4张2万，4张3万，4张4万，4张5万，4张6万，4张7万，4张8万，4张9万
 */
function generateTiles() {
  const baseTiles = [];
  for (let i = 1; i <= 9; i++) {
    baseTiles.push(...Array(4).fill(i));
  }
  return baseTiles;
}

/**
 * 打乱数组
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 从牌堆中取出指定数量的牌
 */
function getPaiFromTiles(tiles, num) {
  let pai = [];
  for (let i = 0; i < num; i++) {
    pai.push(tiles.shift());
  }
  return pai;
}

/**
 * 判断13张牌是否听牌
 * @returns {Array<number>} 听哪几张牌
 */
function getTingPai(tiles) {
  if (tiles.length !== 13) {
    throw new Error("牌数不正确");
  }
  const tingPai = [];
  for (let i = 1; i <= 9; i++) {
    const tmpPai = [...tiles, i];
    if (checkWinningTiles(tmpPai)) {
      tingPai.push(i);
    }
  }
  return tingPai;
}

/**
 * 生成听牌麻将的题目和答案对象
 */
function generateMahjongSubjectAndAnswerObj() {
  // 1. 生成一副牌
  let tiles = generateTiles();
  // 2. 随机打乱牌
  tiles = shuffle(tiles);
  // 3. 从打乱的牌中取出13张牌
  let pai = getPaiFromTiles(tiles, 13);
  // 4. 判断是否存在[1,9] 能使得这13张牌胡牌
  const tingPai = getTingPai(pai);
  if (tingPai.length > 0) {
    //   4.1 如果存在则说明处于听牌状态
    return {
      mahjongSubjectList: pai.sort((a, b) => a - b),
      mahjongAnswerList: tingPai,
    };
  } else {
    //  4.2否则重新执行1->4
    return generateMahjongSubjectAndAnswerObj();
  }
}

// 判断每一项是否存在【题目和答案 同一张牌的数量加起来超过4】的情况
function checkOverTotalItem(item) {
  const { mahjongSubjectList, mahjongAnswerList } = item;
  const cardResult = {}; // 记录每张牌出现的次数
  mahjongSubjectList.forEach((card) => {
    if (cardResult[card]) {
      cardResult[card]++;
    } else {
      cardResult[card] = 1;
    }
  });

  mahjongAnswerList.forEach((card) => {
    if (cardResult[card]) {
      cardResult[card]++;
    } else {
      cardResult[card] = 1;
    }
  });

  return Object.values(cardResult).some((count) => count > 4);
}

// 比较两个数组是否完全一样
function compareArray(arr1, arr2) {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index])
  );
}
// 判断新加入的题目在题库中是否已经存在
function checkItemExists(mahjongList, newItem) {
  const result = mahjongList.some(
    (item) =>
      compareArray(item.mahjongSubjectList, newItem.mahjongSubjectList) &&
      compareArray(item.mahjongAnswerList, newItem.mahjongAnswerList)
  );
  return result;
}

function writeDataToFile(data) {
  fs.writeFile(
    path.resolve(__dirname, "newConstant.js"),
    JSON.stringify(data),
    "utf8",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("写入成功!");
      }
    }
  );
}

function isNeedNum(newItem, needNum) {
  return newItem.mahjongAnswerList.length === needNum;
}

function validateRequiredItem(targetObj, result, needNum) {
  return (
    isNeedNum(targetObj, needNum) &&
    !checkOverTotalItem(targetObj) &&
    !checkItemExists(result, targetObj)
  );
}

function generateMahjongList(subjectNum, needNum) {
  let count = 0;
  let result = [];
  while (count < subjectNum) {
    const targetObj = generateMahjongSubjectAndAnswerObj();
    if (validateRequiredItem(targetObj, result, needNum)) {
      result.push(targetObj);
      count++;
    }
  }
  return result;
}
