const menu = document.getElementById('menu');

// let a = menu.getElementsByTagName('li')
// console.log(Array.from(a))

const menuLIs = Array.from(menu.getElementsByTagName('li'));
const subMenu = document.getElementById('sub-menu');
const subMenuLIs = Array.from(subMenu.getElementsByTagName('li'));
const container = document.querySelector('.container');

// 存储鼠标移动时的坐标
let mouseLocs = [];
// container 右上角和右下角坐标
const menuTopRight = {x: menu.offsetWidth, y: 0}, menuBottomRight = {x: menu.offsetWidth, y: menu.offsetHeight};

menuLIs.forEach((item, index) => item.index = index);
menu.addEventListener('mouseover', handleToggleTabs);
menu.addEventListener('mousemove', storeMouseLocation);
menu.addEventListener('mouseout', clearTimeouter);


function handleToggleTabs(e) {
    if (e.target.nodeName.toUpperCase() === 'LI') {
        let currentMenu = e.target;
        let isInTriRange;

        // subMenu 添加 show-block 类，让其显示
        subMenu.className = 'sub-menu show-block';

        // 设置一个定时器
        currentMenu.timeouter = null;

        console.log('mouseLocs :', mouseLocs);
        try {
            isInTriRange = isTriangleRange(mouseLocs[0], mouseLocs[2], menuTopRight, menuBottomRight);
        } catch (err) {

        }

        // 结果为 true，说明在三角区域内
        if (isInTriRange) {
            currentMenu.timeouter = setTimeout(function () {
                toggle(subMenuLIs, currentMenu.index);
            }, 300)
        } else {
            toggle(subMenuLIs, currentMenu.index)
        }
    }
}

/**
 * 存储鼠标在当前选项卡移动时的最后三个坐标
 * @param e
 */
function storeMouseLocation(e) {
    if (e.target.nodeName.toUpperCase() === 'LI') {

        // 坐标原点在 container 右上角
        const x = e.clientX - container.offsetLeft, y = e.clientY - container.offsetTop;
        mouseLocs.push({x, y});

        if (mouseLocs.length > 3) {
            mouseLocs.shift();
        }
    }
}

/**
 * 鼠标移出当前选项卡时，如果当前选项卡设置了定时器，说明判断 isInTriangle 为 true,
 * 定时器内设置的是切换选项卡的 function，这时，清除定时器，便不会触发 toggle 切换选项卡
 * @param e
 */
function clearTimeouter(e) {
    if (e.target.nodeName.toUpperCase() === 'LI') {

        if (e.target.timeouter) {
            clearTimeout(e.target.timeouter);
        }
    }
}

/**
 * 切换选项卡和内容样式
 * @param eleArr subMenuLIs
 * @param id 当前选择的选项卡 ID
 */
function toggle(eleArr, id) {

    eleArr.forEach((item, index) => {
        menuLIs[index].className = '';
        item.className = '';
    });
    menuLIs[id].className = 'active-menu';
    eleArr[id].className = 'show-block';
}

/**
 * 计算三角形区域的方法
 * @param t1 开始鼠标坐标位置
 * @param t2 结束时鼠标坐标位置
 * @param p1 container 右上角坐标
 * @param p2 container 右下角坐标
 * @returns {boolean}
 */
function isTriangleRange(t1, t2, p1, p2) {

    const x = t2.x,
        y = t2.y,

        x1 = t1.x,
        y1 = t1.y,

        x2 = p1.x,
        y2 = p1.y,

        x3 = p2.x,
        y3 = p2.y,

        /**
         * (y2 - y1) / (x2 - x1)为两坐标连成直线的斜率
         * 因为直线的公式为 y=kx+b;
         * 当斜率相同时，只要比较 b1 和 b2 的差值就可以知道该点是在(x1,y1),(x2,y2)的直线的哪个方向,
         * 当r1大于0，说明该点在直线右侧，其它以此类推
         */

        r1 = y - y1 - (y2 - y1) / (x2 - x1) * (x - x1),
        r2 = y - y2 - (y3 - y2) / (x3 - x2) * (x - x2),
        r3 = y - y3 - (y1 - y3) / (x1 - x3) * (x - x3);

        console.log(x,y);
        console.log(x1,y1);
        console.log(x2,y2);
        console.log(x3,y3);

    return (r1 * r2 * r3 < 0) && (r1 > 0);
}