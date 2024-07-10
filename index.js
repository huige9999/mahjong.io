const domManager = {
  mahjongWrap: document.querySelector(".mahjong-wrap"),
  confirmBtn: document.querySelector(".confirm-btn"),
  inputNum: document.querySelector("#num"),
  selectNum: document.querySelector("#listen"),
  prev: document.querySelector(".prev"),
  toggleBtn: document.querySelector(".toggle-btn"),
};
let mahjongListRaw = null;
/**
 * 创建一个麻将题目Dom
 * @param {{mahjongSubjectList:Array<number>,mahjongAnswerList:Array<number>}} mahjongItem
 */
function createMahjongItem(mahjongItem) {
  const getUnit = (num) => {
    if (num >= 1 && num <= 9) {
      return "万";
    } else if (num >= 11 && num <= 19) {
      return "饼";
    } else if (num >= 21 && num <= 29) {
      return "条";
    }
  };
  const getQuestionListStr = () => {
    return mahjongItem.mahjongSubjectList
      .map((item) => {
        return `<div class="mahjong-item">${item}${getUnit(item)}</div>`;
      })
      .join("");
  };

  const getAnswerListStr = () => {
    return mahjongItem.mahjongAnswerList
      .map((item) => {
        return `<div class="mahjong-item">${item}${getUnit(item)}</div>`;
      })
      .join("");
  };
  const item = document.createElement("div");
  item.className = "item";
  item.innerHTML = `
    <div class="question">
     <div class="key">题目：</div>
      <div class="mahjong-list">
      ${getQuestionListStr()}
      </div>
      </div>
       <div class="answer">
        <div class="key">答案：</div>
        <div class="mahjong-list">
          ${getAnswerListStr(mahjongItem.mahjongAnswerList)}
          </div>
        </div>
    `;
  return item;
}
/**
 * 麻将题目Dom添加到容器中
 */
function appendMahjongItem(data) {
  const mahjongItem = createMahjongItem(data);
  domManager.mahjongWrap.appendChild(mahjongItem);
}

/**
 * 将题目数组添加到domManager中
 */
function addMahjongList(mahjongList) {
  if (mahjongList.length === 0) {
    return;
  }
  const mahjongItem = mahjongList.shift();
  appendMahjongItem(mahjongItem);
  setTimeout(() => {
    addMahjongList(mahjongList);
  }, 300);
}

function prevMahjongList() {
  domManager.prev.textContent = JSON.stringify(mahjongListRaw);
}

domManager.confirmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (mahjongListRaw?.length > 0) {
    alert("题目已经生成啦!");
    return;
  }
  // 生成题目数量
  const num = parseInt(domManager.inputNum.value);
  // 题目听牌数量
  const selectNum = parseInt(domManager.selectNum.value);
  if (!num) {
    alert("请输入正确的数字");
    return;
  }
  console.log(num, selectNum);
  mahjongListRaw = generateMahjongList(num, selectNum);
  const mahjongList = [...mahjongListRaw]
  addMahjongList(mahjongList);
  prevMahjongList();
  domManager.toggleBtn.classList.remove("hidden");
});

domManager.toggleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const mahjongWrapClassList = Array.from(domManager.mahjongWrap.classList);
  if (mahjongWrapClassList.includes("hidden")) {
    domManager.mahjongWrap.classList.remove("hidden");
    domManager.prev.classList.add("hidden");
  } else {
    domManager.mahjongWrap.classList.add("hidden");
    domManager.prev.classList.remove("hidden");
  }
});
