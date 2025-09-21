// ------------------------
// Initial Setup
// ------------------------
const elr = document.querySelector('div.bets-widget-container');
if (elr && elr.attributes.length > 0) {
    elr.removeAttribute(elr.attributes[0].name);
}

const el = document.querySelector('div.bets-widget-container');
if (el) {
   el.setAttribute('_ngcontent-rni-c200', '');
   console.log('Attribute changed to _ngcontent-rni-c200');
}

document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML = '<div class="gameInformation"> </div>';

// ------------------------
// Settings
// ------------------------
const setting = {
    winnPatternSize: 3,
    faildPatternSize: 3,
};

let globalList = []; // Store all game odds

// ------------------------
// Utility Functions
// ------------------------
function toBinaryOutcome(data){
    return data.map(val => val < 2 ? 'fail' : 'win');
}

function detectPatterns(binaryData){
    const winPattern = [];
    const failPattern = [];
    let winCounter = 0, failCounter = 0;

    for(let i=0; i<binaryData.length; i++){
        if(binaryData[i] === 'win'){
            winCounter++;
            if(failCounter > 0){
                failPattern.push(failCounter);
                failCounter = 0;
            }
        } else {
            failCounter++;
            if(winCounter > 0){
                winPattern.push(winCounter);
                winCounter = 0;
            }
        }
    }

    return {winPattern, failPattern};
}

function predictNext(binaryData, patternSize=3){
    const currentPattern = binaryData.slice(0, patternSize);
    const historyPattern = binaryData.slice(patternSize); // skip current

    let nextOutcomeCounts = {win:0, fail:0};

    for(let i=0; i<=historyPattern.length - patternSize; i++){
        const slice = historyPattern.slice(i, i+patternSize);
        if(slice.toString() === currentPattern.toString() && historyPattern[i+patternSize]){
            nextOutcomeCounts[historyPattern[i+patternSize]]++;
        }
    }

    const total = nextOutcomeCounts.win + nextOutcomeCounts.fail;
    const winProb = total ? (nextOutcomeCounts.win/total)*100 : 0;
    const failProb = total ? (nextOutcomeCounts.fail/total)*100 : 0;

    return {winProb, failProb};
}

// ------------------------
// UI Functions
// ------------------------
function updatePattern(incw, decw, incf, decf){
    if(incw) setting.winnPatternSize++;
    if(decw && setting.winnPatternSize>0) setting.winnPatternSize--;
    if(incf) setting.faildPatternSize++;
    if(decf && setting.faildPatternSize>0) setting.faildPatternSize--;

    lastProcess();
}

function Menu(){
    const tag = document.getElementsByClassName("menu_custome")[0] || (() => {
        document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML += '<div class="menu_custome"> </div>';
        return document.getElementsByClassName("menu_custome")[0];
    })();

    tag.innerHTML = `
        <div>
            <center>
                Faild And Winn Size
                <div>
                    <button onclick="updatePattern(0,0,0,1)">-</button> ${setting.faildPatternSize} <button onclick="updatePattern(0,0,1,0)">+</button>
                </div>
                <div>
                    <button onclick="updatePattern(0,1,0,0)">-</button> ${setting.winnPatternSize} <button onclick="updatePattern(1,0,0,0)">+</button>
                </div>
            </center>
        </div>
    `;
}

function oddHistoryTable(){
    const tag = document.getElementsByClassName("oddHistoryTable")[0] || (() => {
        document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML += '<div class="oddHistoryTable"> </div>';
        return document.getElementsByClassName("oddHistoryTable")[0];
    })();

    const binaryList = toBinaryOutcome(globalList);
    const FaildData = detectPatterns(binaryList).failPattern.slice(0, 18);
    const WinData = detectPatterns(binaryList).winPattern.slice(0, 18);
    const currentOdd = globalList[0];
    const prediction = predictNext(binaryList, 3);

    let tableHTML = `<br>
        <table border="1px solid" width="100%">
        <tbody>
            <tr><th>Index</th><th>Odd</th><th>Outcome</th></tr>`;

    for(let i=0; i<Math.min(globalList.length, 15); i++){
        const color = binaryList[i] === 'win' ? 'green' : 'red';
        tableHTML += `<tr>
            <td>${i}</td>
            <td>${globalList[i]}</td>
            <td style="color:${color}">${binaryList[i]}</td>
        </tr>`;
    }

    tableHTML += `</tbody></table>`;
    tableHTML += `<div style="margin-top:5px; border:1px solid gray; padding:5px;">
        <b>Next Game Prediction:</b> Win: ${prediction.winProb.toFixed(0)}%, Fail: ${prediction.failProb.toFixed(0)}%
    </div>`;

    tag.innerHTML = tableHTML;

    cashoutOdd = parseFloat(document.getElementsByClassName("app-bet-control bet-control double-bet")[0].getElementsByClassName("cashout-block")[0].getElementsByTagName("input")[0].value)

    if(cashoutOdd > 1.99 && prediction.winProb.toFixed(0) >= 70){
        document.getElementsByClassName("app-bet-control bet-control double-bet")[0].getElementsByClassName("btn ng-star-inserted btn-success bet")[0].click()
    }
}

function oddPatternPrivius(){
    const tag = document.getElementsByClassName("oddPatternPrivius")[0] || (() => {
        document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML += '<div class="oddPatternPrivius" style="font-size:13px; padding-left:5px"> </div>';
        return document.getElementsByClassName("oddPatternPrivius")[0];
    })();

    const binaryList = toBinaryOutcome(globalList);

    const FaildData = detectPatterns(binaryList).failPattern.slice(0, 15);
    const WinData = detectPatterns(binaryList).winPattern.slice(0, 15);

    let FaildP_str = FaildData.join(',');
    let WinP_str = WinData.join(',');

    tag.innerHTML = `<div style="font-size:14px">Faild P: ${FaildP_str}</div>
                     <div style="font-size:14px">Winn P: ${WinP_str}</div>`;
}

// ------------------------
// Process Functions
// ------------------------
function lastProcess(){
    Menu();
    oddPatternPrivius();
    oddHistoryTable();
}

// ------------------------
// Global List Updates
// ------------------------
function getGlobalList(){
    const globalListHtml = document.getElementsByClassName("payout ng-star-inserted");
    const tmpGlobalList = Array.from(globalListHtml).map(el => parseFloat(el.innerText.replace('x','')));

    if(globalList.length === 0){
        globalList = tmpGlobalList;
    } else {
        // Update logic
        const positionSize = 4;
        const globalListPosition = globalList.slice(0, positionSize);
        let positionIndexPosition = 0;

        for(let x=0; x<tmpGlobalList.length; x++){
            if(globalListPosition.toString() === tmpGlobalList.slice(x, x+positionSize).toString()){
                positionIndexPosition = x;
                break;
            }
        }

        const newList = tmpGlobalList.slice(0, positionIndexPosition);
        globalList = [...newList, ...globalList];
        
        if(globalList.length > 35){
            tmp = globalList
            globalList = tmp.slice(0, 34)
        }

    }

    lastProcess();
}

// ------------------------
// Observer for Live Updates
// ------------------------
const target = document.querySelector('div.payouts-block');

if(target){
    const observer = new MutationObserver(() => getGlobalList());
    observer.observe(target, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    });
    console.log('Observation started on payouts-block div');
} else {
    console.warn('Target element not found');
}
